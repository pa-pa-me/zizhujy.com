﻿//*************************************************************************
// jFunction
//
// Version: 1.1
// Copyright (c) 2012 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Function Analyzer
//
// using jQuery.js
//
(function (window) {
    window.sin = Math.sin;
    window.cos = Math.cos;
    window.tan = Math.tan;
    window.tg = Math.tan;
    window.abs = Math.abs;
    window.acos = Math.acos;
    window.arccos = Math.acos;
    window.asin = Math.asin;
    window.arcsin = Math.asin;
    window.atan = Math.atan;
    window.arctan = Math.atan;
    window.atg = Math.atan;
    window.arctg = Math.atan;
    window.atan2 = Math.atan2;
    window.arctan2 = Math.atan2;
    window.atg2 = Math.atan2;
    window.arctg2 = Math.atan2;
    window.ceil = Math.ceil;
    window.E = window.e = Math.E;
    window.exp = Math.exp;
    window.floor = Math.floor;
    //    window.LN10 = Math.LN10;
    //    window.ln10 = Math.LN10;
    //    window.LN2 = Math.LN2;
    //    window.ln2 = Math.LN2;
    window.ln = Math.log;
    window.log = Math.log = function () {
        if (arguments.length > 0) {
            var a = 10;
            var x = arguments[0];
            if (arguments.length > 1) { a = arguments[0]; x = arguments[1]; }
            return ln(x) / ln(a);
        } else {
            return NaN;
        }
    };
    //    window.LOG10E = Math.LOG10E;
    //    window.log10e = Math.LOG10E;
    //    window.LOG2E = Math.LOG2E;
    //    window.log2e = Math.LOG2E;
    window.max = Math.max;
    window.min = Math.min;
    window.PI = Math.PI;
    window.pi = Math.PI;
    Math.power = Math.pow;
    //
    // 让Math.pow(x, y)支持对x求奇次方根
    //
    Math.pow = function (x, y) {
        if (y < 1 && 1 / y % 2 == 1 && x < 0) {
            return -Math.power(-x, y);
        } else {
            return Math.power(x, y);
        }
        //        if (y < 1 && 1 / y % 2 == 1) {
        //            return (x / Math.abs(x)) * Math.power(abs(x), y);
        //        } else {
        //            return Math.power(x, y);
        //        }
    };
    window.pow = Math.pow;
    window.random = Math.random;
    window.round = Math.round;
    window.sqrt = Math.sqrt;
    //    window.SQRT1_2 = Math.SQRT1_2;
    //    window.sqrt1_2 = Math.sqrt1_2;
    //    window.SQRT2 = Math.SQRT2;
    //    window.sqrt2 = Math.SQRT2;
    window.sec = Math.sec;
})(window);

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
    // 删除所有空白字符
    //
    String.prototype.deleteWhiteSpaces = function () {
        var extraSpace = /[\s\n\r]+/g;

        return this.replace(extraSpace, "");
    };

    //
    // 给字符串对象添加一个startsWith()方法
    //
    String.prototype.startsWith = function (substring) {
        var reg = new RegExp("^" + substring);
        return reg.test(this);
    };

    //
    // 给字符串对象添加一个endsWith()方法
    //
    String.prototype.endsWith = function (substring) {
        var reg = new RegExp(substring + "$");
        return reg.test(this);
    };

    //
    // 给数组对象添加一个toHtmlString()方法
    //
    Array.prototype.toHtmlString = function() {
        var template = "<table><thead><tr>{0}</tr><thead><tbody>{1}<tbody></table>";
        var headerColTemplate = "<th>{0}</th>";
        var rowColTemplate = "<tr>{0}</tr>";

        var header = "<th>行\\列</th>";
        var rows = "";

        // make header
//        for(var i =0; i < this[0].length; i++) {
//            header += String.format(headerColTemplate, i);
//        }
        header += "<th>x</th><th>y</th>";

        // make body
        for(var i = 0; i < this.length; i ++) {
            var row = "";
            for(var j = 0; j < this[0].length; j++) {
                if(this[i] !=null)
                    row += String.format( "<td>{0}</td>", this[i][0, j]);
                else
                    row += String.format( "<td>{0}</td>", "&lt;null&gt;");
            }
            rows += String.format(rowColTemplate, String.format("<td>{0}</td>{1}", i, row));
        }

        return String.format(template, header, rows); 
    };
    
    //
    // 判断一个对象是否是有限数字
    //
    Math.isFiniteNumber = function (o) {
        if(typeof o === "number") {
            return !isNaN(o) && isFinite(o);
        } else {
            return false;
        }
    };

    // 利用动态原型方法定义一个 jExplicitFunction 类
    // arguments:
    //  expression
    //  independentVariable, default: x
    //  dependentVariable, default: y
    function jExplicitFunction() {
        this.rhs = arguments[0];
        this.independentVar = "x";
        this.dependentVar = "y";
        if (arguments.length > 1) {
            this.independentVar = arguments[1];
        }
        if (arguments.length > 2) {
            this.dependentVar = arguments[2];
        }

        this.isValid = true;

        if (!this._initialized) {
            var jEf = this;

            jExplicitFunction.prototype.generateDataPoints = function(n, start, end) {
                var step = (end-start)/n;
                var x = 0, y = 0, t = 0;
                var data = new Array();
                
                switch(this.getFunctionItemType()) {
                    case jFunctionItemType.fx:
                        for(var i = start; i<= end; i+= step) {
                            x = i;
                            try{
                                y = eval(this.rhs);
                            }catch(ex){
                                y = NaN;
                            }

                            data.push([x, y]);
                        }
                        break;
                    
                    case jFunctionItemType.fy:
                        for(var i = start; i <= end; i+= step) {
                            y = i;
                            try{
                                x = eval(this.rhs);
                            }catch(ex){
                                x = NaN;
                            }

                            data.push([x, y]);
                        }
                        break;

                    case jFunctionItemType.ft:
                        for(var i = start; i <= end; i+= step) {
                            t = i;
                            try{
                                y = eval(this.rhs);
                            }catch(ex){
                                y = NaN;
                            }

                            data.push([t, y]);
                        }
                        break;

                    default:
                        break;
                }

                return data;
            };
            
            // Arguments:
            //  n: required
            //  start: required
            //  end: required
            //  dependentMin: optional
            //  dependentMax: optional
            jExplicitFunction.prototype.generateDataPointsFast = function(n, start, end) {
                var step = (end-start)/n;
                var x = 0, y = 0, t = 0;
                var data = new Array();

                var dependentMin = Number.NEGATIVE_INFINITY;
                var dependentMax = Number.POSITIVE_INFINITY;
                var crossBorder = false;

                if(arguments.length>3 && arguments[3] != undefined) dependentMin = arguments[3];
                if(arguments.length>4 && arguments[4] != undefined) dependentMax = arguments[4];
                
                switch(this.getFunctionItemType()) {
                    case jFunctionItemType.fx:
                        for(var i = start; i<= end; i+= step) {
                            x = i;
                            y = eval(this.rhs);
                            data.push([x, y]);

                            if(y >= dependentMin && y <= dependentMax) {
                                if(crossBorder) {
                                    data.splice(data.length-2,1);
                                }
                                crossBorder = false;
                            } else {
                                crossBorder = true;
                                data.push(null);
                            }
                        }
                        break;
                    
                    case jFunctionItemType.fy:
                        for(var i = start; i <= end; i+= step) {
                            y = i;
                            x = eval(this.rhs);
                            data.push([x, y]);

                            if(x >=dependentMin && x<= dependentMax) {
                                if(crossBorder) {
                                    data.splice(data.length-2, 1);
                                }
                                crossBorder = false;
                            } else {
                                crossBorder = true;
                                data.push(null);
                            }
                        }
                        break;

                    case jFunctionItemType.ft:
                        for(var i = start; i <= end; i+= step) {
                            t = i;
                            y = eval(this.rhs);
                            data.push([t, y]);
                        }
                        break;

                    default:
                        break;
                }

                return data;
            };

            jExplicitFunction.prototype.analyse = function () {
                var source = this.processUserInput(this.rhs);
                this.rhs = source;
            };

            //
            // 处理（过滤）用户的输入
            //
            // jeff@zizhujy.com, 2012-1-28
            //
            jExplicitFunction.prototype.processUserInput = function (s) {
                // 处理 LaTex

                // 识别绝对值函数输入：
                var reAbs = /\|\s*(.+?)\s*\|/g;
                s = s.replace(reAbs, "abs($1)");

                // 识别幂函数或者指数函数输入：
                var reExp = /([a-zA-Z]+\w*|\d*\.?\d+|[a-zA-Z]*\([^;\^]+\))\^([+-]?\d*\.?\d+|[+-]?\w*\([^;\^]+\)|[+-]?[xyt])/g;
                while(reExp.test(s)){
                    s = s.replace(reExp, "pow($1,$2)");
                    reExp.lastIndex = 0;
                }
                
                // 自动添加乘号(*)
                var re = /\b(\d+)([a-zA-Z]\w*|\()/g;
                //while(re.test(s)){
                    s = s.replace(re, "$1*$2");
                //}
                re = /(\))(\d*\.?\d+|\()/g;
                s = s.replace(re, "$1*$2");

                re = /([xyt])(\d*\.?\d+)/g;
                s = s.replace(re, "$1*$2");

                // 传过来的表达式中是没有空白符号的，因此这句话起不到作用了。
//                re = /(\w+)\s+(\w+)/g;
//                s = s.replace(re, "$1*$2");

                return s;
            };

            jExplicitFunction.prototype.toString = function () {
                return String.format("{0} = {1}", this.dependentVar, this.rhs);
            };

            jExplicitFunction.prototype.getFunctionItemType = function() {
                if(this.dependentVar == "y" && this.independentVar == "x") {
                    return jFunctionItemType.fx;
                } else if(this.dependentVar == "x" && this.independentVar == "y") {
                    return jFunctionItemType.fy;
                } else if (this.independentVar == "t") {
                    return jFunctionItemType.ft;
                } else {
                    return null;
                }
            };

            this._initialized = true;
        }

        this.analyse();
    }

    window.JExplicitFunction = jExplicitFunction;

    // 利用动态原型方法定义一个 jExplicitFunctionGroup 类
    // arguments:
    //  expression1
    //  expression2
    //  independentVariable, default: t
    //  dependentVariable1, default: x
    //  dependentVariable2, default: y
    function jExplicitFunctionGroup() {
        var expression1 = arguments[0];
        var expression2 = arguments[1];
        var independentVar = "t";
        var dependentVar1 = "x";
        var dependentVar2 = "y";
        if (arguments.length > 2) {
            independentVar = arguments[2];
        }
        if (arguments.length > 3) {
            dependentVar1 = arguments[3];
        }
        if (arguments.length > 4) {
            dependentVar2 = arguments[4];
        }

        this.part1 = new jExplicitFunction(expression1, independentVar, dependentVar1);
        this.part2 = new jExplicitFunction(expression2, independentVar, dependentVar2);
        this.isValid = true;

        if (!this._initialized) {
            var jEfg = this;
            jExplicitFunctionGroup.prototype.analyse = function () {
            };

            jExplicitFunctionGroup.prototype.toString = function () {
                return String.format("{{0};{1}}", this.part1.toString(), this.part2.toString());
            };

            jExplicitFunctionGroup.prototype.getFunctionType = function() {
                return jFunctionType.functionGroup;
            };

            /// <summary>
            ///     genearte a list of data points and return as an Array() object
            /// </summary>
            /// <param name="n" type="Number">
            ///     1: number - 要产生的数据点的个数
            /// </param>
            /// <param name="start" type="Number">
            ///     1: number - 产生数据点时自变量的起始值
            /// </param>
            /// <param name="end" type="Number">
            ///     1: number - 产生数据点时自变量的结束值
            /// </param>
            /// <param name="dependentMin">
            ///     1: number - 产生数据点时因变量的最小值
            /// </param>
            /// <param name="dependentMax">
            ///     1: number - 产生数据点时因变量的最大值
            /// </param>
            /// <returns type="Array" />
            jExplicitFunctionGroup.prototype.generateDataPoints = function(n, start, end, dependentMin, dependentMax) {
                var data = new Array();

                var data1 = this.part1.generateDataPoints(n, start, end, dependentMin, dependentMax);
                var data2 = this.part2.generateDataPoints(n, start, end, dependentMin, dependentMax);

                for(var i = 0; i < data1.length; i++) {
                    data.push([data1[i][0, 1], data2[i][0, 1]]);
                }

                return data;
            };

            jExplicitFunctionGroup.prototype.generateDataPointsFast = function(n, start, end, dependentMin, dependentMax) {
                var data = new Array();

                var data1 = this.part1.generateDataPointsFast(n, start, end, dependentMin, dependentMax);
                var data2 = this.part2.generateDataPointsFast(n, start, end, dependentMin, dependentMax);

                for(var i = 0; i < data1.length; i++) {
                    data.push([data1[i][0, 1], data2[i][0, 1]]);
                }

                return data;
            };

            this._initialized = true;
        }

        this.analyse();
    }
    window.JExplicitFunctionGroup = jExplicitFunctionGroup;

    var jFunctionProperty = { explicitFunction: 0, inexplicitFunction: 1 };
    var jFunctionType = { singleFunction: "Single Function", functionGroup: "Function Group" };
    var jFunctionItemType = { fx: "y = f(x)", ft: "f(t)", fy: "x = f(y)" };

    window.JFunctionProperty = jFunctionProperty;
    window.JFunctionType = jFunctionType;
    window.JFunctionItemType = jFunctionItemType;


    // 利用动态原型方法定义一个jFunction类
    function jFunction(expression) {
        this.originalExpression = expression.toString().deleteWhiteSpaces();
        this.functionObject = null;
        this.functionProperty = jFunctionProperty.explicitFunction;
        this.functionType = jFunctionType.singleFunction;
        this.isValid = true;

        if (!this._initialized) {
            //Define a local copy of jFunction
            var jF = this;
            var regexFx = /^y=([^;]*)$/;
            var regexFy = /^x=([^;]*)$/;
            var regexFunctionGroup = /^\{?x=([^;]*);y=([^;]*)\}?$/;

            jFunction.prototype.toString = function () {
                if (this.functionObject != null) {
                    return this.functionObject.toString();
                } else {
                    return "未能识别";
                }
            };

            jFunction.prototype.getFunctionType = function() {
                if(this.functionObject != null) {
                    if(this.functionObject instanceof jExplicitFunction) {
                        return this.functionObject.getFunctionItemType();
                    } else if (this.functionObject instanceof JExplicitFunctionGroup) {
                        return this.functionObject.getFunctionType();
                    }
                }else {
                    return null;
                }
            };

            jFunction.prototype.analyse = function () {
                // 判断 functionProperty, functionType
                if (regexFx.test(this.originalExpression)) {
                    this.functionType = jFunctionType.singleFunction;

                    this.functionObject = new jExplicitFunction(RegExp.$1);
                } else if (regexFy.test(this.originalExpression)) {
                    this.functionType = jFunctionType.singleFunction;

                    this.functionObject = new jExplicitFunction(RegExp.$1, "y", "x");
                } else if (regexFunctionGroup.test(this.originalExpression)) {
                    this.functionType = jFunctionType.functionGroup;

                    this.functionObject = new jExplicitFunctionGroup(RegExp.$1, RegExp.$2);
                } else {
                    this.isValid = false;
                }
            };

            jFunction.prototype.generateDataPoints = function(n, start, end, dependentMin, dependentMax) {
                if(this.functionObject != null) {
                    return this.functionObject.generateDataPoints(n, start, end, dependentMin, dependentMax);
                }else {
                    return null;
                }
            };

            jFunction.prototype.generateDataPointsFast = function(n, start, end, dependentMin, dependentMax) {
                if(this.functionObject != null) {
                    return this.functionObject.generateDataPointsFast(n, start, end, dependentMin, dependentMax);
                }else {
                    return null;
                }
            };

            this._initialized = true;
        }

        this.analyse();
    }
    window.JFunction = jFunction;

    // 利用动态原型方法定义一个jFunctionList类
    function jFunctionList(input) {
        this.input = input;
        this.functions = new Array();
        this.messages = [];

        if (!this._initialized) {
            var jFL = this;

            jFunctionList.prototype.toHtmlString = function () {
                var template = "<table><thead><tr><th>序号</th><th>函数原始输入</th><th>有效？</th><th>识别结果</th><th>函数类型</th><th>数据点测试</th></tr><thead><tbody>{0}<tbody></table>";
                var rowTemplate = "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>";

                var rows = "";
                for (var i = 0; i < this.functions.length; i++) {
                    var dataPoints = this.functions[i].generateDataPoints(5, 0, 2*Math.PI);
                    var htmlString = dataPoints != null ? dataPoints.toHtmlString() : "";
                    rows += String.format(rowTemplate, i + 1, this.functions[i].originalExpression, this.functions[i].isValid, this.functions[i].toString(), this.functions[i].getFunctionType(), "<div><a href='javascript: $(\"#dataList" + i + "\").toggle()'>查看/关闭</a></div><div id='dataList" + i + "' style='display: none;'>" + htmlString + "</div>");
                }

                return String.format(template, rows);
            };

            jFunctionList.prototype.isValid = function() {
                for(var i = 0; i < this.functions.length; i++ ) {
                    if(!this.functions[i].isValid){
                        return false;
                    }
                }
                return true;
            };

            jFunctionList.prototype.preProcess = function(s) {
                s = s.replace("；", ";").replace("（", "(").replace("）", ")").replace("｛", "{").replace("｝", "}").replace("–", "-");
                
                // LaTex 处理
                s = s.replace(/\$/g, ";");                
                var reFrac = /\\frac\{([^\{\}]*)\}\{([^\{^\}]*)\}/g;
                while(reFrac.test(s)) {
                    s = s.replace(reFrac, "($1)/($2)");
                    reFrac.lastIndex = 0;
                }

                return s;
            };

            jFunctionList.prototype.analyse = function () {
                this.messages.splice(0, this.messages.length);
                var TokenType = { functionGroupBegin: -1, functionGroupEnd: 1, semicolon: 0, newLine: 2, carriageReturn: 3, functionBody: 4 };

                var source = this.preProcess(this.input);
                var line = "", token, i, curlyBracketOpen;

                function addCharToLine() {
                    line += token;
                }

                function addLineToList() {
                    line = line.trim();
                    if (line.length > 0) {
                        var func = new jFunction(line);
                        jFL.functions.push(func);
                        line = "";
                    }
                }

                function getChar() {
                    token = source.substring(i, i + 1);
                    i++;
                    // 有的浏览器（比如Visual Web Developer 2008 速成版中所带的浏览器）不支持对字符串的下标取值
                    // token = userInput[i++];
                }

                function getTokenType() {
                    if (token == "{") {
                        return TokenType.functionGroupBegin;
                    } else if (token == "}") {
                        return TokenType.functionGroupEnd;
                    } else if (token == ";") {
                        return TokenType.semicolon;
                    } else if (token == "\n") {
                        return TokenType.newLine;
                    } else if (token == "\r") {
                        return TokenType.carriageReturn;
                    } else {
                        return TokenType.functionBody;
                    }
                }

                line = ""; i = 0; curlyBracketOpen = false;

                // Clear all elements of functions list
                this.functions.splice(0, this.functions.length);
                // 依次读进一个字符
                while (i < source.length) {
                    getChar();
                    switch (getTokenType()) {
                        case TokenType.functionBody:
                            addCharToLine();
                            break;

                        case TokenType.functionGroupEnd:
                            if (curlyBracketOpen) {
                                // 函数组结束
                                addLineToList();
                                curlyBracketOpen = false;
                            } else {
                                // 语法错误
                                var s = i;
                                var s = String.format("在第{0}个字符处碰到语法错误，相关标记：{1}。", s, token);
                                //throw s;
                                this.messages.push(s);
                                //getChar();
                            }
                            break;

                        case TokenType.semicolon:
                            // 一个函数结束，或者函数组中的一个函数结束了
                            if (!curlyBracketOpen) {
                                addLineToList();
                            } else {
                                addCharToLine();
                            }
                            break;

                        case TokenType.functionGroupBegin:
                            curlyBracketOpen = true;
                            break;

                        default:
                            break;
                    }
                }

                if (line.toString().length > 0) {
                    addLineToList();
                }

                return this.functions;
            };

            this._initialized = true;
        }

        this.analyse();
    }
    window.JFunctionList = jFunctionList;
})(jQuery);