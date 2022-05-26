//*************************************************************************
// jPloter
//
// Version: 1.1.1
// Copyright (c) 2012-2014 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Online function ploter
//
// using zizhujy.com.js;
// using jQuery.js
// using jQuery.flot.js
// using jStats.js
// using zizhujy.com.Matrix.js
// using Globalize
//
(function ($, Globalize) {
    // 利用动态原型方法定义一个Point2D类
    function Point2D() {
        this.x = arguments[0];
        this.y = arguments[1];
    }

    window.Point2D = Point2D;

    // 利用动态原型方法定义一个jPoint2D类
    // arguments:
    //      originInput: required, an array [x, y]
    function jPoint2D() {
        this.originInput = arguments[0];
        this.x = Number.NEGATIVE_INFINITY;
        this.y = Number.NEGATIVE_INFINITY;
        this.messages = [];

        if (!this._initialized) {
            jPoint2D.prototype.toArray = function () {
                return [this.x, this.y];
            };

            jPoint2D.prototype.analyse = function () {
                this.messages.clear();
                var a = this.originInput;
                if (a instanceof Array && a.length == 2) {
                    try {
                        this.x = parseFloat(a[0]);
                        this.y = parseFloat(a[1]);
                    } catch (ex) {
                        //this.messages.push("{0} 不是一个有效的数据点。识别时碰到错误：{1}".format(this.originInput, ex));
                        this.messages.push(Globalize.localize("message.format.not.a.valid.data.point").format(this.originInput) +
                            Globalize.localize("message.format.error.encountered.when.identifying").format(ex));
                    }
                } else {
                    //this.messages.push("{0} 不是一个有效的数据点".format(this.originInput));
                    this.messages.push(Globalize.localize("message.format.not.a.valid.data.point").format(this.originInput));
                }
                if (isNaN(this.x) || isNaN(this.y)) {
                    this.messages.push(Globalize.localize("message.format.not.a.valid.data.point").format(this.originInput));
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
    //      originInput: required, a [[x,y],...]
    function jPoints2D() {
        this.originInput = arguments[0];
        this.points = [];
        this.messages = [];

        if (!this._initialized) {
            jPoints2D.prototype.preProcess = function (s) {
                return s;
            };

            jPoints2D.prototype.analyse = function () {
                var a = this.preProcess(this.originInput);
                this.messages.clear();
                
                if (a instanceof Array && a.length >= 0) {
                    for (var i = 0; i < a.length; i++) {
                        var point = new jPoint2D(a[i]);
                        this.points.push(point);
                        if (point.isValid()) {
                        } else {
                            //this.messages.push("在识别第{0}个数据点输入 {2} 时碰到错误：{1}".format(i + 1, point.messages.toString("; ", true), a[i].toString()));
                            var format = i == 0 ? "message.format.error.encountered.when.identifying.1st.data.point" :
                                i == 1 ? "message.format.error.encountered.when.identifying.2nd.data.point" :
                                i == 2 ? "message.format.error.encountered.when.identifying.3rd.data.point" : "message.format.error.encountered.when.identifying.nth.data.point";
                            this.messages.push(Globalize.localize(format).format(i + 1, point.messages.toString("; ", true), a[i].toString()));
                        }
                    }
                } else {
                    //this.messages.push("识别错误，输入的不是有效的数据点列");
                    this.messages.push(Globalize.localize("message.not.a.valid.data.point"));
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

            jPoints2D.prototype.getColumn = function (index) {
                var listAll = false;
                if (arguments.length > 1) listAll = arguments[1];
                var column = [];
                if (!listAll) {
                    for (var i = 0; i < this.points.length; i++) {
                        if (this.points[i].isValid())
                            column.push(this.points[i][index]);
                    }
                } else {
                    for (var i = 0; i < this.points.length; i++) {
                        column.push(this.points[i][index]);
                    }
                }

                return column;
            };

            this._initialized = true;
        }

        this.analyse();
    }
    window.JPoints2D = jPoints2D;
})(jQuery, Globalize);