;
(function () {
    var myScriptUrl = getCurrentScriptUrl();
    var myDir = myScriptUrl.substring(0, myScriptUrl.lastIndexOf("/") + 1);

    requireLite([
            { path: "../jquery-1.8.3.js", canary: "typeof jQuery !== 'undefined'" },
            { path: "../zizhujy.com.js", canary: "typeof zizhujy.com !== 'undefined'" },
            { path: "../zizhujy.com.Console.js", canary: "typeof console !== 'undefined'" },
            { path: "../json2.js", canary: "typeof JSON !== 'undefined'" },
            { path: "../bigjs/big.js", canary: "typeof Big !== 'undefined'" },
            { path: "../Maths/zizhujy.com.MathExtended.js", canary: "typeof Math.gcd !== 'undefined'" },
            { path: "../Maths/zizhujy.com.IntervalArithmetic.js", canary: "typeof zizhujy.com.TupperIntervalArithmetic !== 'undefined'" },
            { path: "../drawing/canvas2image.js", canary: "typeof Canvas2Image !== 'undefined'" },
            { path: "../base64.js", canary: "typeof btoa !== 'undefined'" },
            { path: "../flot/flot/lib/excanvas.min.js", canary: "typeof ie !== 'undefined'" },
            { path: "../LaTex/zizhujy.com.LaTexLex.1.2.js", canary: "typeof zizhujy.com.LaTexLex !== 'undefined'" }
    ], function () {
        requireLite([
                { path: myDir + "../jquery.colorhelpers.js", canary: "typeof $.color !== 'undefined'" },
                { path: myDir + "../flot/flot/jquery.flot.js", canary: "typeof $.plot !== 'undefined'" },
                { path: myDir + "../FunctionGrapher/functionSampler.js", canary: "typeof Plotter !== 'undefined'" },
                { path: myDir + "../globalize.js", canary: "typeof Globalize !== 'undefined'" },
                { path: myDir + "../LaTex/zizhujy.com.LaTexParser.1.2.js", canary: "typeof zizhujy.com.LaTexParser !== 'undefined'" },
                { path: myDir + "../mathquill/mathquill.js", canary: "typeof jQuery.fn.mathquill !== 'undefined'" }
        ], function () {
            requireLite([
                    { path: myDir + "../flot/coordinate/jquery.flot.coordinate.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'coordinate';}).length > 0" },
                    { path: myDir + "../flot/jquery.flot.plotSymbol.js", canary: "$.plot.plugins.filter(function(item){return item.name==='plotSymbols';}).length > 0" },
                    { path: myDir + "../flot/jquery.flot.symbol.js", canary: "$.plot.plugins.filter(function(item){return item.name==='symbols';}).length > 0" },
                    { path: myDir + "../flot/saveAsImage/jquery.flot.saveAsImage.js", canary: "$.plot.plugins.filter(function(item){return item.name==='saveAsImage';}).length > 0" },
                    { path: myDir + "../flot/jquery.flot.navigate.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'navigate';}).length > 0" },
                    //{ path: myDir + "../flot/jquery.flot.menuBar.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'menuBar';}).length>0" },
                    { path: myDir + "../flot/navigationControl/jquery.flot.navigationControl.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'navigationControl';}).length>0" },
                    { path: myDir + "../flot/jquery.flot.resize.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'resize';}).length > 0" },
                    { path: myDir + "../flot/extendedForMath/jquery.flot.extendedForMath.js", canary: "$.plot.plugins.filter(function(item){return item.name==='funGrapher';}).length > 0" },
                    { path: myDir + "../flot/jquery.flot.mathquillLegend.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'mathquillLegend';}).length > 0" },
                    { path: myDir + "../flot/jquery.flot.tooltip.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'tooltip';}).length > 0" },
                    { path: myDir + "../flot/flotOptions/jquery.flot.options.js", canary: "$.plot.plugins.filter(function(item){return item.name === 'flotOptions';}).length > 0" }
            ], function () {
                (function ($) {
                    var urlParams = zizhujy.com.deserializeUrlParams();

                    //plot = $.plot("#canvas-wrapper", series, options);
                    //plot.redraw(series);

                    //var i = 0;
                    //var iid = setInterval(function () {
                    //    serie0.data.push([i, sin(i)]);
                    //    i++;
                    //    if (i > 100) {
                    //        plot.stop();
                    //        console.log("stopped!");
                    //        clearInterval(iid);
                    //    }
                    //}, 100);
                    executeOn(
                        function () {
                            return document.readyState === "complete" || document.readyState === "interactive";
                        },
                        function () {
                            if (urlParams !== null && !!urlParams.funGrapherCallback) {
                                if (typeof eval("(function(){ return " + urlParams.funGrapherCallback + ";})();") === "function") {
                                    eval("(function(){ return " + urlParams.funGrapherCallback + ";})();")($.plot.funGrapher, plot, options);
                                } else if (typeof window.parent[urlParams.funGrapherCallback] === "function") {
                                    window.parent[urlParams.funGrapherCallback]($.plot.funGrapher, plot, options);
                                }
                            } else {
                                if (typeof window["funGrapherCallback"] === "function") {
                                    window["funGrapherCallback"]($.plot.funGrapher, plot, options);
                                }
                            }
                        });

                    var options = {
                        update: {
                            interval: 900
                        },
                        xaxis: {
                            min: -10,
                            max: 10,
                            show: false,
                            reserveSpace: false,
                            autoscaleMargin: 0
                        },
                        yaxis: {
                            min: -10,
                            max: 10,
                            show: false,
                            reserveSpace: false,
                            autoscaleMargin: 0
                        },
                        coordinate: { type: 'auto', ratioXY: 1 },
                        grid: {
                            borderWidth: 0,
                            minBorderMargin: 0
                        },
                        zoom: { interactive: true },
                        pan: { interactive: true, cursor: "move" },
                        canvas: true
                    };

                    var plot = null;
                    // trigger init to extend the plot class.
                    //var $trigger = $("<div style='width: 100px; height: 100px; display: none;'></div>");
                    //$trigger.appendTo("body");
                    //plot = $.plot($trigger, [[]], options);
                    //$trigger.remove();
                })(jQuery);
            }, true);

        }, true);

    }, true);

})();
