//*************************************************************************
// jPloter
//
// Version: 1.0
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Online function ploter
//
// using jQuery.js
// using jQuery.flot.js
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
    function jPloter(graphBoardId, inputBoardId, graphButtonId, resetButtonId, shareButtonId, linkButtonId, linkTextBoxId, culture, percentageWidth, plotOptions) {
        this.config = {
            graphBoardId: graphBoardId,
            inputBoardId: inputBoardId,
            graphButtonId: graphButtonId,
            resetButtonId: resetButtonId,
            shareButtonId: shareButtonId,
            linkButtonId: linkButtonId,
            linkTextBoxId: linkTextBoxId
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
            version: 1.0,
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

                // 调整涂鸦板的尺寸大小
                // 将涂鸦板的尺寸调整为父窗口宽度的40%，并使高度 = 宽度
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
            jPloter.prototype.run = function () {
                this.getUserInput();
                this.analyse();
                this.generateDataPoints();
                this.makeGraph();
            };

            jPloter.prototype.graph = function(x, y) {
                
            };

            this._initialized = true;
        }

        this.buildUI();
        this.plugin();
        this.run();
    }

    jPloter.prototype.plugin = function() {};

    window.JPloter = jPloter;
})(jQuery);