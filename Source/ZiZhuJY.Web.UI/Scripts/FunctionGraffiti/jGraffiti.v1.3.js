//*************************************************************************
// jGraffiti
//
// Version: 1.3
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Online function graffiti
//
// using jQuery.js
// using jQuery.flot.js
// using jGraffiti-Math.js
//
(function ($) {
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
    // 判断一个对象是否是有限数字
    //
    Math.isFiniteNumber = function (o) {
        if (typeof o === "number") {
            return !isNaN(o) && isFinite(o);
        } else {
            return false;
        }
    };

    //
    // 筛选有限数字
    //
    Array.prototype.screenFiniteNumber = function () {
        var data = [];
        for (var i = 0; i < this.length; i++) {
            if (Math.isFiniteNumber(this[i])) {
                data.push(this[i]);
            }
        }
        return data;
    };

    //
    // 给数组对象添加一个 min() 方法
    //
    Array.prototype.min = function () {
        return Math.min.apply(null, this.screenFiniteNumber());
    };

    //
    // 给数组添加一个 max() 方法
    //
    Array.prototype.max = function () {
        return Math.max.apply(null, this.screenFiniteNumber());
    };

    Array.prototype.col = function (j) {
        var res = new Array(this[0].length);
        for (var i = 0; i < this.length; i++) {
            try {
                res[i] = this[i][j];
            } catch (ex) {
                res[i] = null;
            }
        }
        return res;
    };

    // 利用动态原型方法定义一个jGraffiti类
    function jGraffiti(graphBoardId, inputBoardId, xMinId, xMaxId, yMinId, yMaxId, tMinId, tMaxId, pointsCountId, graphButtonId, resetButtonId, shareButtonId, linkButtonId, linkTextBoxId, chkShowLegendId, culture, percentageWidth, plotOptions) {
        this.config = {
            graphBoardId: graphBoardId,
            inputBoardId: inputBoardId,
            xMinId: xMinId,
            xMaxId: xMaxId,
            yMinId: yMinId,
            yMaxId: yMaxId,
            tMinId: tMinId,
            tMaxId: tMaxId,
            pointsCountId: pointsCountId,
            graphButtonId: graphButtonId,
            resetButtonId: resetButtonId,
            shareButtonId: shareButtonId,
            linkButtonId: linkButtonId,
            linkTextBoxId: linkTextBoxId,
            autoComputeRangeY: false,
            showLegendCheckId: chkShowLegendId
        };

        this.options = {
            culture: culture,
            graphBoardPercentageWidth: percentageWidth,
            plotOptions: (typeof (plotOptions) == "undefined" || plotOptions == null) ?
                        {
                            series: {
                                lines: { show: true },
                                points: { show: false }
                            },
                            grid: {
                                backgroundColor: { colors: ["#fff", "#eee"] }
                            }
                        } : plotOptions
        };

        this.attributes = {
            version: 1.3,
            points: 500,
            x1: "-PI * 2",
            x2: "PI * 2",
            y1: "-PI * 2",
            y2: "PI * 2",
            t1: 0,
            t2: "PI * 2",
            xTicks: 10,
            yTicks: 10,
            maxIterations: 10000
        };

        this.dataCenter = {
            userInput: "",
            functionList: [],
            dataList: []
        };

        this.resources = {
            zh_cn: {
                noMatchedBeginToken: "第 {0} 个字符( {1} )没有与之匹配的开始标记。",
                linkTip: "链接已经生成，请从下面的链接框中复制。"
            },

            en_us: {
                noMatchedBeginToken: "The {0} character ( {1} ) has no matched begin token.",
                linkTip: "Link generated, please copy it from below link textbox."
            }
        };

        this.resource = {
            noMatchedBeginToken: this.resources[this.options.culture] ? this.resources[this.options.culture].noMatchedBeginToken : this.resources.en_us.noMatchedBeginToken,
            linkTip: this.resources[this.options.culture] ? this.resources[this.options.culture].linkTip : this.resources.en_us.linkTip
        };

        if (!this._initialized) {
            //Define a local copy of jGraffiti
            var jG = this;

            // functionType: 标记是一个单函数还是一个函数组
            var FunctionType = { singleFunction: 0, functionGroup: 1 };
            // type: 函数类型
            // 0: y = f(x)
            // 1: {x = f(t); y = g(t)}
            // 2: x = f(y);
            var FunctionItemType = { fx: 0, ft: 1, fy: 2 };

            //
            // 构建UI界面
            //
            jGraffiti.prototype.buildUI = function () {
                this.ui = {};
                this.ui.$GraphBoard = $("#" + this.config.graphBoardId);
                this.ui.$InputBoard = $("#" + this.config.inputBoardId);
                this.ui.RangeX = {};
                this.ui.RangeX.$Min = $("#" + this.config.xMinId);
                this.ui.RangeX.$Max = $("#" + this.config.xMaxId);
                this.ui.RangeY = {};
                this.ui.RangeY.$Min = $("#" + this.config.yMinId);
                this.ui.RangeY.$Max = $("#" + this.config.yMaxId);
                this.ui.RangeT = {};
                this.ui.RangeT.$Min = $("#" + this.config.tMinId);
                this.ui.RangeT.$Max = $("#" + this.config.tMaxId);
                this.ui.$PointsCount = $("#" + this.config.pointsCountId);
                this.ui.$GraphButton = $("#" + this.config.graphButtonId);
                this.ui.$ResetButton = $("#" + this.config.resetButtonId);
                this.ui.$ShareButton = $("#" + this.config.shareButtonId);
                this.ui.$LinkButton = $("#" + this.config.linkButtonId);
                this.ui.$LinkTextBox = $("#" + this.config.linkTextBoxId);
                this.ui.$ShowLegendCheck = $("#" + this.config.showLegendCheckId);

                this.ui.reset = function () {
                    jG.ui.$InputBoard.attr("value", "");
                    jG.run();
                };

                this.ui.$GraphBoard.resize(function () {
                    $(this).css("height", $(this).width() + "px");
                });

                // Graph Button click
                this.ui.$GraphButton.click(function () {
                    jG.run();
                });

                // Reset Button Click
                this.ui.$ResetButton.click(function () {
                    jG.ui.reset();
                });

                // Link Button Click
                this.ui.$LinkButton.click(function () {
                    var link = "http://www.zizhujy.com/FunctionGraffiti?functions={0}&minOfx={1}&maxOfx={2}&minOfy={3}&maxOfy={4}&minOft={5}&maxOft={6}&points={7}";

                    var minOfx = jG.ui.RangeX.$Min.attr("value");
                    var maxOfx = jG.ui.RangeX.$Max.attr("value");
                    var minOfy = jG.ui.RangeY.$Min.attr("value");
                    var maxOfy = jG.ui.RangeY.$Max.attr("value");
                    var minOft = jG.ui.RangeT.$Min.attr("value");
                    var maxOft = jG.ui.RangeT.$Max.attr("value");
                    var functions = jG.ui.$InputBoard.attr("value");
                    var points = jG.ui.$PointsCount.attr("value");

                    link = String.format(link, encodeURIComponent(functions), encodeURIComponent(minOfx), encodeURIComponent(maxOfx),
                        encodeURIComponent(minOfy), encodeURIComponent(maxOfy), encodeURIComponent(minOft), encodeURIComponent(maxOft),
                        encodeURIComponent(points));

                    jG.ui.$LinkTextBox.attr("value", link);
                    alert(jG.resource.linkTip);
                });

                // Legend check box click
                this.ui.$ShowLegendCheck.click(function () {
                    jG.run();
                });

                this.ui.readAttributes = function () {
                    // Get values from UI
                    var number = parseInt(eval(jG.ui.$PointsCount.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.points = number;
                    else
                        jG.ui.$PointsCount.attr("value", jG.attributes.points);

                    number = parseFloat(eval(jG.ui.RangeT.$Min.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.t1 = number;
                    else
                        jG.ui.RangeT.$Min.attr("value", jG.attributes.t1);

                    number = parseFloat(eval(jG.ui.RangeT.$Max.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.t2 = number;
                    else
                        jG.ui.RangeT.$Max.attr("value", jG.attributes.t2);

                    number = parseFloat(eval(jG.ui.RangeX.$Min.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.x1 = number;
                    else
                        jG.ui.RangeX.$Min.attr("value", jG.attributes.x1);

                    number = parseFloat(eval(jG.ui.RangeX.$Max.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.x2 = number;
                    else
                        jG.ui.RangeX.$Max.attr("value", jG.attributes.x2);

                    number = parseFloat(eval(jG.ui.RangeY.$Min.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.y1 = number;
                    else
                        jG.ui.RangeY.$Min.attr("value", jG.attributes.y1);

                    number = parseFloat(eval(jG.ui.RangeY.$Max.attr("value")));
                    if (number.toString() != "NaN")
                        jG.attributes.y2 = number;
                    else
                        jG.ui.RangeY.$Max.attr("value", jG.attributes.y2);
                };

                // 调整涂鸦板的尺寸大小
                // 将涂鸦板的尺寸调整为父窗口宽度的100%，并使高度 = 宽度
                this.ui.autoResize = function () {
                    var $Parent = jG.ui.$GraphBoard.parent();
                    var parentWidth = $Parent.width();

                    var percentageWidth = jG.options.graphBoardPercentageWidth;

                    // Make the jG.ui.$GraphBoard percentage width to permit it to resize
                    jG.ui.$GraphBoard.css("width", (percentageWidth * 100) + "%");
                    jG.ui.$GraphBoard.css("height", (parentWidth * percentageWidth) + "px");
                };

                //this.ui.readAttributes();

                if (this.ui.$InputBoard.attr("value").length <= 0) {
                    var defaultFunctions = "sin(10*x);\ncos(2*x);\npow(x, 3);\nx/3;\n-x/3;\n0;\nx = 0;\n{x = 5*cos(t); y = 5*sin(t)}";

                    this.ui.$InputBoard.attr("value", defaultFunctions);
                }

                this.ui.autoResize();

            };

            jGraffiti.prototype.uiReady = function () {
                return !(this.ui == undefined);
            };

            //
            // 获取用户输入
            //
            jGraffiti.prototype.getUserInput = function () {
                if (this.uiReady()) {

                    this.dataCenter.userInput = this.ui.$InputBoard.attr("value");

                    return this.dataCenter.userInput;
                } else {
                    return "";
                }
            };

            //
            // 分析用户的输入，并将其中的函数整理成一个列表
            //
            jGraffiti.prototype.analyse = function () {
                // token: 每次读入的一个字符
                // line: 函数列表中的一行
                // i: 指向this.userInput的当前字符位置
                var token, flag, line, i;
                var userInput = this.dataCenter.userInput;

                var CharacterClass = { functionGroupBegin: -1, functionGroupEnd: 1, semicolon: 0, newLine: 2, carriageReturn: 3, functionBody: 4 };

                // 函数列表 
                var functionList = [];

                function addChar() {
                    line += token;
                }

                function addLine(type) {
                    if (line.length > 0) {
                        functionList.push([line, type]);
                        line = "";
                    }
                }

                function getChar() {
                    token = userInput.substring(i, i + 1);
                    i++;
                    // 有的浏览器（比如Visual Web Developer 2008 速成版中所带的浏览器）不支持对字符串的下标取值
                    // token = userInput[i++];
                }

                function charClass() {
                    if (token == "{") {
                        return CharacterClass.functionGroupBegin;
                    } else if (token == "}") {
                        return CharacterClass.functionGroupEnd;
                    } else if (token == ";") {
                        return CharacterClass.semicolon;
                    } else if (token == "\n") {
                        return CharacterClass.newLine;
                    } else if (token == "\r") {
                        return CharacterClass.carriageReturn;
                    } else {
                        return CharacterClass.functionBody;
                    }
                }

                // 默认是函数开始，其类型为单函数
                var type = FunctionType.singleFunction;
                line = "";
                i = 0;

                // Clear all elements of functionList
                this.dataCenter.functionList.splice(0, this.dataCenter.functionList.length);
                // 依次读进一个字符
                while (i < userInput.length) {
                    getChar();
                    switch (charClass()) {
                        case CharacterClass.functionBody:
                            // 该字符是函数体中的一个字符，则加入行
                            addChar();
                            break;

                        case CharacterClass.functionGroupEnd:
                            if (type == FunctionType.functionGroup) {
                                // 碰到函数组结束字符，则将行添加到列表里。
                                addLine(type);
                                // 碰到}，说明函数组结束，将函数类型设置为 singleFunction
                                type = FunctionType.singleFunction;
                            } else {
                                try {
                                    // 如果前面没有过函数组开始字符，而这里却碰上了函数组结束字符，则说明语法不对
                                    var s = i;

                                    if (this.options.culture == "en_us") {
                                        s = (i == 1) ? i + "st" : ((i == 2) ? i + "nd" : ((i == 3) ? i + "rd" : i + "th"));
                                    }

                                    throw String.format(this.resource.noMatchedBeginToken, s, token);
                                    getChar();
                                } catch (err) {
                                    alert(err);
                                }
                            }
                            break;

                        case CharacterClass.semicolon:
                            // 碰到;，说明单函数结束或者函数组中的一个函数结束了
                            if (type == FunctionType.singleFunction) {
                                // 单函数
                                addLine(type);
                            } else if (type == FunctionType.functionGroup) {

                                // 函数组
                                addChar();
                            }
                            break;

                        case CharacterClass.functionGroupBegin:
                            // 碰到 {， 说明函数组开始，将函数类型设置为 functionGroup
                            type = FunctionType.functionGroup;
                            break;

                        default:
                            break;
                    }
                }

                if (line.toString().length > 0) {
                    addLine(FunctionType.singleFunction);
                }

                this.dataCenter.functionList = functionList;
                return functionList;
            };

            //
            // 生成数据点
            //
            jGraffiti.prototype.generateDataPoints = function (n, x1, x2, y1, y2, t1, t2) {

                var type = FunctionItemType.fx;
                // 步长
                var step = 0;
                // 这里一定要初始化 x = 0, y = 0，否则可能出现不能画 x = 0; x = y 之类的函数。 
                var x = 0, y = 0, expression;

                if (!n) var n = eval(this.attributes.points);
                if (!x1) var x1 = eval(this.attributes.x1);
                if (!x2) var x2 = eval(this.attributes.x2);
                if (!y1) var y1 = eval(this.attributes.y1);
                if (!y2) var y2 = eval(this.attributes.y2);
                if (!t1) var t1 = eval(this.attributes.t1);
                if (!t2) var t2 = eval(this.attributes.t2);

                // 清除数据点列表
                this.dataCenter.dataList.splice(0, this.dataCenter.dataList.length);

                for (var j = 0; j < this.dataCenter.functionList.length; j++) {
                    expression = this.dataCenter.functionList[j][0];
                    var functionType = this.dataCenter.functionList[j][1];
                    if (functionType == FunctionType.singleFunction) {
                        // y = f(x) or x = f(y) or f(x)
                        if (expression.indexOf("=") >= 0) {
                            // y = f(x) or x = f(y)
                            if (expression.split("=")[0].trim() == "y") {
                                // y = f(x)
                                type = FunctionItemType.fx;
                            } else {
                                // x = f(y)
                                type = FunctionItemType.fy;
                            }
                            // 去掉 = 号以及它左边的内容，保留右边的表达式
                            expression = expression.split("=")[1].trim();
                        } else {
                            // f(x)
                            type = FunctionItemType.fx;
                        }
                    } else if (functionType == FunctionType.functionGroup) {
                        type = FunctionItemType.ft;
                    }
                    this.dataCenter.dataList.push([]);
                    try {
                        switch (type) {
                            case FunctionItemType.fx:
                                // y = f(x)
                                step = (x2 - x1) / n;
                                var count = 0;
                                var crossBorder = false;
                                for (var i = x1; i <= x2; i += step) {
                                    x = i;
                                    y = eval(expression);

                                    var index = this.dataCenter.dataList.length - 1;

                                    var dataArr = this.dataCenter.dataList[index];

                                    dataArr.push([x, y]);

                                    if (y > y1 && y < y2) {
                                        if (crossBorder) {
                                            dataArr.splice(dataArr.length - 2, 1);
                                        }
                                        crossBorder = false;
                                        count++;
                                    } else {
                                        crossBorder = true;
                                        dataArr.push(null);
                                    }
                                    if (count >= this.attributes.maxIterations) {
                                        break;
                                    }
                                }
                                break;

                            case FunctionItemType.ft:
                                // {x = f(t); y = g(t)}
                                step = (t2 - t1) / n;
                                var xExpression = expression.split(";")[0].trim();
                                var yExpression = expression.split(";")[1].trim();
                                var count = 0;
                                for (var t = t1; t <= t2; t += step) {
                                    eval(xExpression);
                                    eval(yExpression);
                                    this.dataCenter.dataList[this.dataCenter.dataList.length - 1].push([x, y]);
                                    count++;
                                    if (count >= this.attributes.maxIterations) {
                                        break;
                                    }
                                }
                                break;

                            case FunctionItemType.fy:
                                // x = f(y)
                                step = (y2 - y1) / n;
                                var count = 0;
                                var crossBorder = false;
                                for (var i = y1; i <= y2; i += step) {
                                    y = i;
                                    x = eval(expression);

                                    var index = this.dataCenter.dataList.length - 1;
                                    var dataArr = this.dataCenter.dataList[index];

                                    dataArr.push([x, y]);

                                    if (x > x1 && x < x2) {
                                        if (crossBorder) {
                                            dataArr.splice(dataArr.length - 2, 1);
                                        }
                                        crossBorder = false;
                                        count++;
                                    } else {
                                        crossBorder = true;
                                        dataArr.push(null);
                                    }

                                    if (count >= this.attributes.maxIterations) {
                                        break;
                                    }
                                }
                                break;

                            default:
                                step = (x2 - x1) / n;
                                break;
                        } // switch()
                    } catch (err) {
                        alert(err);
                    }
                }

                return this.dataCenter.dataList;
            };

            //
            // 画图
            //
            jGraffiti.prototype.makeGraph = function () {
                var dataArg = [];
                if (this.ui.$ShowLegendCheck.attr("checked")) {
                    for (var i = 0; i < this.dataCenter.dataList.length; i++) {
                        dataArg.push({ label: this.dataCenter.functionList[i][0], data: this.dataCenter.dataList[i] });
                    }
                } else {
                    for (var i = 0; i < this.dataCenter.dataList.length; i++) {
                        dataArg.push({ label: "", data: this.dataCenter.dataList[i] });
                    }
                }

                var x1 = eval(this.attributes.x1);
                var x2 = eval(this.attributes.x2);
                var y1 = eval(this.attributes.y1);
                var y2 = eval(this.attributes.y2);

                if (this.config.autoComputeRangeY) {
                    var ysMin = [];
                    var ysMax = [];
                    for (var i = 0; i < this.dataCenter.dataList.length; i++) {
                        ysMin.push(this.dataCenter.dataList[i].col(1).min());
                        ysMax.push(this.dataCenter.dataList[i].col(1).max());
                    }

                    y1 = ysMin.min();
                    y2 = ysMax.max();

                    var r = (x2 - x1) / (y2 - y1);

                    y1 = y1 * r;
                    y2 = y2 * r;

                    this.ui.RangeY.$Min.val(y1);
                    this.ui.RangeY.$Max.val(y2);
                }

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

                    var ploter = $.plot(
                        this.ui.$GraphBoard,
                        dataArg,
                        this.options.plotOptions
                    );
                } catch (err) {
                    alert(err);
                }
            };

            //
            // 运行
            //      获取用户输入
            //      分析输入，整理成函数列表
            //      生成数据点
            //      画图
            //
            jGraffiti.prototype.run = function () {
                this.ui.readAttributes();
                this.getUserInput();
                this.analyse();
                this.generateDataPoints();
                this.makeGraph();
            };

            jGraffiti.prototype.graph = function (functions, minOfx, maxOfx, minOfy, maxOfy, minOft, maxOft, points) {
                if (functions != undefined) {
                    this.ui.$InputBoard.attr("value", functions);
                }

                if (minOfx != undefined) {
                    this.ui.RangeX.$Min.attr("value", minOfx);
                }

                if (maxOfx != undefined) {
                    this.ui.RangeX.$Max.attr("value", maxOfx);
                }

                if (minOfy != undefined) {
                    this.ui.RangeY.$Min.attr("value", minOfy);
                }

                if (maxOfy != undefined) {
                    this.ui.RangeY.$Max.attr("value", maxOfy);
                }

                if (minOft != undefined) {
                    this.ui.RangeT.$Min.attr("value", minOft);
                }

                if (maxOft != undefined) {
                    this.ui.RangeT.$Max.attr("value", maxOft);
                }

                if (points != undefined) {
                    this.ui.$PointsCount.attr("value", points);
                }

                this.run();
            };

            this._initialized = true;
        }

        this.buildUI();
        this.plugin();
        //        this.run();
    }

    jGraffiti.prototype.plugin = function () { };

    window.JGraffiti = jGraffiti;
})(jQuery);