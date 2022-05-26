//*************************************************************************
// Console
//
// Version: 1.0
// Copyright (c) 2012 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Console
//
// Using: jQuery; zizhujy
//
; (function (window, $, zizhujy) {
    if (typeof zizhujy.com == "undefined") {
        zizhujy.com = {};
    }

    if (!window.console) {
        // 利用动态原型方法定义一个 console 类
        function console() {
            this.consoleObject = null;
            this.environment = {
                newLine: "<br />",
                logMode: "html"
            };

            if (arguments.length <= 0) {
            } else if (arguments.length <= 1) {
                switch (typeof (arguments[0])) {
                    case "string":
                        this.consoleObject = $(arguments[0]);
                        break;
                    case "object":
                        this.consoleObject = $(arguments[0]);
                        break;
                    default:
                        break;
                }
            } else {
                this.environment.newLine = arguments[1];
            }

            if (!this._initialized) {
                //Define a local copy of console
                var c = this;

                console.prototype.write = function (message) {
                    if(this.consoleObject){
                        var text = this.consoleObject[this.environment.logMode]();
                        text += message;
                        this.consoleObject[this.environment.logMode](text);
                    }else{
                        alert(message);
                    }
                };

                console.prototype.writeLine = function (message) {
                    if (arguments.length <= 0) {
                        this.write(this.environment.newLine);
                    } else {
                        this.write(message + this.environment.newLine);
                    }
                };

                console.prototype.error = function (ex) {
                    if (typeof (ex) == "string") {
                        this.writeLine(String.format("<div style=\"color: red;\">Error encountered.{1}message: {2}</div>", this.environment.newLine, ex));
                    } else {
                        this.writeLine(String.format("<div style=\"color: red;\">Error '{0}' encountered.{1}number: {2}{1}message: {3}{1}description: {4}</div>",
                        ex.name, this.environment.newLine, ex.number, ex.message, ex.description));
                    }
                };

                console.prototype.info = function (message) {
                    this.writeLine(message);
                };

                console.prototype.log = function (message, obj){
                    this.writeLine(message);
                    this.writeLine(!!obj ? obj.toString() ? obj.toString() : obj : "");
                };

                this._initialized = true;
            }
        }
        // console is a function
        zizhujy.com.console = console;
        // Console is an object
        zizhujy.com.Console = new console();
    } else {
        zizhujy.com.Console = window.console;
    }

})(window, jQuery, zizhujy);