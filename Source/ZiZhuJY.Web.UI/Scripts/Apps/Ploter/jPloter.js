// version 1.4.1
// using jQuery, zizhujy.com, zizhujy.com.Matrix, Globalize
(function ($, zizhujy, matrix, Globalize) {
    function fittingModel(name, expression, expressionHtml, formulaHtml, parametersFormat) {
        this.name = name;
        this.expression = expression;
        this.expressionHtml = expressionHtml;
        this.formulaHtml = formulaHtml;
        this.parametersFormat = parametersFormat;
        this.parameters = [];
        this.sse = 0;

        if (!this._initialized) {
            var fm = this;

            fittingModel.prototype.getExpression = function (expressionFormat) {
                if (!expressionFormat) {
                    expressionFormat = this.expression;
                }

                return String.format.apply(this || window, [expressionFormat].concat(this.parameters));
            };

            fittingModel.prototype.getExpressionHtml = function (expressionHtml) {
                if (arguments.length <= 0) {
                    expressionHtml = this.expressionHtml;
                }

                return String.format.apply(this || window, [expressionHtml].concat(this.parameters));
            };

            fittingModel.prototype.getParametersHtml = function (parametersFormat) {
                if (arguments.length <= 0) {
                    parametersFormat = this.parametersFormat;
                }

                return String.format.apply(this || window, [parametersFormat].concat(this.parameters.map(function (i) { return i/*.toFixed(5)*/; })));
            };

            fittingModel.prototype.setParameters = function (vector) {
                if (matrix.isMatrix(vector)) {
                    for (var i = vector.length - 1; i >= 0; i--) {
                        this.parameters.push(vector[i][0]);
                    }
                }
            };

            fittingModel.prototype.getDataSeriesForPlot = function (dataPoints) {
                var dataArg = [];
                var xMin = dataPoints.getColumn("x").min();
                var xMax = dataPoints.getColumn("x").max();
                var scale = (xMax - xMin) * 0.05;
                var step = (xMax - xMin + 2 * scale) / 500;
                try {
                    for (var i = xMin - scale; i <= xMax + scale; i += step) {
                        var y = window.eval("var x = " + i + "; " + this.getExpression());
                        dataArg.push([i, y]);
                    }
                } catch (ex) {
                    console.log(ex);
                }
                var name = this.name;
                return { label: name, data: dataArg, lines: { show: true }, points: { show: false } };
            };

            this._initialized = true;
        }
    }

    window.FittingModel = fittingModel;

    function jPloter() {
        this.settings = {
            colorSchema: ["#421C52", "#FF0000", "#800080", "#090", "#009", "#0000FF", "#F08"]
        };

        this.dataPoints = null;
        this.plot = null;
        this.messages = [];

        // 拟合的模型表达式：
        this.models = {};
        this.jStats = null;

        if (!this._initialized) {
            var jp = this;

            jPloter.prototype.readDataPoints = function (s) {
                this.dataPoints = null;
                try {
                    this.dataPoints = new JPoints2D(s);
                } catch (ex) {
                    this.messages.push(ex);
                }
                if (this.dataPoints != null && this.dataPoints.messages instanceof Array) {
                    for (var i = 0; i < this.dataPoints.messages.length; i++) {
                        this.messages.push(this.dataPoints.messages[i]);
                    }
                }
            };

            jPloter.prototype.getJStats = function () {
                if (this.jStats == null)
                    this.jStats = new JStats(this.dataPoints);
                return this.jStats;
            };

            //#region statistics region
            jPloter.prototype.getStatistics = function (format) {
                var jstats = this.getJStats();
                var sv = jstats.statVars;
                return format != null ? format.format(sv.n, sv.Sum_XY.toFixed(2), sv.xBar.toFixed(2), sv.yBar.toFixed(2), sv.Sx.toFixed(2), sv.Sy.toFixed(2), Math.pow(sv.Sx, 2).toFixed(2), Math.pow(sv.Sy, 2).toFixed(2), sv.sigmaX.toFixed(2), sv.sigmaY.toFixed(2), Math.pow(sv.sigmaX, 2).toFixed(2), Math.pow(sv.sigmaY, 2).toFixed(2), sv.SumX.toFixed(2), sv.SumY.toFixed(2), sv.Sum_X_2.toFixed(2), sv.Sum_Y_2.toFixed(2), sv.r.toFixed(2)) : "";
            };
            //#endregion


            //#region Fitting region
            //  #region Linear
            jPloter.prototype.getLinearModel = function () {
                if (typeof (this.models.linear) == "undefined" || this.models.linear == null) {
                    var model = new FittingModel(Globalize.localize("linear"), "y = {0} * x + {1}", "y = {0} * x + ({1})", "<i>y</i> = a⋅<i>x</i> + b", "a: {0}<br />b: {1}");
                    var jStats = this.getJStats();
                    model.parameters = [jStats.statVars.a, jStats.statVars.b];
                    model.sse = jStats.statVars.linearSquareSumOfErrors;

                    this.models.linear = model;
                }
                return this.models.linear;
            };

            jPloter.prototype.delLinearModel = function () {
                if (typeof (this.models.linear) != "undefined")
                    delete this.models.linear;
            };

            jPloter.prototype.addLinearModel = function () {
                this.getLinearModel();
            };
            //  #endregion

            //  #region Quadratic
            jPloter.prototype.getQuadraticalModel = function () {
                if (typeof (this.models.quadratic) == "undefined" || this.models.quadratic == null) {
                    var model = new FittingModel(Globalize.localize("quadratic"), "y = {0} * Math.pow(x,2) + {1} * x + {2}", "y = {0} * x<sup>2</sup> + ({1}) * x + ({2})", "<i>y</i> = a⋅<i>x<sup>2</sup></i> + b⋅<i>x</i> + c", "a: {0}<br />b: {1}<br />c: {2}");
                    var jStats = this.getJStats();
                    var parameterVector = jStats.regressionCoefficientVector(2);
                    model.sse = jStats.squareSumOfErrors(parameterVector);
                    model.setParameters(parameterVector);

                    this.models.quadratic = model;
                }
                return this.models.quadratic;
            };

            jPloter.prototype.delQuadraticalModel = function () {
                if (typeof (this.models.quadratic) != "undefined")
                    delete this.models.quadratic;
            };

            jPloter.prototype.addQuadraticModel = function () {
                this.getQuadraticalModel();
            };
            //  #endregion

            //  #region Cubic
            jPloter.prototype.getCubicalModel = function () {
                if (typeof (this.models.cubic) == "undefined" || this.models.cubic == null) {
                    var model = new FittingModel(Globalize.localize("cubic"), "y = {0} * Math.pow(x,3) + {1} * Math.pow(x,2) + {2} * x + {3}", "y = {0} * x<sup>3</sup> + ({1}) * x<sup>2</sup> + ({2}) * x + ({3})", "<i>y</i> = a⋅<i>x<sup>3</sup></i> + b⋅<i>x<sup>2</sup></i> + c⋅<i>x</i> + d", "a: {0}<br />b: {1}<br />c: {2}<br />d: {3}");
                    var jStats = this.getJStats();
                    var parameterVector = jStats.regressionCoefficientVector(3);
                    model.sse = jStats.squareSumOfErrors(parameterVector);
                    model.setParameters(parameterVector);

                    this.models.cubic = model;
                }
                return this.models.cubic;
            };

            jPloter.prototype.delCubicalModel = function () {
                if (typeof (this.models.cubic) != "undefined")
                    delete this.models.cubic;
            };

            jPloter.prototype.addCubicalModel = function () {
                this.getCubicalModel();
            };
            //  #endregion

            //  #region Exponential
            jPloter.prototype.getExponentialModel = function () {
                if (typeof (this.models.exponential) == "undefined" || this.models.exponential == null) {
                    var model = new FittingModel(Globalize.localize("exponential"), "y = {0} * Math.exp({1} * x)", "y = {0} * e<sup>{1} * x</sup>", "<i>y</i> = α⋅e<sup>β⋅<i>x</i></sup><hr /><i>y</i> = a⋅b<sup><i>x</i></sup>", "α: {0}<br />β: {1}<hr />a: {0}<br />b: {2}");
                    var jStats = new JStats(this.getJStats().dataCenter.x, Math.ln(this.getJStats().dataCenter.y));
                    var sv = jStats.statVars;
                    var alpha = Math.exp(sv.b);
                    var beta = sv.a;
                    var b = Math.exp(beta);

                    var yEstimated = [];
                    for (var i = 0; i < this.getJStats().dataCenter.x.length; i++) {
                        yEstimated.push(alpha * Math.exp(beta * this.getJStats().dataCenter.x[i]));
                    }
                    model.sse = this.getJStats().residualSumOfSquares(this.getJStats().dataCenter.y, yEstimated);
                    model.parameters = [alpha, beta, b];

                    this.models.exponential = model;
                }
                return this.models.exponential;
            };

            jPloter.prototype.delExponentialModel = function () {
                if (typeof (this.models.exponential) != "undefined")
                    delete this.models.exponential;
            };

            jPloter.prototype.addExponentialModel = function () {
                this.getExponentialModel();
            };
            //  #endregion

            //  #region Logarithm
            jPloter.prototype.getLogarithmModel = function () {
                if (typeof (this.models.logarithm) == "undefined" || this.models.logarithm == null) {
                    var model = new FittingModel(Globalize.localize("logarithm"), "y = {0} * Math.log(x) + {1}", "y = {0} * ln(x) + ({1})", "<i>y</i> = α⋅ln(<i>x</i>) + β", "α: {0}<br />β: {1}");
                    var jStats = new JStats(Math.ln(this.getJStats().dataCenter.x), this.getJStats().dataCenter.y);
                    var sv = jStats.statVars;
                    var alpha = sv.a;
                    var beta = sv.b;

                    var yEstimated = [];
                    for (var i = 0; i < this.getJStats().dataCenter.x.length; i++) {
                        yEstimated.push(alpha * Math.log(this.getJStats().dataCenter.x[i]) + beta);
                    }
                    model.sse = this.getJStats().residualSumOfSquares(jStats.dataCenter.y, yEstimated);
                    model.parameters = [alpha, beta];

                    this.models.logarithm = model;
                }
                return this.models.logarithm;
            };

            jPloter.prototype.delLogarithmModel = function () {
                if (typeof (this.models.logarithm) != "undefined")
                    delete this.models.logarithm;
            };

            jPloter.prototype.addLogarithmModel = function () {
                this.getLogarithmModel();
            };
            //  #endregion

            //  #region Polynomial
            jPloter.prototype.getPolynomialModel = function (power) {
                function ordinalText(power) {
                    if (power != undefined) {
                        if (power == 1) return power.toString() + Globalize.localize("ordinal.1st.suffix").toString();
                        if (power == 2) return power.toString() + Globalize.localize("ordinal.2nd.suffix").toString();
                        if (power == 3) return power.toString() + Globalize.localize("ordinal.3rd.suffix").toString();
                        return power.toString() + Globalize.localize("ordinal.nth.suffix");
                    } else {
                        return Globalize.localize("ordinal.nth.suffix").toString();
                    }
                }

                function getPolynomialExpression(power) {
                    var s = "y = ";
                    for (var i = power; i >= 1; i--) {
                        s += "({" + (power - i) + "}) * Math.pow(x, " + i + ") + ";
                    }
                    s += "({" + power + "})";

                    return s;
                }

                function getPolynomialExpressionHtml(power) {
                    var s = "y = ";
                    for (var i = power; i >= 1; i--) {
                        s += "({" + (power - i) + "}) * <i>x<sup>" + i + "</sup></i> + ";
                    }
                    s += "({" + power + "})";

                    return s;
                }

                function getPolynomialFormulaHtml(power) {
                    var s = "<i>y</i> = ";
                    for (var i = power; i >= 1; i--) {
                        s += "a<sub>" + i + "</sub>⋅<i>x</i><sup>" + i + "</sup> + ";
                    }
                    s += "a<sub>0</sub>";

                    return s;
                }

                function getPolynomialParametersHtml(power) {
                    var s = "";
                    for (var i = power; i >= 1; i--) {
                        s += "a<sub>" + i + "</sub>: {" + (power - i) + "}<br />";
                    }
                    s += "a<sub>0</sub>: {" + (power) + "}";

                    return s;
                }

                if (typeof (this.models.polynomial) == "undefined" || this.models.polynomial == null) {
                    var s = "{0} " + Globalize.localize("polynomial.model.name.post");
                    var model = new FittingModel(s.format(ordinalText(power)), getPolynomialExpression(power), getPolynomialExpressionHtml(power), getPolynomialFormulaHtml(power), getPolynomialParametersHtml(power));
                    var jStats = this.getJStats();
                    var parameterVector = jStats.regressionCoefficientVector(power);
                    model.sse = jStats.squareSumOfErrors(parameterVector);
                    model.setParameters(parameterVector);

                    this.models.polynomial = model;
                }
                return this.models.polynomial;
            };

            jPloter.prototype.delPolynomialModel = function () {
                if (typeof (this.models.polynomial) != "undefined")
                    delete this.models.polynomial;
            };

            jPloter.prototype.addPolynomialModel = function (power) {
                this.getPolynomialModel(power);
            };
            //  #endregion

            //#endregion

            //#region charting region
            jPloter.prototype.draw = function ($canvas) {
                var options = {
                    xaxis: { autoscaleMargin: 0.05 },
                    yaxis: { autoscaleMargin: 0.05 },
                    grid: {
                        borderWidth: 0,
                        hoverable: true,
                        clickable: true
                    },
                    colors: this.settings.colorSchema,
                    coordinate: { type: "auto" },
                    zoom: {
                        interactive: true,
                        mouseWheel: 'shiftKey|altKey'
                    },
                    pan: {
                        interactive: true
                    },
                    menu: {
                        position: { left: "40px", top: "5px" },
                        menuHtml: "<ul class='menu-bar'><li event='click' handler='fullScreen' title='{5}'><span class='helper'></span><a href='http://zizhujy.com/FunctionGrapher?src=baiduApp' target='_blank' style='text-decoration: none; color: #666;'><span class='icon'>f</span></a></li><li title='{4}' event='click' handler='handleNavigationControl'><span class='helper'></span><span class='icon'>m</span></li><li title='{0}'><span class='helper'></span><span class='icon'>&#xe001;</span><ul><li event='click' handler='saveAsPng'>{1}</li><li event='click' handler='saveAsJpeg'>{2}</li><li event='click' handler='saveAsBmp'>{3}</li></ul></li></ul>".format(

                Globalize.localize("TipForSavingGraph") || "Save as image...",
                Globalize.localize("SaveAsPNG") || "Save as PNG...",
                Globalize.localize("SaveAsJPEG") || "Save as JPEG...",
                Globalize.localize("SaveAsBMP") || "Save as BMP...",
                Globalize.localize("ToggleNavigationControl") || "Toggle navigation control",
                Globalize.localize("FullScreen") || "Full screen"
            )
                    },
                    navigationControl: {
                        homeRange: { xmin: 0, xmax: 10, ymin: 0, ymax: 10 },
                        panAmount: 100,
                        zoomAmount: 1.5,
                        position: { left: "40px", top: "40px" }
                    }
                };
                this.plot = $.plot($canvas, this.getData(), options);
                this.plot.getOptions().navigationControl.homeRange = {
                    xmin: this.plot.getOptions().xaxis.min,
                    xmax: this.plot.getOptions().xaxis.max,
                    ymin: this.plot.getOptions().yaxis.min,
                    ymax: this.plot.getOptions().yaxis.max
                };
            };

            jPloter.prototype.getData = function () {
                var data = [];
                if (this.dataPoints != null && this.dataPoints.points != null && this.dataPoints.points instanceof Array) {
                    data.push({ label: Globalize.localize("original.data"), data: this.dataPoints.toArray(), lines: { show: false }, points: { show: true } });
                }
                for (var modelIndex in this.models) {
                    var model = this.models[modelIndex];
                    data.push(model.getDataSeriesForPlot(this.dataPoints));
                    switch (modelIndex) {
                        case "linear":
                            data[data.length - 1].color = this.settings.colorSchema[1];
                            break;
                        case "quadratic":
                            data[data.length - 1].color = this.settings.colorSchema[2];
                            break;
                        case "cubic":
                            data[data.length - 1].color = this.settings.colorSchema[3];
                            break;
                        case "exponential":
                            data[data.length - 1].color = this.settings.colorSchema[4];
                            break;
                        case "logarithm":
                            data[data.length - 1].color = this.settings.colorSchema[5];
                            break;
                        case "polynomial":
                            data[data.length - 1].color = this.settings.colorSchema[6];
                            break;
                    }
                }
                return data;
            };
            //#endregion

            this._initialized = true;
        }
    }
    window.JPloter = jPloter;
})(jQuery, zizhujy, zizhujy.com.Matrix, Globalize);