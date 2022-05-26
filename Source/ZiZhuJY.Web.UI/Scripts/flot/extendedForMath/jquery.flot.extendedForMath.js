;
(function ($, lex, parser) {

    var parserCache = {};

    function getParsingResult(s) {
        if (!parserCache[s]) {
            parser.init(s);
            parser.run();

            parserCache[s] = {
                tree: $.extend(true, {}, parser.tree),
                errorList: $.extend(true, [], parser.errorList)
            };
        }

        return parserCache[s];
    }

    function generateFunctionObjectFromExpression(s, plot) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var funcObj = {};

        var parsingResult = getParsingResult(s);
        var tree = parsingResult.tree;
        funcObj.errorList = parsingResult.errorList;
        funcObj.isValid = parsingResult.errorList.length <= 0;

        funcObj.numberOfPoints = 300;

        // Determin type
        (function () {
            if (funcObj.isValid && !!tree) {

                var constraints = parser.getConstraints(tree) || {};
                constraints = $.extend(true, {}, { x: [], y: [], t: [] }, constraints);

                // Get equation type and domain, ranges.
                if (tree.children.length == 3 || tree.children.length == 4) {
                    // x=f(y) or y=f(x) or f(x, y) = g(x, y)
                    if (tree.children[0].getLeaves().length == 1 && tree.children[0].getLeaves()[0].nodeType == parser.nodeTypeEnum.VARIABLE_NAME) {
                        // x=f(x, y) or y=f(x, y)
                        if (tree.children[0].getLeaves()[0].expression == "y"
                            && !tree.children[2].getLeaves().filter(function (item) { return item.nodeType == parser.nodeTypeEnum.VARIABLE_NAME; }).map(function (item) { return item.expression; }).contains("y")
                        && tree.children[1].getExpression() === "=") {
                            funcObj.type = "y=f(x)";
                            funcObj.independentVar = null;
                            funcObj.dependentVars = [
                                function (/* x */) {
                                    var x = arguments[0];
                                    return eval(tree.children[2].eval());
                                }];
                            funcObj.domain = {
                                min: eval(constraints.x[0]),
                                max: eval(constraints.x[1])
                            };
                            funcObj.range = {
                                min: eval(constraints.y[0]),
                                max: eval(constraints.y[1])
                            };
                        } else if (tree.children[0].getLeaves()[0].expression == "x"
                            && !tree.children[2].getLeaves().filter(function (item) { return item.nodeType == parser.nodeTypeEnum.VARIABLE_NAME; }).map(function (item) { return item.expression; }).contains("x")
                        && tree.children[1].getExpression() === "=") {
                            funcObj.type = "x=f(y)";
                            funcObj.independentVar = null;
                            funcObj.dependentVars = [function (/* y */) {
                                var y = arguments[0];
                                return eval(tree.children[2].eval());
                            }];
                            funcObj.domain = {
                                min: eval(constraints.y[0]),
                                max: eval(constraints.y[1])
                            };
                            funcObj.range = {
                                min: eval(constraints.x[0]),
                                max: eval(constraints.x[1])
                            };
                        } else {
                            // x= f(x, y) || y = f(x, y), treat them as f(x, y) = g(x, y)
                            funcObj.type = "f(x,y)=g(x,y)";
                            funcObj.left = tree.children[0].intervalEval();
                            funcObj.right = tree.children[2].intervalEval();
                            funcObj.operator = tree.children[1].intervalEval();
                            funcObj.domain = {
                                min: eval(constraints.x[0]),
                                max: eval(constraints.x[1])
                            };

                            funcObj.range = {
                                min: eval(constraints.y[0]),
                                max: eval(constraints.y[1])
                            };
                        }
                    } else if (tree.children[2].getLeaves().length == 1 && tree.children[2].getLeaves()[0].nodeType == parser.nodeTypeEnum.VARIABLE_NAME) {
                        // f(x, y) = x or f(x, y) = y
                        if (tree.children[2].getLeaves()[0].expression == "y"
                            && !tree.children[0].getLeaves().filter(function (item) { return item.nodeType == parser.nodeTypeEnum.VARIABLE_NAME; }).map(function (item) { return item.expression; }).contains("y")
                        && tree.children[1].getExpression() === "=") {
                            funcObj.type = "f(x)=y";
                            funcObj.independentVar = null;
                            funcObj.dependentVars = [function(/* x */) {
                                var x = arguments[0];
                                return eval(tree.children[0].eval());
                            }];
                            funcObj.domain = {
                                min: eval(constraints.x[0]),
                                max: eval(constraints.x[1])
                            };
                            funcObj.range = {
                                min: eval(constraints.y[0]),
                                max: eval(constraints.y[1])
                            };
                        } else if (tree.children[2].getLeaves()[0].expression == "x"
                            && !tree.children[0].getLeaves().filter(function (item) { return item.nodeType == parser.nodeTypeEnum.VARIABLE_NAME; }).map(function (item) { return item.expression; }).contains("x")
                        && tree.children[1].getExpression() === "=") {
                            funcObj.type = "f(y)=x";
                            funcObj.independentVar = null;
                            funcObj.dependentVars = [function (/* y */) {
                                var y = arguments[0];
                                return eval(tree.children[0].eval());
                            }];
                            funcObj.domain = {
                                min: eval(constraints.y[0]),
                                max: eval(constraints.y[1])
                            };
                            funcObj.range = {
                                min: eval(constraints.x[0]),
                                max: eval(constraints.x[1])
                            };
                        } else {
                            funcObj.type = "f(x,y)=g(x,y)";
                            funcObj.left = tree.children[0].intervalEval();
                            funcObj.right = tree.children[2].intervalEval();
                            funcObj.operator = tree.children[1].intervalEval();
                            funcObj.domain = {
                                min: eval(constraints.x[0]),
                                max: eval(constraints.x[1])
                            };

                            funcObj.range = {
                                min: eval(constraints.y[0]),
                                max: eval(constraints.y[1])
                            };
                        }
                    } else if (tree.children[0].nodeType == parser.nodeTypeEnum.EXPRESSION
                        && (tree.children[1].expression == "=" || tree.children[1].expression == "<"
                            || tree.children[1].expression == ">" || tree.children[1].expression == "\\le"
                            || tree.children[1].expression == "\\ge")
                        && tree.children[2].nodeType == parser.nodeTypeEnum.EXPRESSION) {

                        funcObj.type = "f(x,y)=g(x,y)";
                        funcObj.left = tree.children[0].intervalEval();
                        funcObj.right = tree.children[2].intervalEval();
                        funcObj.operator = tree.children[1].intervalEval();
                        funcObj.domain = {
                            min: eval(constraints.x[0]),
                            max: eval(constraints.x[1])
                        };
                        funcObj.range = {
                            min: eval(constraints.y[0]),
                            max: eval(constraints.y[1])
                        };
                    }
                } else if (tree.children.length >= 7 && tree.children[3].getLeaves().length == 1 && tree.children[3].getLeaves()[0].expression == ";") {
                    // x=f(t);y=g(t)
                    funcObj.type = "{x=f(t);y=g(t)}";
                    funcObj.independentVar = null;
                    funcObj.dependentVars = [
                        function (/* t */) {
                            var t = arguments[0];
                            return eval(tree.children[2].eval());
                        },
                        function (/* t */) {
                            var t = arguments[0];
                            return eval(tree.children[6].eval());
                        }
                    ];
                    funcObj.domain = {
                        min: typeof constraints.t[0] !== "undefined" ? eval(constraints.t[0]) : -Math.PI,
                        max: typeof constraints.t[1] !== "undefined" ? eval(constraints.t[1]) : Math.PI
                    };
                    funcObj.ranges = [
                        {
                            min: eval(constraints.x[0]),
                            max: eval(constraints.x[1])
                        },
                        {
                            min: eval(constraints.y[0]),
                            max: eval(constraints.y[1])
                        }
                    ];
                }
            }
        })();

        return funcObj;
    }

    function analyzeExpression(s, plot) {
        return {
            label: s,
            "function": generateFunctionObjectFromExpression(s, plot),
            data: []
        };
    }

    function decodeExpressions(expressions) {
        if (expressions != null && typeof (expressions) === "string" && expressions !== "") {
            // 1st, read the url
            var object = decodeURIComponent(expressions);
            // 2nd, remove the flag
            if (object.startsWith("base64/")) {
                object = object.substring("base64/".length);
                // 3rd, decode it from base64
                object = atob(object);
                // 4th, rebuild the object
                object = $.parseJSON(object);

                return $.isArray(object) ? object : [object];
            }

            return [expressions];
        } else {
            return $.isArray(expressions) ? expressions : [expressions];
        }
    }

    $.plot.funGrapher = {
        deserializeUrlParams: function () {
            return zizhujy.com.deserializeUrlParams.apply(zizhujy.com, Array.prototype.slice.call(arguments, 0));
        },

        generateFunctionObjectFromExpression: generateFunctionObjectFromExpression,
        analyzeExpression: analyzeExpression,
        decodeExpressions: decodeExpressions
    };
})(jQuery, zizhujy.com.LaTexLex, zizhujy.com.LaTexParser);

;
(function ($) {

    function prepare() {
        function extend(plot, extendOptions) {
            // Get rid of the 1st update always redraw the current view bug:
            validViewPort = {
                left: plot.getAxes().xaxis.min,
                right: plot.getAxes().xaxis.max,
                bottom: plot.getAxes().yaxis.min,
                top: plot.getAxes().yaxis.max,
                plotHeight: plot.height(),
                plotWidth: plot.width()
            };
            
            var extendDefaults = {
                update: {
                    interval: 500
                }
            };

            var options = $.extend(true, extendDefaults, plot.getOptions());
            options = $.extend(true, options, extendOptions);

            if (!plot.extended) {
                var draw = plot.draw;
                plot.addSeries = function (series) {
                    var currentSeries = plot.getData();
                    for (var i = 0; i < currentSeries.length; i++) {
                        currentSeries[i].suppressCompute = true;
                    }
                    currentSeries.push(series);

                    plot.setupGrid();
                    plot.draw(currentSeries);

                    if (!!urlParams && !!urlParams.debug) {
                        console.log("added series.");
                    }
                };

                plot.addMuchSeries = function (series) {
                    for (var i = 0; i < series.length; i++) {
                        plot.addSeries(series[i]);
                    }
                };

                plot.redraw = function (newSeries) {
                    var plot = this;
                    // keep the current view port range
                    $.each(plot.getAxes(), function (_, axis) {
                        axis.options.min = axis.min;
                        axis.options.max = axis.max;
                    });
                    plot.setupGrid();
                    if (!!newSeries) {
                        plot.draw(newSeries);
                    } else {
                        plot.draw(plot.getData());
                    }

                    if (!!urlParams && !!urlParams.debug) {
                        console.log("redrawed.");
                    }

                    validViewPort = {
                        left: plot.getAxes().xaxis.min,
                        right: plot.getAxes().xaxis.max,
                        bottom: plot.getAxes().yaxis.min,
                        top: plot.getAxes().yaxis.max,
                        plotHeight: plot.height(),
                        plotWidth: plot.width()
                    };
                };

                plot.draw = function (newSeries) {
                    if (!!newSeries) {
                        plot.assignColors(newSeries);
                        plot.setData(newSeries);
                    }

                    draw.apply(plot);
                };

                plot.assignColors = function (series) {
                    var colorPool = plot.getOptions().colors;

                    if (colorPool instanceof Array && colorPool.length > 0) {
                        for (var i = 0; i < series.length; i++) {
                            if (i >= colorPool.length) {
                                series[i].color = series[i].color || $.color.parse(colorPool[i % colorPool.length]).scale("rgb", Math.random(0.5555, 20.5555)).toString();
                            } else {
                                series[i].color = series[i].color || colorPool[i];
                            }
                        }
                    } else {
                        // Random color
                        for (var i = 0; i < series.length; i++) {
                            series[i].color = series[i].color || ('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6));
                        }
                    }
                };

                var resize = plot.resize;
                plot.resize = function (width, height) {
                    resize(width, height);
                    var placeholder = plot.getPlaceholder();
                    width = width || placeholder.width();
                    height = height || placeholder.height();
                    var layers = placeholder.find("canvas");
                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];
                        //var canvas = new plotClasses.Canvas(layer.className, placeholder);
                        //canvas.resize(width, height);
                        layer.style.height = height + "px";
                        layer.style.width = width + "px";
                    }
                };

                var intervalId = 0;
                plot.update = function () {
                    intervalId = setInterval(function () {
                        //console.log("Checking if redraw needed...");
                        if (drawingQueue.length <= 0 && window.idle) {
                            var currentViewPort = {
                                left: plot.getAxes().xaxis.min,
                                right: plot.getAxes().xaxis.max,
                                bottom: plot.getAxes().yaxis.min,
                                top: plot.getAxes().yaxis.max,
                                plotHeight: plot.height(),
                                plotWidth: plot.width()
                            };

                            if (!validViewPort || currentViewPort.left != validViewPort.left
                                || currentViewPort.right != validViewPort.right
                                || currentViewPort.top != validViewPort.top
                                || currentViewPort.bottom != validViewPort.bottom
                                /*|| currentViewPort.plotHeight != validViewPort.plotHeight
                                || currentViewPort.plotWidth != validViewPort.plotWidth*/) {
                                // Yes, replotting needed:
                                //plot.setData(plot.getData());
                                //console.log("redrawing...");
                                plot.redraw();
                            } else {
                                //console.log("viewport not changed, redraw is not neccessary.");
                            }

                            plot.recentViewPort = $.extend(true, {}, currentViewPort);
                        }
                    }, options.update.interval);
                };

                plot.stop = function () {
                    window.clearInterval(intervalId);
                };

                plot.extended = true;

                // Helpers:
            }

            return plot;
        }

        var originPlot = $.plot;

        if (!originPlot.extended) {

            $.plot = function (placeholder, data, options) {
                var plot = extend(originPlot(placeholder, data, options), options);
                return plot;
            };

            for (var p in originPlot) {
                $.plot[p] = originPlot[p];
            }

            $.plot.extended = true;
            $.plot.extendedBy = $.plot.extendedBy || [];
            $.plot.extendedBy.push("jquery.flot.extendedForMath.js");
        }
    }

    function computeDataPoints(plot) {
        var f = typeof this["function"] !== "undefined" ? this["function"] : null;
        if (f !== null) {
            var type = f.type || "";
            switch (type) {
                case "y=f(x)":
                case "f(x)=y":
                    var x = f.independentVar;

                    if (x === null || typeof x === "undefined") {
                        x = defaultX;
                    }

                    if (typeof x === "function") {
                        x = x(plot, f.numberOfPoints);
                    }

                    if (!(x instanceof Array)) {
                        throw "independent var should be an array.";
                    }

                    var y = f.dependentVars[0];
                    var domain = $.extend(true, defaultDomain(f, plot.getAxes().xaxis, plot.width()), f.domain);
                    var range = $.extend(true, { min: -Infinity, max: Infinity }, f.range);
                    return this.data = computefx(this.data, x, y, domain, range);
                    break;
                case "x=f(y)":
                case "f(y)=x":
                    var y = f.independentVar;
                    if (y === null || typeof y === "undefined") {
                        y = defaultY;
                    }

                    if (typeof y === "function") {
                        y = y(plot, f.numberOfPoints);
                    }

                    if (!(y instanceof Array)) {
                        throw "independent var should be an array.";
                    }

                    var x = f.dependentVars[0];
                    var domain = $.extend(true, defaultDomain(f, plot.getAxes().yaxis, plot.height()), f.domain);
                    var range = $.extend(true, { min: -Infinity, max: Infinity }, f.range);
                    return this.data = computefy(this.data, y, x, domain, range);
                    break;
                case "{x=f(t);y=g(t)}":
                    var t = f.independentVar;

                    if (t === null || typeof t === "undefined") {
                        t = defaultT;
                    }

                    if (typeof t === "function") {
                        t = t(plot, f.numberOfPoints, f.domain.min, f.domain.max);
                    }

                    if (!(t instanceof Array)) {
                        throw "independent var should be an array.";
                    }

                    var x = f.dependentVars[0];
                    var y = f.dependentVars[1];

                    var domain = $.extend(true, defaultDomainT(f, plot), f.domain);
                    var ranges = $.extend(true, [{ min: -Infinity, max: Infinity }, { min: -Infinity, max: Infinity }], f.ranges);
                    return this.data = computefgt(this.data, t, x, y, domain, ranges);
                    break;
                case "f(x,y)=g(x,y)":
                    return this.data; // = this.data.splice(0, this.data.length);
                    break;
                default:
                    // Not supported
                    //throw "Don't know how to compute for this function object yet. function: " + JSON.stringify(f);
                    console.log("Don't know how to compute for this function object yet. function: " + JSON.stringify(f));
                    return [];
                    break;
            }
        } else {
            return this.data || [[]];
        }
    }

    function computefx(data, array, f, domain, range) {
        data.splice(0, data.length);

        data = data.concat(Plotter.sampleXY(f, domain, range));

        return data;
    }

    function computefy(data, array, f, domain, range) {
        data = computefx(data, array, f, domain, range).swapCols(0, 1);

        return data;
    }

    function computefgt(data, array, f, g, domain, ranges) {
        data.splice(0, data.length);

        data = data.concat(Plotter.sampleTXY(f, g, domain, ranges));

        return data;
    }

    function defaultX(plot, numberOfPoints) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;

        var numberOfPoints = numberOfPoints || 300;
        var res = [];

        var start = (typeof xaxis.min === "undefined" || xaxis.min === null) ? -10 : xaxis.min;
        var end = (typeof xaxis.max === "undefined" || xaxis.max === null) ? 10 : xaxis.max;
        var delta = (end - start) / numberOfPoints;

        for (var x = start; x <= end; x += delta) {
            res.push(x);
        }

        return res;
    }

    function defaultDomain(functionObj, axis, viewPortLength) {
        var numberOfPoints = functionObj.numberOfPoints || 300;

        var start = (typeof axis.min === "undefined" || axis.min === null) ? -10 : axis.min;
        var end = (typeof axis.max === "undefined" || axis.max === null) ? 10 : axis.max;
        var delta = (end - start) / numberOfPoints;

        var domain = {
            min: start,
            max: end,
            step: delta,
            tolerance: (end - start) / viewPortLength
        };

        return domain;
    }

    function defaultDomainT(functionObj, plot) {
        var numberOfPoints = functionObj.numberOfPoints || 300;

        var start = -Math.PI;
        var end = Math.PI;
        var delta = (end - start) / numberOfPoints;

        var axes = plot.getAxes();
        var yaxis = axes.yaxis;
        var xaxis = axes.xaxis;
        var ytolerance = (yaxis.max - yaxis.min) / plot.height();
        var xtolerance = (xaxis.max - xaxis.min) / plot.width();
        return {
            min: start,
            max: end,
            step: delta,
            tolerance: Math.min(ytolerance, xtolerance)
        };
    }

    function defaultY(plot, numberOfPoints) {
        var axes = plot.getAxes();
        var yaxis = axes.yaxis;

        var numberOfPoints = numberOfPoints || 300;
        var res = [];

        var start = (typeof yaxis.min === "undefined" || yaxis.min === null) ? -10 : yaxis.min;
        var end = (typeof yaxis.max === "undefined" || yaxis.max === null) ? 10 : yaxis.max;
        var delta = (end - start) / numberOfPoints;

        for (var y = start; y <= end; y += delta) {
            res.push(y);
        }

        return res;
    }

    function defaultT(plot, numberOfPoints, tStart, tEnd) {
        var numberOfPoints = numberOfPoints || 300;
        var res = [];

        var start = (typeof tStart === "undefined" || tStart === null) ? -Math.PI : tStart;
        var end = (typeof tEnd === "undefined" || tEnd === null) ? Math.PI : tEnd;
        var delta = (end - start) / numberOfPoints;

        for (var t = start; t <= end; t += delta) {
            res.push(t);
        }

        return res;
    }

    function outerBoundary(region, plot) {
        return region;
    }

    function innerBoundary(region, plot) {
        return region;
    }

    function expandRegion(region, plot) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var pixelWidth = (xaxis.max - xaxis.min) / plot.width();
        var pixelHeight = (yaxis.max - yaxis.min) / plot.height();

        region.xRange.val[0] -= pixelWidth;
        region.xRange.val[1] += pixelWidth;
        region.yRange.val[0] -= pixelHeight;
        region.yRange.val[1] += pixelHeight;
        return region;
    }

    function drawImplicitPhasely(plot, ctx, info, redFound, whiteFound, yellowFound, refining) {
        info = fourSubsquaresAllUndecided(plot, ctx, info);
        info = refinePixels(plot, ctx, info, redFound, whiteFound, yellowFound, refining);

        return info;
    }

    function fourSubsquaresAllUndecided(plot, ctx, info) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;
        var pixelWidth = (xaxis.max - xaxis.min) / plot.width();
        var pixelHeight = (yaxis.max - yaxis.min) / plot.height();

        var undecided = [];
        for (var i = 0; i < info.undecidedU.length; i++) {
            undecided = undecided.concat(fourSubsquares(info.undecidedU[i], pixelWidth, pixelHeight, info.yellows));
        }

        info.undecidedU = undecided;

        return info;
    }

    function refinePixels(plot, ctx, info, redFound, whiteFound, yellowFound, refining) {
        var newUndecided = [];
        //var start = new Date();
        for (var i = 0; i < info.undecidedU.length; i++) {
            var region = info.undecidedU[i];
            // paint yellow (not checked yet)
            if (typeof refining === "function") {
                refining(region, info);
            } else {
                paintRegionWithColor(plot, region, "rgba(255, 255, 0, 0.5)", ctx);
            }

            var res = info.r(outerBoundary(region, plot));

            if (res.val.equals([true, true]) && res.def.equals([true, true])) {
                // paint red
                region.red = true;
                info.reds.push(region);

                if (typeof redFound === "function") {
                    redFound(region);
                } else {
                    paintRegionWithColor(plot, region, "rgba(255, 0, 0, 0.8)", ctx);
                }
            } else if (res.val.equals([false, false]) && res.def.equals([true, true]) || res.def.equals([false, false])) {
                // paint white
                region.white = true;
                if (typeof whiteFound === "function") {
                    whiteFound(region);
                } else {
                    paintRegionWithColor(plot, region, "rgba(255, 255, 255, 0.8)", ctx);
                }
            } else {
                if (res.val.equals([true, true]) || res.val.equals([false, true]) && res.def.equals([true, true])) {
                    // yellow regions are not decided to be red, but very plausible
                    region.yellow = true;

                    if (typeof yellowFound === "function") {
                        yellowFound(region);
                    }
                }

                newUndecided.push(region);
            }

            //var now = new Date();
            //var timeEllapsed = now.getTime() - start.getTime();
            //if (timeEllapsed > 1000) {
            //    break;
            //}
        }

        info.undecidedU = newUndecided;

        return info;
    }

    function paintRegionWithColor(plot, region, color, ctx) {
        ctx.fillStyle = color;

        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;

        var x = xaxis.p2c(region.xRange.val[0]);
        var y = yaxis.p2c(region.yRange.val[0]);
        var w = xaxis.p2c(region.xRange.val[1]) - x;
        var h = yaxis.p2c(region.yRange.val[1]) - y;

        ctx.fillRect(x, y, w, h);
    }

    function paintRegionsWithColor(plot, regions, color, ctx) {
        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;

        ctx.save();
        var plotOffset = plot.getPlotOffset();
        ctx.translate(plotOffset.left, plotOffset.top);

        ctx.fillStyle = color;
        for (var i = 0; i < regions.length; i++) {
            var region = regions[i];

            var x = xaxis.p2c(region.xRange.val[0]);
            var y = yaxis.p2c(region.yRange.val[0]);
            var w = xaxis.p2c(region.xRange.val[1]) - x;
            var h = yaxis.p2c(region.yRange.val[1]) - y;

            ctx.fillRect(x, y, w, h);
        }

        ctx.restore();
    }

    function fourSubsquares(u, pixelWidth, pixelHeight, yellows) {
        var subSquares = [];

        pixelWidth *= 2.5;
        pixelHeight *= 2.5;

        if (!!u) {
            var xDistance = u.xRange.val[1] - u.xRange.val[0];
            var yDistance = u.yRange.val[1] - u.yRange.val[0];
            var xMid;
            var yMid;

            if (xDistance > pixelWidth && yDistance > pixelHeight) {
                xMid = (u.xRange.val[0] + xDistance / 2);
                yMid = (u.yRange.val[0] + yDistance / 2);
                subSquares.push({ xRange: { val: [u.xRange.val[0], xMid], def: [true, true] }, yRange: { val: [u.yRange.val[0], yMid], def: [true, true] } });
                subSquares.push({ xRange: { val: [xMid, u.xRange.val[1]], def: [true, true] }, yRange: { val: [u.yRange.val[0], yMid], def: [true, true] } });
                subSquares.push({ xRange: { val: [u.xRange.val[0], xMid], def: [true, true] }, yRange: { val: [yMid, u.yRange.val[1]], def: [true, true] } });
                subSquares.push({ xRange: { val: [xMid, u.xRange.val[1]], def: [true, true] }, yRange: { val: [yMid, u.yRange.val[1]], def: [true, true] } });
            } else if (xDistance > pixelWidth) {
                xMid = (u.xRange.val[0] + xDistance / 2);
                subSquares.push({ xRange: { val: [u.xRange.val[0], xMid], def: [true, true] }, yRange: u.yRange });
                subSquares.push({ xRange: { val: [xMid, u.xRange.val[1]], def: [true, true] }, yRange: u.yRange });
            } else if (yDistance > pixelHeight) {
                yMid = (u.yRange.val[0] + yDistance / 2);
                subSquares.push({ xRange: u.xRange, yRange: { val: [u.yRange.val[0], yMid], def: [true, true] } });
                subSquares.push({ xRange: u.xRange, yRange: { val: [yMid, u.yRange.val[1]], def: [true, true] } });
            } else {
                if (!!u.yellow) {
                    yellows.push(u);
                }
            }

            return subSquares;
        }

        return subSquares;
    }

    function defaultFunctionU(u, left, right, operator) {
        var result = { val: [false, false], def: [true, true] };

        try {
            // Will be used in the left/right expressions, do not delete!!!
            var x = u.xRange;
            var y = u.yRange;

            left = eval("left = " + left);
            right = eval("right = " + right);

            switch (operator) {
                case "=":
                    result = IntervalArithmetic.equals(left, right);
                    return result;
                    break;
                case "<":
                    result = IntervalArithmetic.greaterThan(right, left);
                    return result;
                    break;
                case "<=":
                    result = IntervalArithmetic.not(IntervalArithmetic.greaterThan(left, right));
                    return result;
                    break;
                case ">":
                    result = IntervalArithmetic.greaterThan(left, right);
                    return result;
                    break;
                case ">=":
                    result = IntervalArithmetic.not(IntervalArithmetic.greaterThan(right, left));
                    return result;
                    break;
                default:
                    break;
            }
        } catch (ex) {
            console.log(ex);
        }

        return result;
    }

    function drawImplicitPhaselyWrapper(plot, layer, info, redFound, whiteFound, yellowFound, refining) {
        //var ctx = newLayer.context;
        var ctx = layer.context;
        ctx.save();
        var plotOffset = plot.getPlotOffset();
        ctx.translate(plotOffset.left, plotOffset.top);

        //layer.clear();
        //ctx.fillRect(xaxis.p2c(i), yaxis.p2c(i), 100 + i, 100 + i);
        info = drawImplicitPhasely(plot, ctx, info, redFound, whiteFound, yellowFound, refining);

        ctx.restore();

        //layer.clear();

        /*
        var temp = layer;
        layer = newLayer;
        newLayer = temp;
        */
    }

    // Do it intervally
    function drawImplicit(plot, baseContext, funcObj, operator, layer, classes, success, redFound, whiteFound, yellowFound, refining, starting) {
        executeCallback(starting);

        var axes = plot.getAxes();
        var xaxis = axes.xaxis;
        var yaxis = axes.yaxis;

        var domain = $.extend(true, {}, { min: -Infinity, max: Infinity }, funcObj.domain);
        var range = $.extend(true, {}, { min: -Infinity, max: Infinity }, funcObj.range);

        //var newLayer = new classes.Canvas(layer.element.className + "-new", plot.getPlaceholder());
        var info = {
            undecidedU: [
                {
                    xRange: { val: [Math.max(xaxis.min, domain.min), Math.min(xaxis.max, domain.max)], def: [true, true] },
                    yRange: { val: [Math.max(yaxis.min, range.min), Math.min(yaxis.max, range.max)], def: [true, true] }
                }
            ],
            reds: [

            ],
            yellows: [
            ],
            r: function (region) {
                var funcU = funcObj.functionU || defaultFunctionU;
                return funcU(region, funcObj.left, funcObj.right, operator);
            }
        };

        drawImplicitIntervally(plot, layer, info, funcObj, success, redFound, whiteFound, yellowFound, refining);
    }

    function drawImplicitIntervally(plot, layer, info, funcObj, success, redFound, whiteFound, yellowFound, refining) {
        funcObj.status = funcObj.status || "";

        switch (funcObj.status) {
            case "":
                if (drawingQueue.filter(function (item) {
                    return item.key === layer.element.className;
                }).length > 0) {
                    // New same job --> stopping
                    // If the drawingQueue contains this layer, then I must stop immediately.
                    // Because there is a newer version of drawing this layer, I was staled.
                    funcObj.status = "stopping";

                    if (!!urlParams && !!urlParams.debug) {
                        console.log("Staled me. " + funcObj.left + " " + funcObj.operator + " " + funcObj.right);
                    }
                } else if (!window.idle) {
                    // User interactive --> pausing
                    funcObj.status = "pausing";
                } else {
                    // draw --> running
                    funcObj.status = "running";
                }
                break;
            case "pausing":
                if (drawingQueue.filter(function (item) {
                    return item.key === layer.element.className;
                }).length > 0) {
                    // New same job --> stopping
                    // If the drawingQueue contains this layer, then I must stop immediately.
                    // Because there is a newer version of drawing this layer, I was staled.
                    funcObj.status = "stopping";

                    if (!!urlParams && !!urlParams.debug) {
                        console.log("Staled me. " + funcObj.left + " " + funcObj.operator + " " + funcObj.right);
                    }
                } else if (window.idle) {
                    // User Idle --> running
                    funcObj.status = "running";
                } else {
                    setTimeout(function () {
                        drawImplicitIntervally(plot, layer, info, funcObj, success, redFound, whiteFound, yellowFound, refining);
                    }, 100 + Math.random(0, 100));
                    return;
                }
                break;
            case "stopping":
                // Stopped old --> empty ""
                funcObj.status = "";
                return;
                break;
            case "running":
                if (drawingQueue.filter(function (item) {
                    return item.key === layer.element.className;
                }).length > 0) {
                    // New same job --> stopping
                    // If the drawingQueue contains this layer, then I must stop immediately.
                    // Because there is a newer version of drawing this layer, I was staled.
                    funcObj.status = "stopping";

                    if (!!urlParams && !!urlParams.debug) {
                        console.log("Staled me. " + funcObj.left + " " + funcObj.operator + " " + funcObj.right);
                    }
                } else {
                    if (info.undecidedU.length <= 0) {
                        funcObj.status = "done";
                    } else if (!window.idle) {
                        funcObj.status = "pausing";
                    } else {
                        drawImplicitPhaselyWrapper(plot, layer, info, redFound, whiteFound, yellowFound, refining);

                        setTimeout(function () {
                            drawImplicitIntervally(plot, layer, info, funcObj, success, redFound, whiteFound, yellowFound, refining);
                        }, 100 + Math.random(0, 100));
                        return;
                    }
                }
                break;
            case "done":
                if (drawingQueue.filter(function (item) {
                    return item.key === layer.element.className;
                }).length > 0) {
                    // New same job --> stopping
                    // If the drawingQueue contains this layer, then I must stop immediately.
                    // Because there is a newer version of drawing this layer, I was staled.
                    funcObj.status = "stopping";

                    if (!!urlParams && !!urlParams.debug) {
                        console.log("Staled me. " + funcObj.left + " " + funcObj.operator + " " + funcObj.right);
                    }
                } else {
                    // callback can call this function too (may be indirectly), so we must 
                    // retun this function before the callback is invoked.
                    setTimeout(function () {
                        layer.clear();
                        executeCallback(success, [info]);
                    }, 10);
                }

                return;
                break;
            default:
                return;
                break;
        }

        drawImplicitIntervally(plot, layer, info, funcObj, success, redFound, whiteFound, yellowFound, refining);
    }

    function queueDrawing(drawingJob) {
        if (typeof drawingJob.funcObj.isValid === "undefined" || drawingJob.funcObj.isValid === true) {
            drawingQueue.upsert(drawingJob, function (item) {
                return item.key === drawingJob.key;
            });
        }
    }

    function processNext(plot, callback) {
        var next = drawingQueue[0]; // drawingQueue.shift();
        while (typeof next === "object" && typeof next.func === "function") {
            //debugger;
            if (!!next.funcObj && !!next.funcObj.status && next.funcObj.status !== "" && next.funcObj.status !== "done" && next.funcObj.status !== "stopping") {
                // Don't do anything this time
                setTimeout(function () { processNext(plot, callback); }, 500);
            } else {
                drawingQueue.shift();
                next.funcObj.status = "";
                next.func(next.key);
                // next = drawingQueue.shift();
            }
            break;
        }

        if (drawingQueue.length === 0) {
            (typeof callback === "function") && callback(plot);
        }
    }

    function attachEvent(obj, event, func, userCapture) {
        if (obj.attachEventListener) {
            obj.addEventListener(event, func, !!userCapture);
            return true;
        } else if (obj.attachEvent) {
            return obj.attachEvent("on" + event, func);
        } else {
            try {
                var handler = obj["on" + event];

                if (typeof handler === "function") {
                    obj["on" + event] = function () {
                        var argsArray = Array.prototype.slice.call(arguments);
                        handler.apply(this, argsArray);
                        func.apply(this, argsArray);
                    };
                } else {
                    obj["on" + event] = func;
                }

                return true;
            } catch (ex) {
                throw ex;
            }
        }
    }

    function monitorUserActivity(plot) {
        function pauseAndLog(me) {
            pause(function () {
                if (!!urlParams && !!urlParams.debug) {
                    console.log("pausing by " + me);
                }
            });

            resetIdleTimer();
        }

        function pause(callback) {
            executeCallback(callback);
        }

        function resume(callback) {
            executeCallback(callback);
        }

        function idle() {
            window.idle = true;
            if (window.onIdle instanceof Array) {
                for (var i = 0; i < window.onIdle.length; i++) {
                    var handler = window.onIdle[i];
                    if (typeof handler.func === "function" && !handler.handled) {
                        handler.func();
                        handler.handled = true;
                    }
                }
            }
        }

        function resetIdleTimer() {
            window.idleTime = 0;
            window.idle = false;

            if (window.onIdle instanceof Array) {
                for (var i = 0; i < window.onIdle.length; i++) {
                    window.onIdle[i].handled = false;
                }
            }
        }

        //attachEvent(plot.getPlaceholder() || document, "mousemove", function () {
        //    pauseAndLog("mousemove");
        //});
        //attachEvent(plot.getPlaceholder() || document, "keydown", function () {
        //    pauseAndLog("keydown");
        //});
        //attachEvent(plot.getPlaceholder() || document, "click", function () {
        //    pauseAndLog("click");
        //});

        if (!window.onIdle) {
            window.onIdle = [];
        }

        window.onIdle.push({
            oneOff: false,
            handled: false,
            func: function () {
                resume(function () {
                    if (!!urlParams && !!urlParams.debug) {
                        console.log("resumed by user idle.");
                    }

                    executeCallback(plot.getOptions().onResume, [plot]);
                });
            }
        });

        setInterval(function () {
            window.idleTime += 500;
            if (!!urlParams && !!urlParams.debug) {
                console.log("user idled " + idleTime + " millisecond(s).");
            }
            if (idleTime > 1000) {
                idle();
            } else {
                window.idle = false;
            }
        }, 500);

        monitorUserActivity.pauseAndLog = pauseAndLog;
        monitorUserActivity.idle = idle;
    }

    var options = {};

    var plotClasses = null;
    var drawingQueue = [];
    var validViewPort = null;
    window.idleTime = 0;
    window.idle = false;
    var urlParams = zizhujy.com.deserializeUrlParams();

    prepare();
    function init(plot, classes) {
        monitorUserActivity(plot);
        plotClasses = classes;

        plot.hooks.processRawData.push(function (plot, s, data, datapoints) {
            // to trigger the plot width get calculated.
            plot.setupGrid();

            if (!!s.expression && !s["function"]) {
                // make function object according to expression
                s["function"] = $.plot.funGrapher.generateFunctionObjectFromExpression(s.expression, plot);
            }

            var funcObj = s["function"];

            (!!funcObj && !!funcObj.type && funcObj.type !== "f(x,y)=g(x,y)") && (funcObj = $.extend(true, { numberOfPoints: 300 }, funcObj));

            s.compute = computeDataPoints;
            if (!s.suppressCompute && !!funcObj && ((typeof funcObj.isValid === "undefined") || (funcObj.isValid === true))) {
                s.compute(plot);
            }

            if (!!funcObj && funcObj.isValid === false) {
                s.label = "";
                s.data.splice(0, s.data.length);
                s.willDraw = false;
                if (typeof s.onError === "function") {
                    s.onError(funcObj.errorList);
                }
            } else {
                if (!s.label) {
                    s.label = s.expression || "";
                }
                s.willDraw = true;
                if (typeof s.onValid === "function") {
                    s.onValid();
                }
            }
        });

        plot.hooks.drawBackground.push(function (plot, baseContext) {
        });

        plot.hooks.drawSeries.push(function (plot, baseContext, s) {
            function drawImplicitOnLayer(layerName, color, operator) {
                var layer = new plotClasses.Canvas(layerName, plot.getPlaceholder());
                $(layer.element).remove().insertBefore("canvas.flot-overlay");
                // should pass funcObj by reference!!! otherwise the idle won't resume them.
                drawImplicit(plot, baseContext, funcObj, operator, layer, plotClasses, function (info) {
                    // success:
                    paintRegionsWithColor(plot, info.yellows, color, layer.context);
                    //for (var i = 0; i < 30; i++) {
                    paintRegionsWithColor(plot, info.reds.map(function (r) {
                        return r;
                        //return expandRegion(r, plot);
                    }), color, layer.context);

                    executeCallback([s.onSuccess, plot.getOptions().onEnd]);
                    //}
                    processNext(plot, function (plot) {
                        executeCallback(plot.getOptions().onQueueEnd, [plot]);
                        /*
                        if (!addedSeries) {
                            plot.addSeries({
                                label: "y<2x",
                                data: [
                                ],
                                lines:
                                {
                                    show: true
                                },
                                color: "rgba(50,255,255, 0.5)",
                                "function": {
                                    numberOfPoints: 100,
                                    type: "f(x,y)=g(x,y)",
                                    left: "y",
                                    right: "x",
                                    operator: ">=",
                                    domain: {
                                        min: 0,
                                        max: 5
                                    },
                                    range: {
                                        min: 0,
                                        max: 5
                                    }
                                }
                            });
    
                            addedSeries = true;
                        }*/
                    });
                }, function (u) {
                    // red found
                    //paintRegionWithColor(plot, u, color, layer.context);
                }, function (u) {
                    // white found
                    //paintRegionWithColor(plot, u, "rgba(255, 255, 255, 0.5)", layer.context);
                }, function (u) {
                    // yellow found
                    //paintRegionWithColor(plot, u, "rgba(255, 255, 0, 0.6)", layer.context);
                }, function (u, info) {
                    // refining
                    //paintRegionWithColor(plot, u, color.toString(), layer.context);
                    //for (var i = 0; i < info.reds.length; i++) {
                    //    paintRegionWithColor(plot, info.reds[i], color, layer.context);
                    //}
                    executeCallback([s.onProgress, plot.getOptions().onProgress], s);
                }, function () {
                    executeCallback([s.onStart, plot.getOptions().onStart], s);
                });
            }

            if (!s.suppressCompute && !!s.willDraw) {
                var funcObj = $.extend(true, {}, s["function"], { status: "" });
                if (funcObj && funcObj.type && funcObj.type === "f(x,y)=g(x,y)") {

                    var operator = funcObj.operator;

                    var layerName = s.layerNames && s.layerNames.length > 0 ? s.layerNames[0] : undefined;
                    if (!layerName) {
                        layerName = "layer-" + Math.random().toString().replace(".", "");
                        if (!s.layerNames || s.layerNames.length === 0) {
                            s.layerNames = [layerName];
                        } else {
                            s.layerNames[0] = layerName;
                        }
                    }

                    queueDrawing({
                        key: layerName,
                        funcObj: funcObj,
                        func: function (layerName) {
                            var color = $.color.parse(s.color);
                            if (operator[0] !== '=') {
                                color.a = 0.6;
                            }
                            color = color.toString();
                            drawImplicitOnLayer(layerName, color, operator[0]);
                        }
                    });

                    if (operator.length === 2 && operator[1] === "=") {
                        var layerName = s.layerNames && s.layerNames.length > 1 ? s.layerNames[1] : undefined;
                        if (!layerName) {
                            layerName = "layer-" + Math.random().toString().replace(".", "");
                            if (!s.layerNames || s.layerNames.length === 0) {
                                s.layerNames = [null];
                            }
                            s.layerNames[1] = layerName;
                        }
                        queueDrawing({
                            key: layerName,
                            funcObj: funcObj,
                            func: function (layerName) {
                                //var color = $.color.parse(s.color).scale("rgb", 0.25);
                                //color = color.toString();
                                drawImplicitOnLayer(layerName, s.color, "=");
                            }
                        });
                    }
                } else {
                    if (!!s.layerNames && s.layerNames.length > 0) {
                        for (var i = 0; i < s.layerNames.length; i++) {
                            var layer = new plotClasses.Canvas(s.layerNames[i], plot.getPlaceholder());
                            $(layer.element).remove();
                        }
                    }
                }
            } else {
                s.suppressCompute = false;
            }
        });

        plot.hooks.draw.push(function (plot, baseContext) {
            processNext(plot);

            // Done with a round of drawing, mark them
            // so that they won't get drew until next time they get recalculated
            var series = plot.getData();
            for (var i = 0; i < series.length; i++) {
                series[i].willDraw = false;
            }
        });

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            eventHolder.mousewheel(function () {
                monitorUserActivity.pauseAndLog("mousewheel");
                executeCallback(plot.getOptions().onPause, [plot]);
            });
            eventHolder.bind("dragstart", function () {
                monitorUserActivity.pauseAndLog("dragstart");
                executeCallback(plot.getOptions().onPause, [plot]);
            });
            eventHolder.bind("drag", function () {
                monitorUserActivity.pauseAndLog("drag");
                executeCallback(plot.getOptions().onPause, [plot]);
            });
            eventHolder.bind("dragend", function () {
                //monitorUserActivity.idle();
                //plot.redraw();
                //console.log("dragend");
            });
        });

        plot.getPlaceholder().bind("plotpan", function (event, plot) {
        });

        //plot.getPlaceholder().bind("plotzoom", function (event, plot) {
        //    plot.redraw();
        //});
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "funGrapher",
        version: "1.0"
    });

    window.monitorUserActivity = monitorUserActivity;
})(jQuery);