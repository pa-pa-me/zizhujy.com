(function ($) {
    // 用动态原型方法定义一个jFunGrapher()对象
    // arguments:
    //  0:  canvasId;
    //  1:  functionListId;
    //  2:  btnGraph
    //  3:  btnClear
    //  4:  txtXmin
    //  5:  txtXmax
    //  6:  txtYmin
    //  7:  txtYmax
    //  8:  txtTmin
    //  9:  txtTmax
    //  10: chkLockRatioId
    //  11: chkShowLegend
    //  12: divCoorId
    //  13: chkHelp
    //  14: divTipsId
    //  15: btnCloseTipsId
    //  16: divMsgId
    //  17: divMsgBody
    //  18: btnCloseMsgId
    //  19: divNavButtons
    //  20: divErrorList
    function jFunGrapher() {
        var canvasId = "canvas";
        if (arguments.length > 0)
            canvasId = arguments[0];
        var functionListId = "taFunctionList";
        if (arguments.length > 1)
            functionListId = arguments[1];
        var btnGraphId = "btnGraph";
        if (arguments.length > 2)
            btnGraphId = arguments[2];
        var btnClearId = "btnClear";
        if (arguments.length > 3) btnClearId = arguments[3];
        var txtXminId = "txtXmin";
        if (arguments.length > 4) txtXminId = arguments[4];
        var txtXmaxId = "txtXmax";
        if (arguments.length > 5) txtXmaxId = arguments[5];
        var txtYminId = "txtYmin";
        if (arguments.length > 6) txtYminId = arguments[6];
        var txtYmaxId = "txtYmax";
        if (arguments.length > 7) txtYmaxId = arguments[7];
        var txtTminId = "txtTmin";
        if (arguments.length > 8) txtTminId = arguments[8];
        var txtTmaxId = "txtTmax";
        if (arguments.length > 9) txtTmaxId = arguments[9];
        var chkLockRatioId = "chkLockRatio";
        if (arguments.length > 10) chkLockRatioId = arguments[10];
        var chkShowLegendId = "chkShowLegend";
        if (arguments.length > 11) chkShowLegendId = arguments[11];
        var divCoorId = "coor";
        if (arguments.length > 12) divCoorId = arguments[12];
        var chkShowHelpId = "chkHelp";
        if (arguments.length > 13) chkShowHelpId = arguments[13];
        var divTipsId = "tips";
        if (arguments.length > 14) divTipsId = arguments[14];
        var btnCloseTipsId = "closeTips";
        if (arguments.length > 15) btnCloseTipsId = arguments[15];
        var divMsgId = "msg";
        if (arguments.length > 16) divMsgId = arguments[16];
        var divMsgBody = "#msg .body";
        if (arguments.length > 17) divMsgBody = arguments[17];
        var btnCloseMsgId = "closeMsg";
        if (arguments.length > 18) btnCloseMsgId = arguments[18];
        var divNavButtonsId = "navButtons";
        if (arguments.length > 19) divNavButtonsId = arguments[19];
        var divErrorListId = "divErrorList";
        if (arguments.length > 20) divErrorListId = arguments[20];

        this.ui = {
            $Canvas: $("#" + canvasId),
            $UserInput: $("#" + functionListId),
            $GraphButton: $("#" + btnGraphId),
            $ClearButton: $("#" + btnClearId),
            $Xmin: $("#" + txtXminId),
            $Xmax: $("#" + txtXmaxId),
            $Ymin: $("#" + txtYminId),
            $Ymax: $("#" + txtYmaxId),
            $Tmin: $("#" + txtTminId),
            $Tmax: $("#" + txtTmaxId),
            $LockRatioCheckBox: $("#" + chkLockRatioId),
            $ShowLegendCheckBox: $("#" + chkShowLegendId),
            $ShowHelpCheckBox: $("#" + chkShowHelpId),
            $Tips: $("#" + divTipsId),
            $CloseTipsButton: $("#" + btnCloseTipsId),
            $Msg: $("#" + divMsgId),
            $MsgBody: $(divMsgBody),
            $CloseMsgButton: $("#" + btnCloseMsgId),
            $Coor: $("#" + divCoorId),
            $NavButtons: $("#" + divNavButtonsId),
            $ErrorList: $("#" + divErrorListId)
        };

        this.settings = {
            xMin: -5,
            xMax: 5,
            yMin: -3,
            yMax: 3,
            tMin: 0,
            tMax: eval("2*PI"),
            lockRatio: true,
            showLegend: true
        };

        this.functionList = null;
        this.data = null;
        this.plot = null;
        this.messages = [];

        if (!this._initialized) {
            var jfg = this;

            jFunGrapher.prototype.readSettings = function () {
                this.settings.xMin = eval(this.ui.$Xmin.val());
                this.settings.xMax = eval(this.ui.$Xmax.val());
                this.settings.yMin = eval(this.ui.$Ymin.val());
                this.settings.yMax = eval(this.ui.$Ymax.val());
                this.settings.tMin = eval(this.ui.$Tmin.val());
                this.settings.tMax = eval(this.ui.$Tmax.val());
                this.settings.lockRatio = this.ui.$LockRatioCheckBox.attr("checked");
                this.settings.showLegend = this.ui.$ShowLegendCheckBox.attr("checked");
            };

            jFunGrapher.prototype.readFunctions = function () {
                var s = this.ui.$UserInput.val();
                this.messages.splice(0, this.messages.length);
                this.functionList = null;
                try {
                    this.functionList = new JFunctionList(s);
                } catch (ex) {
                    this.messages.push(ex);
                }
                if (this.functionList != null && this.functionList.messages instanceof Array) {
                    for (var i = 0; i < this.functionList.messages.length; i++) {
                        this.messages.push(this.functionList.messages[i]);
                    }
                }
            };

            jFunGrapher.prototype.prepareData = function () {
                this.data = [];
                if (this.functionList != null && this.functionList.functions != null && this.functionList.functions instanceof Array) {
                    for (var i = 0; i < this.functionList.functions.length; i++) {
                        if (this.functionList.functions[i].isValid) {
                            var min = this.settings.xMin;
                            var max = this.settings.xMax;
                            var dependentMin = this.settings.yMin;
                            var dependentMax = this.settings.yMax;
                            try {
                                switch (this.functionList.functions[i].getFunctionType()) {
                                    case JFunctionItemType.fx:
                                        this.data.push({ label: this.functionList.functions[i].source, data: this.functionList.functions[i].generateDataPoints(min, max, dependentMin, dependentMax, this.ui.$Canvas.width(), this.ui.$Canvas.height()) });
                                        break;

                                    case JFunctionType.functionGroup:
                                        min = this.settings.tMin;
                                        max = this.settings.tMax;

                                        this.data.push({ label: this.functionList.functions[i].source, data: this.functionList.functions[i].generateDataPointsFast(500, min, max) });

                                        break;

                                    case JFunctionItemType.fy:
                                        min = this.settings.yMin;
                                        max = this.settings.yMax;
                                        dependentMin = this.settings.xMin;
                                        dependentMax = this.settings.xMax;

                                        this.data.push({ label: this.functionList.functions[i].source, data: this.functionList.functions[i].generateDataPointsFast(500, min, max, dependentMin, dependentMax) });

                                        break;

                                    default:
                                        break;
                                } // end switch
                            } catch (ex) {
                                this.messages.push(String.format("{0} (相关输入：{1})", ex, this.functionList.functions[i].source));
                            } // end try
                        } // end if
                        else {
                            this.messages.push(String.format("未能识别：{0}", this.functionList.functions[i].source));
                        }
                    } // end for
                } // end if 

                if (this.messages instanceof Array && this.messages.length > 0) {
                    this.setMessage();
                    this.showMessage();
                } else {
                    this.hideMessage();
                }
            };

            jFunGrapher.prototype.graph = function (opts) {
                var options = {
                    xaxis: { min: this.settings.xMin, max: this.settings.xMax },
                    yaxis: { min: this.settings.yMin, max: this.settings.yMax },
                    lines: { show: false },
                    points: { show: true, radius: 0.001, symbol: "square" },
                    legend: { show: this.settings.showLegend },
                    zoom: {
                        interactive: true
                    },
                    pan: {
                        interactive: true,
                        frameRate: 70
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    },
                    series: {
                        input: 'y = 1/x',
                        inputType: 'explicitFunctionFx'
                    }
                };
                if (opts != null) {
                    $.extend(true, options, opts);
                }
                this.plot = $.plot(this.ui.$Canvas, this.data, options);
                //$("<div></div>").html(this.plot.getData()[0].data.toHtmlString()).appendTo("body");
            };

            jFunGrapher.prototype.mergeOptions = function () {
                var options = {};
                for (var i = 0; i < arguments.length; i++) {
                    var opts = arguments[i];
                    if (opts != null) {
                        $.extend(true, options, opts);
                    }
                }
                return options;
            };

            jFunGrapher.prototype.setUI = function () {
                if (this.plot != null) {
                    var xMin = this.plot.getAxes().xaxis.min;
                    var xMax = this.plot.getAxes().xaxis.max;
                    var yMin = this.plot.getAxes().yaxis.min;
                    var yMax = this.plot.getAxes().yaxis.max;
                    if (xMin != this.ui.$Xmin.val())
                        this.ui.$Xmin.val(xMin);
                    if (xMax != this.ui.$Xmax.val())
                        this.ui.$Xmax.val(xMax);
                    if (yMin != this.ui.$Ymin.val())
                        this.ui.$Ymin.val(yMin);
                    if (yMax != this.ui.$Ymax.val())
                        this.ui.$Ymax.val(yMax);

                    if (!($.browser.mozilla || $.browser.msie)) {
                        var $Buttons = this.ui.$NavButtons.appendTo(this.ui.$Canvas).find(".button").click(function (e) {
                            e.preventDefault();
                            var panObject = $.parseJSON($(this).attr("pan"));
                            jfg.plot.pan(panObject);
                            jfg.setUI();
                            jfg.go({ xaxis: { min: jfg.plot.getAxes().xaxis.min, max: jfg.plot.getAxes().xaxis.max }, yaxis: { min: jfg.plot.getAxes().yaxis.min, max: jfg.plot.getAxes().yaxis.max} });
                        });
                    }
                }
            };

            jFunGrapher.prototype.getCanvasHVRatio = function () {
                var ratio = 0;
                if (this.plot != null) {
                    var xMin = this.plot.getAxes().xaxis.min;
                    var xMax = this.plot.getAxes().xaxis.max;
                    var yMin = this.plot.getAxes().yaxis.min;
                    var yMax = this.plot.getAxes().yaxis.max;

                    ratio = (xMax - xMin) / (yMax - yMin);
                }
                return ratio;
            };

            jFunGrapher.prototype.getCanvasHVRatioIcon = function () {
                var ratio = this.getCanvasHVRatio();
                if (ratio > 1) {
                    return "-";
                } else if (ratio == 1) {
                    return "|";
                    return "o";
                } else if (ratio > 0) {
                } else {
                    return "x";
                }
            };

            jFunGrapher.prototype.getPlaceHolderHVRatio = function () {
                var width = this.ui.$Canvas.width();
                var height = this.ui.$Canvas.height();
                var ratio = width / height;
                return ratio;
            };

            jFunGrapher.prototype.setCanvasHVRatio = function (ratio, baseAxis) {
                var opts = null;
                var xMin0 = this.settings.xMin;
                var xMax0 = this.settings.xMax;
                var yMin0 = this.settings.yMin;
                if (!Math.isFiniteNumber(yMin0)) yMin0 = -1;
                var yMax0 = this.settings.yMax;
                if (!Math.isFiniteNumber(yMax0)) yMax0 = 1;
                var r0 = (xMax0 - xMin0) / (yMax0 - yMin0);
                var r1 = ratio;

                if (baseAxis == "x") {
                    var yMin1 = (yMax0 * (r1 - r0) + yMin0 * (r1 + r0)) / (2 * r1);
                    var yMax1 = (yMax0 * (r1 + r0) + yMin0 * (r1 - r0)) / (2 * r1);

                    this.settings.yMin = yMin1;
                    this.settings.yMax = yMax1;

                    opts = { yaxis: { min: yMin1, max: yMax1} };
                } else if (baseAxis == "y") {
                    var xMin1 = (xMax0 * (r0 - r1) + xMin0 * (r0 + r1)) / (2 * r0);
                    var xMax1 = (xMax0 * (r0 + r1) + xMin0 * (r0 - r1)) / (2 * r0);

                    this.settings.xMin = xMin1;
                    this.settings.xMax = xMax1;

                    opts = { xaxis: { min: xMin1, max: xMax1} };
                } else {
                }
                return opts;
            };

            jFunGrapher.prototype.setHVRatio = function () {
                var ratio = 1;
                if (arguments.length > 0) ratio = arguments[0];
                var base = "x";
                if (arguments.length > 1) base = arguments[1];

                if (base == "x") {
                    var newRatio = this.getPlaceHolderHVRatio() * ratio;
                    return this.setCanvasHVRatio(newRatio, base);
                } else if (base == "y") {
                    var newRatio = this.getPlaceHolderHVRatio() * ratio;
                    return this.setCanvasHVRatio(newRatio, base);
                } else {
                    return null;
                }
            };

            jFunGrapher.prototype.go = function (onPreGraph, onPostGraph) {
                var opts = null;
                this.readSettings();
                this.readFunctions();

                if (typeof onPreGraph == "function") {
                    opts = onPreGraph();
                } else if (typeof onPreGraph == "object") {
                    opts = onPreGraph;
                }

                this.prepareData();
                this.graph(opts);

                if (typeof onPostGraph == "function")
                    onPostGraph();
                this.setUI();
            };

            jFunGrapher.prototype.showHelp = function () {
                this.ui.$Tips.css("display", "block");
            };

            jFunGrapher.prototype.hideHelp = function () {
                this.ui.$Tips.css("display", "none");
            };

            jFunGrapher.prototype.handleHelp = function () {
                if (this.ui.$ShowHelpCheckBox.attr("checked"))
                    this.showHelp();
                else
                    this.hideHelp();
            };

            jFunGrapher.prototype.showMessage = function () {
                //this.ui.$Msg.css("display", "block");
                this.ui.$ErrorList.css("display", "block");
            };

            jFunGrapher.prototype.hideMessage = function () {
                this.ui.$Msg.css("display", "none");
                this.ui.$ErrorList.css("display", "none");
            };

            jFunGrapher.prototype.setMessage = function () {
                msgHtml = "";
                if (arguments.length > 0)
                    msgHtml = arguments[0];
                else {
                    var msgFormat = "<h3>碰到如下错误：</h3><ul>{0}</ul><p>请根据以上提示检查是否有输入错误。</p><p>注意函数名后必须用小括号将自变量括起来。如输入y = sinx是不对的，应该输入y = sin(x);。多个函数之间必须用分号;分隔。</p><p>详细帮助请点击右上方的<a href=\"#\" onclick=\"$('#chkHelp').attr('checked', 'checked'); $('#chkHelp').trigger('click'); $('#chkHelp').attr('checked', 'checked'); $('#msg').css('display', 'none'); return false;\">帮助</a>复选框。</p><p>&nbsp;</p><p style='color: black;'>如果您确定输入没有问题，那么请发邮件给<a href='mailto:jeff@zizhujy.com?subject=BUG:FunGrapher&body={1}'>jeff@zizhujy.com</a>，向开发者报告此问题。谢谢！</p>";
                    var msgItemFormat = "<li>{0}</li>";
                    for (var i = 0; i < this.messages.length; i++) {
                        msgHtml += String.format(msgItemFormat, this.messages[i]);
                    }
                    msgHtml = String.format(msgFormat, msgHtml, this.ui.$UserInput.val());
                }

                this.ui.$MsgBody.html(msgHtml);

                if (!!this.functionList && !!this.functionList.errorList) {
                    var errorHtml = this.functionList.errorList.toHtml("errorList", false, "错误列表");
                    this.ui.$ErrorList.html(errorHtml);
                } else {
                    this.ui.$ErrorList.html("");
                }
            };

            this._initialized = true;
        }

        this.go(function () { /*return jfg.mergeOptions(jfg.setHVRatio(1));*/ });

        // Event handlers:
        this.ui.$GraphButton.click(function () {
            jfg.go(function () { /*return jfg.mergeOptions(jfg.setHVRatio(1));*/ });
        });
        this.ui.$ClearButton.click(function () {
            jfg.ui.$UserInput.val("");
            jfg.go();
        });
        this.ui.$UserInput.change(function () {
            jfg.go();
        });
        this.ui.$ShowLegendCheckBox.click(function () {
            jfg.go();
        });

        this.ui.$Xmin.change(function () {
            jfg.go();
        });

        this.ui.$Xmax.change(function () {
            jfg.go();
        });

        this.ui.$Ymin.change(function () {
            jfg.go();
        });
        this.ui.$Ymax.change(function () {
            jfg.go();
        });
        this.ui.$Tmin.change(function () {
            jfg.go();
        });
        this.ui.$Tmax.change(function () {
            jfg.go();
        });

        // show pan/zoom messages to illustrate events 
        //        this.ui.$Canvas.bind('plotpan', function (event, plot) {
        //            jfg.setUI();
        //            jfg.go();
        //        });

        this.ui.$Canvas.mouseup(function () {
            if (jfg.plot != null) {
                jfg.setUI();
                if (!$.browser.msie) {
                    jfg.go({ xaxis: { min: jfg.plot.getAxes().xaxis.min, max: jfg.plot.getAxes().xaxis.max }, yaxis: { min: jfg.plot.getAxes().yaxis.min, max: jfg.plot.getAxes().yaxis.max} });
                }
            }
        }).mouseout(function () {
            if (jfg.plot != null) {
                jfg.setUI();
                if (!$.browser.msie) {
                    jfg.go({ xaxis: { min: jfg.plot.getAxes().xaxis.min, max: jfg.plot.getAxes().xaxis.max }, yaxis: { min: jfg.plot.getAxes().yaxis.min, max: jfg.plot.getAxes().yaxis.max} });
                }
            }
        });

        this.ui.$Canvas.bind('plotzoom', function (event, plot) {
            //svar axes = plot.getAxes();
            jfg.setUI();
            jfg.go();
        });

        // interactive with data points
        this.ui.$Canvas.bind("plothover", function (event, pos, item) {
            function showTooltip(x, y, contents) {
                $("<div id='tooltipForPoint'>" + contents + "</div>").css({
                    position: "absolute",
                    display: "none",
                    top: y + 10,
                    left: x + 10,
                    border: "1px solid #faa",
                    padding: "2px",
                    color: "#000",
                    "background-color": "#fee",
                    opacity: 0.80
                }).appendTo("body").fadeIn(200);
            }

            try {
                jfg.ui.$Coor.text(String.format("({0}, {1})", pos.x.toFixed(2), pos.y.toFixed(2)));
                $("#tooltipForPoint").remove();
                if (item) {
                    var x = item.datapoint[0].toFixed(2);
                    var y = item.datapoint[1].toFixed(2);
                    showTooltip(item.pageX, item.pageY, String.format("({1},{2}) <br />{0}", item.series.label, x, y));
                }
            } catch (ex) {
                // do nothing
            }
        });

        this.ui.$Canvas.bind("plotclick", function (event, pos, item) {
            if (item)
                jfg.plot.highlight(item.series, item.datapoint);
        });

        this.ui.$ShowHelpCheckBox.click(function () {
            jfg.handleHelp();
        });

        this.ui.$CloseTipsButton.click(function () {
            jfg.ui.$ShowHelpCheckBox.attr("checked", "");
            jfg.handleHelp();
            return false;
        });

        this.ui.$CloseMsgButton.click(function () {
            jfg.hideMessage();
            return false;
        });

        $("table.errorList tbody tr").live("click", function () {
            $(this).siblings().removeClass("selected");
            if (!$(this).hasClass("selected"))
                $(this).addClass("selected");
        }).live("dblclick", function () {
            var index = parseInt($(this).find("td:eq(5)").text());
            jfg.ui.$UserInput.focus();
            jfg.ui.$UserInput.attr("selectionStart", index);
            jfg.ui.$UserInput.attr("selectionEnd", index + 1);
        });
    }
    window.JFunGrapher = jFunGrapher;
})(jQuery);