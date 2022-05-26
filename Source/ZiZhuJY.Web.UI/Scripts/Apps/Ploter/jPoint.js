//*************************************************************************
// jPloter
//
// Version: 1.0
// Copyright (c) 2012 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Online function ploter
//
// using zizhujy.com.js;
// using jQuery.js
// using jQuery.flot.js
// using jStats.js
// using zizhujy.com.Matrix.js
//
(function ($) {
    // 利用动态原型方法定义一个Point2D类
    function Point2D() {
        this.x = arguments[0];
        this.y = arguments[1];
    }

    window.Point2D = Point2D;

    // 利用动态原型方法定义一个jPoint2D类
    // arguments:
    //      originInput: required, a string
    //      delimiter: optional, a regular expression
    function jPoint2D() {
        this.originInput = arguments[0];
        this.delimiter = /[ ,\t;]+/;
        if (arguments.length > 1) this.delimiter = arguments[1];
        this.x = Number.NEGATIVE_INFINITY;
        this.y = Number.NEGATIVE_INFINITY;
        this.messages = [];

        if (!this._initialized) {
            jPoint2D.prototype.toArray = function () {
                return [this.x, this.y];
            };

            jPoint2D.prototype.analyse = function () {
                this.messages.clear();
                var a = this.originInput.trim().split(this.delimiter);
                if (a instanceof Array && a.length == 2) {
                    try {
                        this.x = parseFloat(a[0]);
                        this.y = parseFloat(a[1]);
                    } catch (ex) {
                        this.messages.push("{0} 不是一个有效的数据点。识别时碰到错误：{1}".format(this.originInput, ex));
                    }
                } else {
                    this.messages.push("{0} 不是一个有效的数据点".format(this.originInput));
                }
            };

            jPoint2D.prototype.isValid = function () {
                return (this.messages instanceof Array && this.messages.length == 0);
            };

            this._initialized = true;
        }

        this.analyse();
    }
    window.JPoint2D = jPoint2D;

    // 利用动态原型法定义一个jPoints2D类
    // arguments:
    //      originInput: required, a string
    //      delimiter: optional , a regular expression
    function jPoints2D() {
        this.originInput = arguments[0];
        this.delimiter = /[\r\n]+/;
        if (arguments.length > 1) this.delimiter = arguments[1];
        this.points = [];
        this.messages = [];

        if (!this._initialized) {
            jPoints2D.prototype.preProcess = function (s) {
                // 替换中文标点
                var string = s.replace("，", ",").replace("；", ";").replace("。", ".").replace("（", "(").replace("）", ")").trim();
                return string;
            };

            jPoints2D.prototype.analyse = function () {
                var input = this.preProcess(this.originInput);
                this.messages.clear();
                if (typeof input == "string" && input.length > 0) {
                    var a = input.split(this.delimiter);
                    if (a instanceof Array && a.length > 0) {
                        for (var i = 0; i < a.length; i++) {
                            var point = new jPoint2D(a[i]);
                            this.points.push(point);
                            if (point.isValid()) {
                            } else {
                                this.messages.push("在识别第{0}个数据点输入 {2} 时碰到错误：{1}".format(i + 1, point.messages.toString("; ", true), a[i].toString()));
                            }
                        }
                    } else {
                        this.messages.push("识别错误，输入的不是有效的数据点列");
                    }
                }
            };

            // arguments:
            //      all: boolean
            jPoints2D.prototype.toArray = function () {
                var array = [];
                var listAll = false;
                if (arguments.length > 0) listAll = arguments[0];
                if (!listAll) {
                    for (var i = 0; i < this.points.length; i++) {
                        if (this.points[i].isValid())
                            array.push(this.points[i].toArray());
                    }
                } else {
                    for (var i = 0; i < this.points.length; i++) {
                        array.push(points[i].toArray());
                    }
                }

                return array;
            };

            this._initialized = true;
        }

        this.analyse();
    }
    window.JPoints2D = jPoints2D;
})(jQuery);