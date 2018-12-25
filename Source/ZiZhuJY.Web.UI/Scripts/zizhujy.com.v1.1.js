//*************************************************************************
// Matrix
//
// Version: 1.1
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Matrix Manipulation
//
//
; (function () {
    if (typeof zizhujy == "undefined") {
        zizhujy = {};

        window.zizhujy = zizhujy;
    }

    if (typeof zizhujy.com == "undefined") {
        zizhujy.com = {
            //
            // let object refer to value
            // Usage: object = zizhujy.com.set(object, value);
            //
            set: function (object, value) {
                if (object == null) {
                    object = value;
                } else {
                    if (object instanceof Array) {
                        object.push(value);
                    } else {
                        var o = object;
                        object = [];
                        object.push(o);
                        object.push(value);
                    }
                }

                return object;
            },

            //
            // Usage: deserializeUrlParams("a=2&b=3") --> {a:2, b:3}
            //          deserializeUrlParams("a=2&a=3&a=4") --> {a: [2, 3, 4]}
            //          deserializeUrlParams() <==> deserializeUrlParams(window.location.search.substring(1))
            //
            deserializeUrlParams: function () {
                var urlParams = null;
                var expression;
                // Regex for replacing addition symbol with a space
                var a = /\+/g;
                var reg = /([^&=]+)=?([^&]*)/g;
                var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };

                var q = "";
                if (arguments.length > 0) q = arguments[0];
                else q = window.location.search.substring(1);

                while (expression = reg.exec(q)) {
                    if (urlParams == null) urlParams = {};
                    urlParams[d(expression[1])] = this.set(urlParams[d(expression[1])], d(expression[2]));
                }

                return urlParams;
            },

            /// <summary>
            ///     序列化一个对象（递归地）
            /// </summary>
            /// <param name="o">要被序列化的对象</param>
            /// <param name="level">当前正在被序列化的对象在序列化树中的层级（根级为0）</param>
            /// <param name="varName">当前正在被序列化的对象的变量名</param>
            /// <remark>
            ///     该方法有四个重载：
            ///     1. serializeObject(o);
            ///     2. serializeObject(o, level);
            ///     3. serializeObject(o, varName);
            ///     4. serializeObject(o, level, varName);
            /// </remark>
            serializeObject: function(){            
                // 参数列表：
                var o = arguments[0];
                var level = 0;          
                var varName = "";     

                // 重载机制:
                switch(typeof arguments[1]){
                    case "number":
                        // 重载 2： serializeObject(o, level);
                        level = arguments[1];
                        if(arguments.length > 2) {
                            // 重载 4： serializeObject(o, level, varName);
                            varName = arguments[2];
                        }
                        break;
                    case "string":
                        // 重载 3： serializeObject(o, varName);
                        varName = arguments[1];
                        break;
                    default:
                        // 重载 1： serializeObject(o);
                        break;
                }

                var sb = new StringBuffer();
                // 根对象信息：
                sb.appendLine("{0}{1}<{2}>: [{3}]".format(level > 0 ? " ".duplicate(level*2) + "|-" : "", varName, typeof o, o === null ? "null" : o === undefined ? "undefined" : o.toString()));
                // 子对象信息：
                switch(typeof o) {
                    case "object":
                        for(var i in o){
                            //sb.appendLine("{0}{1}<{2}>: [{3}]".format(" ".duplicate((level+1)*2), i, typeof o[i], o[i] === null ? "null" : o[i] === undefined ? "undefined" : o[i].toString()));
                            sb.append(this.serializeObject(o[i], level + 1, i));
                        } // end for
                        break;
                    case "undefined":
                        break;
                    default:
                        // 根对象的prototype信息：
                        switch(typeof o.prototype){
                            case "undefined":
                                break;
                            default:
                                sb.append(this.serializeObject(o.prototype, level + 1, "prototype"));
                                break;
                        } // end switch (typeof o.prototype)
                        break;
                } // end switch (typeof o)
                return sb.toString();
            }
        };

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
        window.StringBuffer = StringBuffer;

        // arguments:
        //  cumstomRegExps: a RegExp or an Array of RegExp
        //  more regexps...
        String.prototype.trim = function () {
            // basic trim
            if (arguments.length <= 0) {
                return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            } else {
                var string = this;
                if (arguments.length == 1) {
                    if (arguments[0] instanceof RegExp || typeof arguments[0] == "string") {
                        string = string.replace(arguments[0], "");
                    } else if (arguments[0] instanceof Array) {
                        var args = arguments[0];
                        for (var i = 0; i < args.length; i++) {
                            if (args[i] instanceof RegExp || typeof args[i] == "string") {
                                string = string.replace(args[i], "");
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] instanceof RegExp || typeof arguments[i] == "string") {
                            string = string.replace(arguments[i], "");
                        }
                    }
                }
                return string;
            }
        };

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

        /// <summary>
        ///     复制字符串为原来的n倍
        /// </summary>
        String.duplicate = function (s, n) {
            var sb = new StringBuffer();
            for (var i = 0; i < n; i++) {
                sb.append(s);
            }
            return sb.toString();
        };

        String.prototype.format = function () {
            //        return String.format.apply(arguments);
            var string = this;
            for (var i = 0; i < arguments.length; i++) {
                string = string.replace("{" + i + "}", arguments[i]);
            }

            return string;
        };

        /// <summary>
        ///     复制字符串为原来的n倍
        /// </summary>
        String.prototype.duplicate = function (n) {
            var sb = new StringBuffer();
            for (var i = 0; i < n; i++) {
                sb.append(this);
            }

            return sb.toString();
        };

        //
        // 给数组对象添加一个clone方法
        //
        Array.prototype.clone = function () {
            var newObject = (this instanceof Array) ? [] : {};
            for (var i in this) {
                if (i == 'clone') continue;
                if (this[i] && typeof this[i] == "object") {
                    newObject[i] = this[i].clone();
                } else {
                    newObject[i] = this[i];
                }
            }

            return newObject;
        };

        //
        // 取数组的第 j 列
        //
        Array.prototype.col = function (j) {
            var c = new Array();
            for (var i = 0; i < this.length; i++) {
                c.push(this[i][j]);
            }

            return c;
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

        // arguments:
        //      delimiter: optional
        //      bulletFormat: optional
        Array.prototype.toString = function () {
            var delimiter = ",";
            if (arguments.length > 0) delimiter = arguments[0];

            if (arguments.length > 1) {
                var bulletFormat = arguments[1];
                //if (bulletFormat instanceof Boolean) {
                if (typeof bulletFormat == "boolean") {
                    if (bulletFormat === true) bulletFormat = "{0}: {1}";
                    else return this.join(delimiter);
                }
                for (var i = 0; i < this.length; i++) {
                    this[i] = String.format(bulletFormat, i + 1, this[i]);
                }
            }

            return this.join(delimiter);
        };

        /// <summary>
        ///     给数组对象添加一个toHtmlString()方法
        /// </summary>
        /// <param name="rowLabel" type="String">
        ///     可选。标识行的说明性文字，默认是“行”
        /// </param>
        /// <param name="colLabel" type="String">
        ///     可选。标识列的说明性文字，默认是“列”
        /// </param>
        /// <returns type="String" />
        Array.prototype.toHtmlString = function () {
            var template = "<table><thead><tr>{0}</tr><thead><tbody>{1}<tbody></table>";
            var headerColTemplate = "<th>{0}</th>";
            var rowColTemplate = "<tr>{0}</tr>";

            var rowLabel = "行";
            if (arguments.length > 0) rowLabel = arguments[0];
            var colLabel = "列";
            if (arguments.length > 1) colLabel = arguments[1];
            var header = String.format("<th>{0}\\{1}</th>", rowLabel, colLabel);
            var rows = "";

            // make header
            //        for(var i =0; i < this[0].length; i++) {
            //            header += String.format(headerColTemplate, i);
            //        }
            header += "<th>x</th><th>y</th>";

            // make body
            for (var i = 0; i < this.length; i++) {
                var row = "";
                for (var j = 0; j < this[0].length; j++) {
                    if (this[i] != null)
                        row += String.format("<td>{0}</td>", this[i][0, j]);
                    else
                        row += String.format("<td>{0}</td>", "&lt;null&gt;");
                }
                rows += String.format(rowColTemplate, String.format("<td>{0}</td>{1}", i, row));
            }

            return String.format(template, header, rows);
        };

        // 清除所有数组元素
        Array.prototype.clear = function () {
            this.splice(0, this.length);
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

        if (Math.round2 == null) {
            // 此判断非常重要，如果Math.round2 已经在别的地方定义过了，再次这样重新定义，会导致循环引用，从而引发
            // Uncaught RangeError: Maximum call stack size exceeded 错误
            Math.round2 = Math.round;
            //
            // argument:
            //          n:  optional, 要被round的数字
            //          m:  optional, 要保留的小数位数
            //
            Math.round = function () {
                if (arguments.length >= 2) {
                    n = arguments[0];
                    m = arguments[1];

                    var roundedNumber = Math.round2(n * Math.pow(10, m)) / Math.pow(10, m);
                    return roundedNumber;
                } else if (arguments.length >= 1) {
                    n = arguments[0];
                    var roundedNumber = Math.round2(n);
                    return roundedNumber;
                } else {
                    return 0;
                }
            };
        }

        //
        // 求自然对数
        //  参数可以是一个数字，或者一个数组
        //
        Math.ln = function (a) {
            if (typeof a === "number")
                return Math.log(a);
            else if (a instanceof Array) {
                var result = [];
                for (var i = 0; i < a.length; i++) {
                    result.push(Math.log(a[i]));
                }

                return result;
            }
        };

        /// <summary>
        /// 求 sec(x)
        /// </summary>
        /// <param name="x">自变量</param>
        /// <returns>因变量 y</returns>
        Math.sec = function (x) {
            return 1 / Math.cos(x);
        };
    }
})();