//*************************************************************************
// jPloter
//
// Version: 1.2
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Online function ploter
// v1.1: Added stats feature
//
// using jQuery.js
// using jQuery.flot.js
// using jStats.js
// using zizhujy.com.Matrix.js
//
(function ($) {
    //
    // String Buffer Class
    //
    function StringBuffer() {
        this.__strings__ = new Array();
 
        if (typeof StringBuffer._initialized == "undefined") {
            StringBuffer.prototype.append = function (s) {
                this.__strings__.push(s);
            };
 
            StringBuffer.prototype.appendLine = function (s) {
                this.__strings__.push(s + "\n");
            };
 
            StringBuffer.prototype.toString = function () {
                return this.__strings__.join("");
            };
 
            StringBuffer._initialized = true;
        }
    }

    //
    // 给字符串类添加一个format()方法
    //
    String.format = function () {
        if (arguments.length <= 0) {
            return "";
        } else {
            var string = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                string = string.replace("{" + (i - 1) + "}", arguments[i]);
            }

            return string;
        }
    };

    //
    //  给字符串对象添加一个trim()方法
    // 
    String.prototype.trim = function () {
        var extraSpace = /^\s*(.*?)\s*$/;

        return this.replace(extraSpace, "$1");
    };

    //
    // 给数组对象添加一个 min() 方法
    //
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

    Array.prototype.toString = function() {
        var delimiter;
        if(arguments.length <= 0) delimiter = ",";
        else delimiter = arguments[0];

        return this.join(delimiter);
    };

    // 利用动态原型方法定义一个jPloter类
    function jPloter(graphBoardId, inputBoardId, graphButtonId, resetButtonId, shareButtonId, linkButtonId, linkTextBoxId, statsDivId, chkLinearFitId, chkQuadraticFitId, chkCubicFitId, chkPolynomialFit, txtPower, culture, percentageWidth, plotOptions) {
        this.config = {
            graphBoardId: graphBoardId,
            inputBoardId: inputBoardId,
            graphButtonId: graphButtonId,
            resetButtonId: resetButtonId,
            shareButtonId: shareButtonId,
            linkButtonId: linkButtonId,
            linkTextBoxId: linkTextBoxId, 
            statsDivId: statsDivId, 
            chkLinearFitId: chkLinearFitId, 
            chkQuadraticFitId: chkQuadraticFitId,
            chkCubicFitId: chkCubicFitId, 
            chkPolynomialFitId: chkPolynomialFit, 
            txtPowerId: txtPower
        };

        this.options = {
            culture: culture, 
            graphBoardPercentageWidth: percentageWidth,
            plotOptions: (typeof(plotOptions) == "undefined" || plotOptions == null) ? 
                        {
                            series: {
                                lines: { show: false },
                                points: { show: true }
                            },
                            grid: {
                                backgroundColor: { colors: ["#fff", "#eee"] }
                            }
                        } : plotOptions
        };

        this.attributes = {
            version: 1.1,
            x: [],
            y: [],
            xTicks: 10,
            yTicks: 10,
            maxIterations: 10000
        };

        this.dataCenter = {
            userInput: "",
            dataList: []
        };

        this.resources = {
            zh_cn: {
                linearFitLabel: "拟合直线：",
                linkTip: "链接已经生成，请从下面的链接框中复制。", 
                statsInfo: "<h3>统计量：</h3><p>n: {0}; Sum_XY: {11}; </p><table><thead><tr><th>&nbsp;</th><th>bar</th><th>S</th><th>sigma</th><th>Sum</th><th>Square Sum</th></tr></thead><tbody><tr><th>x</th><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr><tr><th>y</th><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><td>{10}</td></tr></tbody></table><hr /><h3>最小二乘线性拟合：</h3><p>a: {12}<br /> b: {13}</p><p>y = a * x + b </p><h3>拟合误差平方和：</h3><p>{14}</p>",
                quadraticFitLabel: "拟合二次函数：", 
                quadraticFit: "<hr /><h3>二次函数最小二乘拟合：</h3><p>a: {0}<br />b: {1}<br />c: {2}</p><p></p><p>y = a * x<sup>2</sup> + b * x + c</p><h3>拟合误差平方和：</h3><p>{3}</p>",
                cubicFitLabel: "拟合三次函数：",
                cubicFit: "<hr /><h3>三次函数最小二乘拟合：</h3><p>a: {0}<br />b: {1}<br />c: {2}<br />d: {3}</p><p></p><p>y = a * x<sup>3</sup> + b * x<sup>2</sup> + c * x + d</p><h3>拟合误差平方和：</h3><p>{4}</p>", 
                polynomialFitLabel: "拟合n次函数："
            },

            en_us: {
                linearFitLabel: "Linear Fit: ",
                linkTip: "Link generated, please copy it from below link textbox.", 
                statsInfo: "<h3>Stat Vars</h3><p>n: {0}; Sum_XY: {11}; </p><table><thead><tr><th>&nbsp;</th><th>bar</th><th>S</th><th>sigma</th><th>Sum</th><th>Square Sum</th></tr></thead><tbody><tr><th>x</th><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr><tr><th>y</th><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><td>{10}</td></tr></tbody></table><hr /><h3>Least Square Linear Fit</h3><p>a: {12}<br /> b: {13}</p><p>y = a * x + b </p><h3>Square Sum of error：</h3><p>{14}</p>",
                quadraticFitLabel: "Fitted quadratic function: ", 
                quadraticFit: "<hr /><h3>Least Square Quadratic Fit: </h3><p>a: {0}<br />b: {1}<br />c: {2}</p><p></p><p>y = a * x<sup>2</sup> + b * x + c</p><h3>Square Sum of error：</h3><p>{3}</p>",
                cubicFitLabel: "Fitted cubic function: ",
                cubicFit: "<hr /><h3>Least Square Cubic Fit: </h3><p>a: {0}<br />b: {1}<br />c: {2}<br />d: {3}</p><p></p><p>y = a * x<sup>3</sup> + b * x<sup>2</sup> + c * x + d</p><h3>Square Sum of error：</h3><p>{4}</p>", 
                polynomialFitLabel: "Fitted polynomial(n): "
            }
        };

        this.resource = {
            linearFitLabel: this.resources[this.options.culture] ? this.resources[this.options.culture].linearFitLabel : this.resources.en_us.linearFitLabel,
            linkTip: this.resources[this.options.culture] ? this.resources[this.options.culture].linkTip : this.resources.en_us.linkTip,
            statsInfo: this.resources[this.options.culture] ? this.resources[this.options.culture].statsInfo : this.resources.en_us.statsInfo, 
            quadraticFitLabel: this.resources[this.options.culture] ? this.resources[this.options.culture].quadraticFitLabel : this.resources.en_us.quadraticFitLabel,
            quadraticFit: this.resources[this.options.culture] ? this.resources[this.options.culture].quadraticFit : this.resources.en_us.quadraticFit, 
            cubicFitLabel: this.resources[this.options.culture] ? this.resources[this.options.culture].cubicFitLabel : this.resources.en_us.cubicFitLabel,
            cubicFit: this.resources[this.options.culture] ? this.resources[this.options.culture].cubicFit : this.resources.en_us.cubicFit, 
            polynomialFitLabel: this.resources[this.options.culture] ? this.resources[this.options.culture].polynomialFitLabel : this.resources.en_us.polynomialFitLabel
        };

        this.ploter = {};

        if (!this._initialized) {
            //Define a local copy of jPloter
            var jP = this;

            //
            // 构建UI界面
            //
            jPloter.prototype.buildUI = function () {
                this.ui = {};
                this.ui.$GraphBoard = $("#" + this.config.graphBoardId);
                this.ui.$InputBoard = $("#" + this.config.inputBoardId);
                this.ui.$GraphButton = $("." + this.config.graphButtonId);
                this.ui.$ResetButton = $("." + this.config.resetButtonId);
                this.ui.$ShareButton = $("#" + this.config.shareButtonId);
                this.ui.$LinkButton = $("." + this.config.linkButtonId);
                this.ui.$LinkTextBox = $("#" + this.config.linkTextBoxId);
                this.ui.$StatsDiv = $("#" + this.config.statsDivId);
                this.ui.$LinearFitCheck = $("#" + this.config.chkLinearFitId);
                this.ui.$QuadraticFitCheck = $("#" + this.config.chkQuadraticFitId);
                this.ui.$CubicFitCheck = $("#" + this.config.chkCubicFitId);
                this.ui.$PolynomialFitCheck = $("#" + this.config.chkPolynomialFitId);
                this.ui.$PowerTextbox = $("#" + this.config.txtPowerId);

                this.ui.reset = function() {                
                    jP.ui.$InputBoard.attr("value", "");
                    jP.run();
                };

                this.ui.$GraphBoard.resize(function() {
                    $(this).css("height", $(this).width() + "px");
                });

                // Graph Button click
                this.ui.$GraphButton.click(function () {
                    jP.run();
                });

                // Reset Button Click
                this.ui.$ResetButton.click(function() {
                    jP.ui.reset();
                });

                // Link Button Click
                this.ui.$LinkButton.click(function() {
                    var link = "http://www.zizhujy.com/Ploter";

                    jP.ui.$LinkTextBox.attr("value", link);
                    alert(jP.resource.linkTip);
                });                

                // Linear Fit Button Click
                this.ui.$LinearFitCheck.click(function() {
                    jP.run();
                });

                // Quadratic Fit Button Click
                this.ui.$QuadraticFitCheck.click(function () {
                    jP.run();
                });

                // Cubic Fit Button Click
                this.ui.$CubicFitCheck.click(function () {
                    jP.run();
                });

                // Polynomial Fit Button Click
                this.ui.$PolynomialFitCheck.click(function () {
                    jP.run();
                });

                // 调整涂鸦板的尺寸大小
                // 将涂鸦板的尺寸调整为父窗口宽度的100%，并使高度 = 宽度
                this.ui.autoResize = function() {
                    var $Parent = jP.ui.$GraphBoard.parent();
                    var parentWidth = $Parent.width();

                    var percentageWidth = jP.options.graphBoardPercentageWidth;

                    // Make the jP.ui.$GraphBoard percentage width to permit it to resize
                    jP.ui.$GraphBoard.css("width", (percentageWidth * 100) + "%");
                    jP.ui.$GraphBoard.css("height", (parentWidth * percentageWidth) + "px"); 
                };

                //this.ui.readAttributes();

                if(this.ui.$InputBoard.attr("value").length <= 0) {
                    var defaultFunctions = "var x = [1900,1904,1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996]; \r\n\r\nvar y = [10.83, 11.48, 12.17, 12.96, 13.42, 12.96, 13.77, 14.15, 14.27, 14.10, 14.92, 14.96, 15.42, 16.73, 17.71, 18.04, 18.04, 18.96, 18.85, 19.77, 19.02, 19.42]";
                    
                    this.ui.$InputBoard.attr("value", defaultFunctions);
                }

                this.ui.autoResize();

            };

            jPloter.prototype.uiReady = function () {
                return !(this.ui == undefined);
            };

            //
            // 获取用户输入
            //
            jPloter.prototype.getUserInput = function () {
                if (this.uiReady()) {

                    this.dataCenter.userInput = this.ui.$InputBoard.attr("value");
                    
                    return this.dataCenter.userInput;
                } else {
                    return "";
                }
            };

            //
            // 分析用户的输入
            //
            jPloter.prototype.analyse = function () {
                try{
                    eval(this.dataCenter.userInput);
                    try {
                        this.attributes.x = x;
                        this.attributes.y = y;
                    } catch (e) {
                        this.attributes.x = [];
                        this.attributes.y = [];
                    }
                }catch(ex){
                    alert(ex);
                }
            };

            //
            // 生成数据点
            //
            jPloter.prototype.generateDataPoints = function () {
                // 清除数据点列表
                var x = this.attributes.x;
                var y = this.attributes.y;
                this.dataCenter.dataList.splice(0, this.dataCenter.dataList.length);
                this.dataCenter.dataList.push([]);

                for(var i = 0; i < x.length; i++) {
                    var index = this.dataCenter.dataList.length - 1;
                    this.dataCenter.dataList[index].push([x[i], y[i]]);
                }
                return this.dataCenter.dataList;
            };

            //
            // 画图
            //
            jPloter.prototype.makeGraph = function () {
                var dataArg = [];
                for (var i = 0; i < this.dataCenter.dataList.length; i++) {
                    dataArg.push({ label: '', data: this.dataCenter.dataList[i] });
                }

                var x1 = this.attributes.x.min();
                var x2 = this.attributes.x.max();
//                var dx = x2 - x1;
//                x1 = x1 - dx * 0.1;
//                x2 = x2 + dx * 0.1;
                var y1 = this.attributes.y.min();
                var y2 = this.attributes.y.max();
//                var dy = y2 - y1;
//                y1 = y1 - dx * 0.1;
//                y2 = y2 + dx * 0.1;
                var xTicks = eval(this.attributes.xTicks);
                var yTicks = eval(this.attributes.yTicks);

                try {
                    this.options.plotOptions.xaxis = {
                        ticks: xTicks,
                        min: x1,
                        max: x2
                    };
                    this.options.plotOptions.yaxis = {
                        ticks: yTicks,
                        min: y1,
                        max: y2
                    };

                    this.ploter = $.plot(
                        this.ui.$GraphBoard,
                        dataArg,
                        this.options.plotOptions
                    );
                } catch (err) {
                    alert(err);
                }
            };

            jPloter.prototype.stats = function() {
                var series = this.ploter.getData();
                if(series != null && series.length > 0) {
                    var jStats = new JStats(series[0].data);

                    var sb = new StringBuffer();
                    sb.append(this.resource.statsInfo);
                    var sv = jStats.statVars;
                    var s = String.format(sb.toString(), sv.n, sv.xBar, sv.Sx, sv.sigmaX, sv.SumX, sv.Sum_X_2, sv.yBar, sv.Sy, sv.sigmaY, sv.SumY, sv.Sum_Y_2, sv.Sum_XY, sv.a, sv.b, sv.linearSquareSumOfErrors);
                    this.ui.$StatsDiv.html(s);

                    if(this.ui.$LinearFitCheck.attr("checked")) {
                        this.linearFit(sv.a, sv.b);
                    }

                    if(this.ui.$QuadraticFitCheck.attr("checked")) {
                        var parameterVector = jStats.parameterVector(3);
                        this.quadraticFit(parameterVector[0], parameterVector[1], parameterVector[2]);
                        var sse = jStats.squareSumOfErrors(parameterVector);

                        s = this.resource.quadraticFit;
                        s = String.format(s, parameterVector[0], parameterVector[1], parameterVector[2], sse);
                        this.ui.$StatsDiv.append(s);
                    }

                    if(this.ui.$CubicFitCheck.attr("checked")){
                        var parameterVector = jStats.parameterVector(4);

                        this.cubicFit(parameterVector[0], parameterVector[1], parameterVector[2], parameterVector[3]);
                        var sse = jStats.squareSumOfErrors(parameterVector);

                        s = this.resource.cubicFit;
                        s = String.format(s, parameterVector[0], parameterVector[1], parameterVector[2], parameterVector[3], sse);
                        this.ui.$StatsDiv.append(s);
                    }

                    if(this.ui.$PolynomialFitCheck.attr("checked")) {
                        var power = this.ui.$PowerTextbox.val();
                        if(power >= 0) {
                            var parameterVector = jStats.parameterVector(parseInt(power)+1);
                            //$("#help").html(parameterVector.toString("<br />"));
                            this.polynomialFit(parameterVector);
                        } else {
                            // Error!
                        }
                    }
                }
            };

            jPloter.prototype.quadraticFit = function (a, b, c) {  
                var series = this.ploter.getData();
                if(series != null && series.length > 0) {           
                    var x1 = this.attributes.x.min();
                    var x2 = this.attributes.x.max();
                    var y1 = this.attributes.y.min();
                    var y2 = this.attributes.y.max();
                    var xTicks = eval(this.attributes.xTicks);
                    var yTicks = eval(this.attributes.yTicks);

                    var dataArg = [];
                    a = parseFloat(a);
                    b = parseFloat(b);
                    c = parseFloat(c);
                    for(var i = x1; i <= x2; i += (x2 - x1) / 500) {
                        dataArg.push([i, (a) * Math.pow(i, 2) + (b) * i + (c)]);
                    }
                    
                    this.options.plotOptions.xaxis = {
                        ticks: xTicks,
                        min: x1,
                        max: x2
                    };
                    this.options.plotOptions.yaxis = {
                        ticks: yTicks,
                        min: y1,
                        max: y2
                    };

                    series.push({label: this.resource.quadraticFitLabel + "y = " + a + " * x<sup>2</sup> + (" + b + ") * x + (" + c + ")", data: dataArg, color: "#990000", lines: {show: true}, points: {show: false}});

                    $.plot(this.ui.$GraphBoard, series, this.options.plotOptions);
                }
            };

            jPloter.prototype.cubicFit = function (a, b, c, d) {               
                var series = this.ploter.getData();
                if(series != null && series.length > 0) {           
                    var x1 = this.attributes.x.min();
                    var x2 = this.attributes.x.max();
                    var y1 = this.attributes.y.min();
                    var y2 = this.attributes.y.max();
                    var xTicks = eval(this.attributes.xTicks);
                    var yTicks = eval(this.attributes.yTicks);

                    var dataArg = [];
                    a = parseFloat(a);
                    b = parseFloat(b);
                    c = parseFloat(c);
                    d = parseFloat(d);
                    for(var i = x1; i <= x2; i += (x2 - x1) / 500) {
                        dataArg.push([i, a * Math.pow(i, 3) + b * Math.pow(i, 2) + c * i + d]);
                    }

                    //$("#help").html("<hr />" + dataArg.toString("<br />") + "<hr />");
                    
                    this.options.plotOptions.xaxis = {
                        ticks: xTicks,
                        min: x1,
                        max: x2
                    };
                    this.options.plotOptions.yaxis = {
                        ticks: yTicks,
                        min: y1,
                        max: y2
                    };

                    series.push({label: this.resource.cubicFitLabel + "y = " + a + " * x<sup>3</sup> + (" + b + ") * x<sup>2</sup> + (" + c + ") * x + (" + d + ")", data: dataArg, color: "#009900", lines: {show: true}, points: {show: false}});

                    $.plot(this.ui.$GraphBoard, series, this.options.plotOptions);
                }
            };

            jPloter.prototype.polynomialFit = function (parameterVector) {

                function computeY (x, parameterVector) {                    
                    // y = a_1 * x^(n-1) + a_2 * x^(n-2) + ... + a_(n-1) * x + a_n
                    // y = [a_1, a_2, ..., a_n] [x^(n-1), x^(n-2), ..., x, x^(0)]^T
                    // y = parameterVector * xVector^T

                    var n = parameterVector.length;
                    var xVector = new Array(n);
                    for(var j = 0; j < xVector.length; j++) {
                        xVector[j] = Math.pow(x, n-j-1);
                    }                    
                    var y = Matrix.multiply([xVector], parameterVector);
                    return y;
                }
                         
                var series = this.ploter.getData();
                if(series != null && series.length > 0) {           
                    var x1 = this.attributes.x.min();
                    var x2 = this.attributes.x.max();
                    var y1 = this.attributes.y.min();
                    var y2 = this.attributes.y.max();
                    var xTicks = eval(this.attributes.xTicks);
                    var yTicks = eval(this.attributes.yTicks);

                    var dataArg = [];
                    for(var i = x1; i <= x2; i += (x2 - x1) / 500) {
                        dataArg.push([i, computeY(i, parameterVector)]);
                    }

                    //$("#help").html(dataArg.toString("<br />"));
                    
                    this.options.plotOptions.xaxis = {
                        ticks: xTicks,
                        min: x1,
                        max: x2
                    };
                    this.options.plotOptions.yaxis = {
                        ticks: yTicks,
                        min: y1,
                        max: y2
                    };

                    series.push({label: this.resource.polynomialFitLabel + "y = p(x, n)", data: dataArg, color: "#000099", lines: {show: true}, points: {show: false}});

                    $.plot(this.ui.$GraphBoard, series, this.options.plotOptions);
                }
            };

            jPloter.prototype.linearFit = function (a, b) { 
                var series = this.ploter.getData();
                if(series != null && series.length > 0) {           
                    var x1 = this.attributes.x.min();
                    var x2 = this.attributes.x.max();
                    var y1 = this.attributes.y.min();
                    var y2 = this.attributes.y.max();
                    var xTicks = eval(this.attributes.xTicks);
                    var yTicks = eval(this.attributes.yTicks);

                    var dataArg = [];
                    for(var i = x1; i <= x2; i += (x2 - x1) / 2) {
                        dataArg.push([i, a * i + b]);
                    }
                    
                    this.options.plotOptions.xaxis = {
                        ticks: xTicks,
                        min: x1,
                        max: x2
                    };
                    this.options.plotOptions.yaxis = {
                        ticks: yTicks,
                        min: y1,
                        max: y2
                    };

                    series.push({label: this.resource.linearFitLabel + "y = " + a + " * x + (" + b + ")", data: dataArg, color: "#FF0000", lines: {show: true}, points: {show: false}});

                    $.plot(this.ui.$GraphBoard, series, this.options.plotOptions);
                }
            };

            //
            // 运行
            //      获取用户输入
            //      分析输入
            //      生成数据点
            //      画图
            //      生成统计量
            //
            jPloter.prototype.run = function () {
                this.getUserInput();
                this.analyse();
                this.generateDataPoints();
                this.makeGraph();

                this.stats();
            };

            jPloter.prototype.graph = function(x, y) {
                
            };

            this._initialized = true;
        }

        this.buildUI();
        this.plugin();
        // Because used the graph when data changed feature, so the below statement is not nesseary any more
        //this.run();
    }

    jPloter.prototype.plugin = function() {};

    window.JPloter = jPloter;
})(jQuery);