//*************************************************************************
// zizhujy.com.js
//
// Version: 1.2
// Copyright (c) 2011 - 2014 {Jeff.Tian@outlook.com} {http://zizhujy.com}
// http://www.zizhujy.com
//
; (function () {
    if (typeof zizhujy == "undefined") {
        zizhujy = {};

        window.zizhujy = zizhujy;
    }

    if (typeof zizhujy.com == "undefined") {
        var rootWebSitePath = undefined;

        function getCurrentScriptUrl() {
            var scripts = document.getElementsByTagName("script");
            var index = scripts.length - 1;
            var myScript = scripts[index];

            return myScript.src;
        }

        function getRootWebSitePath() {
            if (typeof rootWebSitePath === "undefined") {
                var myUrl = getCurrentScriptUrl();
                var myRelativeUrlFromRoot = "/Scripts/zizhujy.com.js";

                rootWebSitePath = myUrl.substr(0, myUrl.indexOf(myRelativeUrlFromRoot));
            }

            return rootWebSitePath;
        }

        zizhujy.com = {
            rootWebSitePath: getRootWebSitePath(),
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

            /// <summar>
            ///     序列化一个对象（递归地），返回一个HTML字符串
            /// </summar>
            /// <param name="o">要被序列化的对象</param>
            /// <param name="level">当前正在被序列化的对象在序列化树中的层级（根级为0）</param>
            /// <param name="varName">当前正在被序列化的对象的变量名</param>
            /// <param name="iterateFunctionMemebers">boolean, 是否要遍历Function成员</param>
            /// <remark>
            ///     该方法有八个重载：
            ///     1. serializeObject(o);
            ///     2. serializeObject(o, iterateFunctionMembers);
            ///     3. serializeObject(o, level);
            ///     4. serializeObject(o, level, iterateFunctionMembers);
            ///     5. serializeObject(o, varName);
            ///     6. serializeObject(o, varName, iterateFunctionMembers);
            ///     7. serializeObject(o, level, varName);
            ///     8. serializeObject(o, level, varName, iterateFunctionMembers);
            /// </remark>
            serializeObjectToHTML: function () {
                function htmlSafeString(s) {
                    var encodingMapping = {
                        "<": "&lt;",
                        ">": "&gt;"
                    };

                    return s.replace(/(\b|^)((?:\\\\)*)([<>])/g, function (match, $1, $2, $3) {
                        return $1 + $2 + encodingMapping[$3];
                    });
                }

                // 参数列表：
                var o = arguments[0];
                var level = 0;
                var varName = "";
                var iterateFunctionMembers = true;

                // 重载机制:
                switch (typeof arguments[1]) {
                    case "number":
                        // 重载 3： serializeObject(o, level);
                        level = arguments[1];
                        switch (typeof arguments[2]) {
                            case "string":
                                // 重载 7： serializeObject(o, level, varName);
                                varName = arguments[2];
                                switch (typeof arguments[3]) {
                                    case "boolean":
                                        // 重载 8： serializeObject(o, level, varName, iterateFunctionMembers)
                                        iterateFunctionMembers = arguments[3];
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "boolean":
                                // 重载 4： serializeObject(o, level, iterateFunctionMembers);
                                iterateFunctionMembers = arguments[2];
                                break;
                            default:
                                break;
                        }
                        break;
                    case "string":
                        // 重载 5： serializeObject(o, varName);
                        varName = arguments[1];
                        switch (typeof arguments[2]) {
                            case "boolean":
                                // 重载 6： serializeObject(o, varName, iterateFunctionMembers);
                                iterateFunctionMembers = arguments[2];
                                break;
                            default:
                                break;
                        }
                        break;
                    case "boolean":
                        // 重载 2： serializeObject(o, iterateFunctionMembers)
                        iterateFunctionMembers = arguments[1];
                        break;
                    default:
                        // 重载 1： serializeObject(o);
                        break;
                }

                var root = "";
                // 根对象信息：
                switch (typeof o) {
                    case "function":
                        if (iterateFunctionMembers) {
                            root = ("{0}&lt;{1}&gt;: [{2}]".format(varName, typeof o, o === null ? "null" : o === undefined ? "undefined" : htmlSafeString(o.toString())));
                        }
                        break;
                    default:
                        root = ("{0}&lt;{1}&gt;: [{2}]".format(varName, typeof o, o === null ? "null" : o === undefined ? "undefined" : htmlSafeString(o.toString())));
                        break;
                }

                // 子对象信息：
                var sbSub = new StringBuffer();
                switch (typeof o) {
                    case "object":
                        for (var i in o) {
                            var s = this.serializeObjectToHTML(o[i], level + 1, i, iterateFunctionMembers);
                            if (s.length > 0) sbSub.append("<li>{0}</li>".format(s));
                        } // end for
                        break;
                    case "undefined":
                        break;
                    case "function":
                        if (iterateFunctionMembers) {
                            // 根对象的prototype信息：
                            switch (typeof o.prototype) {
                                case "undefined":
                                    break;
                                default:
                                    var s = this.serializeObjectToHTML(o.prototype, level + 1, "prototype", iterateFunctionMembers);
                                    if (s.length > 0) sbSub.append("<li>{0}</li>".format(s));
                                    break;
                            } // end switch (typeof o.prototype)
                        }
                        break;
                    default:
                        // 根对象的prototype信息：
                        switch (typeof o.prototype) {
                            case "undefined":
                                break;
                            default:
                                var s = this.serializeObjectToHTML(o.prototype, level + 1, "prototype", iterateFunctionMembers);
                                if (s.length > 0) sbSub.append("<li>{0}</li>".format(s));
                                break;
                        } // end switch (typeof o.prototype)
                        break;
                } // end switch (typeof o)
                if (sbSub.toString().length > 0) {
                    root = "<span class=\"nonleaf\">{1}</span><ul class=\"tree-node\">{0}</ul>".format(sbSub.toString(), root);
                }
                if (level == 0) root = "<ul class=\"tree-node\"><li>{0}</li></ul>".format(root);

                return root;
            },

            /// <summary>
            ///     序列化一个对象（递归地）
            /// </summary>
            /// <param name="o">要被序列化的对象</param>
            /// <param name="level">当前正在被序列化的对象在序列化树中的层级（根级为0）</param>
            /// <param name="varName">当前正在被序列化的对象的变量名</param>
            /// <param name="iterateFunctionMemebers">boolean, 是否要遍历Function成员</param>
            /// <remark>
            ///     该方法有八个重载：
            ///     1. serializeObject(o);
            ///     2. serializeObject(o, iterateFunctionMembers);
            ///     3. serializeObject(o, level);
            ///     4. serializeObject(o, level, iterateFunctionMembers);
            ///     5. serializeObject(o, varName);
            ///     6. serializeObject(o, varName, iterateFunctionMembers);
            ///     7. serializeObject(o, level, varName);
            ///     8. serializeObject(o, level, varName, iterateFunctionMembers);
            /// </remark>
            serializeObject: function () {
                // 参数列表：
                var o = arguments[0];
                var level = 0;
                var varName = "";
                var iterateFunctionMembers = true;

                // 重载机制:
                switch (typeof arguments[1]) {
                    case "number":
                        // 重载 3： serializeObject(o, level);
                        level = arguments[1];
                        switch (typeof arguments[2]) {
                            case "string":
                                // 重载 7： serializeObject(o, level, varName);
                                varName = arguments[2];
                                switch (typeof arguments[3]) {
                                    case "boolean":
                                        // 重载 8： serializeObject(o, level, varName, iterateFunctionMembers)
                                        iterateFunctionMembers = arguments[3];
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "boolean":
                                // 重载 4： serializeObject(o, level, iterateFunctionMembers);
                                iterateFunctionMembers = arguments[2];
                                break;
                            default:
                                break;
                        }
                        break;
                    case "string":
                        // 重载 5： serializeObject(o, varName);
                        varName = arguments[1];
                        switch (typeof arguments[2]) {
                            case "boolean":
                                // 重载 6： serializeObject(o, varName, iterateFunctionMembers);
                                iterateFunctionMembers = arguments[2];
                                break;
                            default:
                                break;
                        }
                        break;
                    case "boolean":
                        // 重载 2： serializeObject(o, iterateFunctionMembers)
                        iterateFunctionMembers = arguments[1];
                        break;
                    default:
                        // 重载 1： serializeObject(o);
                        break;
                }

                var sb = new StringBuffer();
                // 根对象信息：
                switch (typeof o) {
                    case "function":
                        if (iterateFunctionMembers) {
                            sb.appendLine("{0}{1}<{2}>: [{3}]".format(level > 0 ? " ".duplicate(level * 2) + "|-" : "", varName, typeof o, o === null ? "null" : o === undefined ? "undefined" : o.toString()));
                        }
                        break;
                    default:
                        sb.appendLine("{0}{1}<{2}>: [{3}]".format(level > 0 ? " ".duplicate(level * 2) + "|-" : "", varName, typeof o, o === null ? "null" : o === undefined ? "undefined" : o.toString()));
                        break;
                }

                // 子对象信息：
                switch (typeof o) {
                    case "object":
                        for (var i in o) {
                            //sb.appendLine("{0}{1}<{2}>: [{3}]".format(" ".duplicate((level+1)*2), i, typeof o[i], o[i] === null ? "null" : o[i] === undefined ? "undefined" : o[i].toString()));
                            sb.append(this.serializeObject(o[i], level + 1, i, iterateFunctionMembers));
                        } // end for
                        break;
                    case "undefined":
                        break;
                    case "function":
                        if (iterateFunctionMembers) {
                            // 根对象的prototype信息：
                            switch (typeof o.prototype) {
                                case "undefined":
                                    break;
                                default:
                                    sb.append(this.serializeObject(o.prototype, level + 1, "prototype", iterateFunctionMembers));
                                    break;
                            } // end switch (typeof o.prototype)
                        }
                        break;
                    default:
                        // 根对象的prototype信息：
                        switch (typeof o.prototype) {
                            case "undefined":
                                break;
                            default:
                                sb.append(this.serializeObject(o.prototype, level + 1, "prototype", iterateFunctionMembers));
                                break;
                        } // end switch (typeof o.prototype)
                        break;
                } // end switch (typeof o)
                return sb.toString();
            },

            /// <summary>
            ///     动态调用函数
            /// </summary>
            /// <param name="contextObject" type="object">可选</param>
            /// <param name="func" type="function">可选</param>
            /// <param name="arg" type="param">可选</param>
            /// <remark>
            ///     重载1：invoke();
            ///     重载2：invoke(window);
            ///     重载3：invoke(function(arg){}, "hello");
            ///     重载4：invoke(window, function(arg1, arg2) {}, "hello", "world");
            /// </remark>
            invoke: function () {
                var args = Array.prototype.slice.call(arguments);
                var func = function () { };
                var obj = window;
                switch (typeof arguments[0]) {
                    case "function":
                        func = arguments[0];
                        args.splice(0, 1);
                        break;
                    case "object":
                        obj = arguments[0];
                        args.splice(0, 1);
                        switch (typeof arguments[1]) {
                            case "function":
                                func = arguments[1];
                                args.splice(0, 1);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }

                func.apply(obj, args);
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

                StringBuffer.prototype.reset = function (s) {
                    this.__strings__.clear();
                    this.__strings__.push(s);
                };

                /// <summary>
                ///     将缓冲区的所有行连接成为一个整的字符串
                /// </summary>
                /// <param name="delimiter" type="String">可选，连接字符串时，用来分隔每行的分隔符。</param>
                /// <param name="preJoin" type="Function">可选，在连接字符串前，用来处理每行的函数。</param>
                /// <remark>
                ///     该方法有四个重载：
                ///         1. toString();
                ///         2. toString(delimiter);
                ///         3. toString(preJoin);
                ///         4. toString(preJoin, delimiter);
                /// </remark>
                StringBuffer.prototype.toString = function () {
                    var preJoin = null;
                    var delimiter = "";
                    if (arguments.length <= 0)
                        // 重载1：toString()
                        return this.__strings__.join("");
                    else switch (typeof arguments[0]) {
                        case "string":
                            // 重载2：toString(delimiter)
                            return this.__strings__.join(arguments[0]);
                            break;
                        case "function":
                            preJoin = arguments[0];
                            if (!!preJoin) {
                                for (var i = 0; i < this.__strings__.length; i++) {
                                    this.__strings__[i] = preJoin(this.__strings__[i]);
                                }
                            }
                            if (arguments.length > 1) {
                                // 重载4：toString(preJoin, delimiter)
                                delimiter = arguments[1];
                            }
                            // 重载3：toString(preJoin)
                            return this.__strings__.join(delimiter);
                            break;
                        default:
                            // 重载1： toString()
                            return this.__strings__.join("");
                            break;
                    } // end of switch
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
                var format = arguments[0];
                var args = arguments;

                var s = format.replace(/(?:[^{]|^|\b|)(?:{{)*(?:{(\d+)}){1}(?:}})*(?=[^}]|$|\b)/g, function (match, number) {
                    number = parseInt(number);

                    return typeof args[number + 1] != "undefined" ? match.replace(/{\d+}/g, args[number + 1]) : match;
                });

                return s.replace(/{{/g, "{").replace(/}}/g, "}");
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
            if (arguments.length <= 0) {
                return this;
            } else {
                var format = this;
                var args = arguments;

                var s = format.replace(/(?:[^{]|^|\b|)(?:{{)*(?:{(\d+)}){1}(?:}})*(?=[^}]|$|\b)/g, function (match, number) {
                    number = parseInt(number);

                    return typeof args[number] != "undefined" ? match.replace(/{\d+}/g, args[number]) : match;
                });

                return s.replace(/{{/g, "{").replace(/}}/g, "}");
            }
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
        // 删除所有空白字符
        //
        String.prototype.deleteWhiteSpaces = function () {
            var extraSpace = /[\s\n\r]+/g;

            return this.replace(extraSpace, "");
        };

        //
        // 给字符串对象添加一个startsWith()方法
        //
        String.prototype.startsWith = function (substring, caseSensative) {
            substring = substring.replace(/\(/, "\\(").replace(/\)/, "\\)");
            var options = !caseSensative ? "i" : "";
            var reg = new RegExp("^" + substring, options);
            // the following statement has no effect on some browsers. so we must pass the options
            // in the constructor!
            reg.ignoreCase = !caseSensative;
            return reg.test(this);
        };

        //
        // 给字符串对象添加一个endsWith()方法
        //
        String.prototype.endsWith = function (substring, caseSensative) {
            substring = substring.replace(/\(/, "\\(").replace(/\)/, "\\)");
            var options = !caseSensative ? "i" : "";
            var reg = new RegExp(substring + "$", options);
            // the following statement has no effect on some browsers. so we must pass the options
            // in the constructor!
            reg.ignoreCase = !caseSensative;
            return reg.test(this);
        };

        String.prototype.htmlEncode = function () {
            return this.replace(/<br ?\/?>/g, "\r\n")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace(" ", "&nbsp;");
        };

        String.prototype.htmlDecode = function () {
            return this.replace("&lt;", "<").replace("&gt;", ">").replace(/\r\n/g, "<br />")
                .replace(/\r/g, "<br />").replace(/\n/g, "<br />").replace("&nbsp;", " ");
        };

        String.prototype.toDec = function () {
            var sb = new StringBuffer();
            for (var i = 0; i < this.length; i++) {
                sb.append("{0}".format(this.charCodeAt(i)));
            }
            return sb.toString(" ");
        };

        if (!String.prototype.replaceAll) {
            function escapeRegExp(s) {
                return s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }

            String.prototype.replaceAll = function (find, replace) {
                return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
            };
        }

        if (!Array.prototype.upsert) {
            Array.prototype.upsert = function (element, comparer) {
                var length = this.length;
                var updated = false;
                for (var i = length - 1; i >= 0; i--) {
                    if (comparer(this[i])) {
                        this[i] = element;
                        updated = true;
                    }
                }

                if (!updated) {
                    this.push(element);
                }

                return this;
            };

        }

        if (!Array.prototype.indexOf) {
            // IE 8 and below don't support array.indexOf(item, start), so we implement it
            Array.prototype.indexOf = function (item, start) {
                var index = -1;

                start = +start || 0;

                if (Math.abs(start) === Infinity) {
                    start = 0;
                }

                if (start < 0) {
                    start += this.length;
                    if (start < 0) {
                        start = 0;
                    }
                }

                for (var i = start; i < this.length; i++) {
                    if (this[i] === item) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        var indexOf = Array.prototype.indexOf;
        Array.prototype.indexOf = function (item, start, equalityComparer) {
            if (typeof start === "function") {
                equalityComparer = start;
                start = 0;
            } else if (typeof equalityComparer !== "function") {
                return indexOf.call(this, item, start);
            }

            var index = -1;

            start = +start || 0;

            if (Math.abs(start) === Infinity) {
                start = 0;
            }

            if (start < 0) {
                start += this.length;
                if (start < 0) {
                    start = 0;
                }
            }

            for (var i = start; i < this.length; i++) {
                if (equalityComparer(this[i], item)) {
                    index = i;
                    break;
                }
            }

            return index;
        };

        if (!Array.prototype.map) {
            Array.prototype.map = function (fun /*, thisArg */) {
                var originalArray = Object(this);
                var len = originalArray.length >>> 0;
                if (typeof fun !== "function")
                    throw new TypeError(fun + " is not a function");

                var res = new Array(len);
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    // NOTE: Absolute correctness would demand Object.defineProperty
                    //       be used.  But this method is fairly new, and failure is
                    //       possible only if Object.prototype or Array.prototype
                    //       has a property |i| (very unlikely), so use a less-correct
                    //       but more portable alternative.
                    if (i in originalArray) {
                        res[i] = fun.call(thisArg, originalArray[i], i, originalArray);
                    }
                }

                return res;
            };
        }

        if (!Array.prototype.filter) {
            Array.prototype.filter = function (fun /*, thisArg */) {
                var t = Object(this);
                var len = t.length >>> 0;
                if (typeof fun != "function")
                    throw new TypeError();

                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];

                        // NOTE: Technically this should Object.defineProperty at
                        //       the next index, as push can be affected by
                        //       properties on Object.prototype and Array.prototype.
                        //       But that method's new, and collisions should be
                        //       rare, so use the more-compatible alternative.
                        if (fun.call(thisArg, val, i, t))
                            res.push(val);
                    }
                }

                return res;
            };
        }

        if (!Array.prototype.intersect) {
            Array.prototype.intersect = function (array2, equalityComparer) {
                return this.filter(function (item) {
                    return array2.indexOf(item, 0, equalityComparer) >= 0;
                });
            };
        }

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

        /// <summary>
        ///     Swap two columns of the array
        /// </summary>
        Array.prototype.swapCols = function (i, j) {
            for (var k = 0; k < this.length; k++) {
                if (!!this[k] && this[k] instanceof Array) {
                    var temp = this[k][i];
                    this[k][i] = this[k][j];
                    this[k][j] = temp;
                }
            }

            return this;
        };

        /// <summary>
        ///     check if an element exists in array using a comparer function
        /// </summary>
        /// <param name="comparer">comparer: function (currentElement)</param>
        Array.prototype.inArray = function (comparer) {
            for (var i = 0; i < this.length; i++) {
                if (comparer(this[i])) return true;
            }

            return false;
        };

        /// <summary>
        ///     Adds an element to the array if it does not already 
        ///     exist using a comparer function
        /// </summary>
        Array.prototype.pushUnique = function (element, comparer) {
            if (!this.inArray(comparer)) {
                this.push(element);
            }
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

        Array.prototype.contains = function (element) {
            return this.indexOf(element) >= 0;
        };

        Array.prototype.equals = function (a) {
            if (this === a) return true;
            if (a == null) return false;
            if (this.length != a.length) return false;

            for (var i = 0; i < this.length; i++) {
                if (this[i] !== a[i]) return false;
            }

            return true;
        };

        Array.prototype.remove = function (element, comparer) {
            if (!comparer && typeof element === "function") {
                comparer = element;
                var length = this.length;
                for (var i = length - 1; i >= 0; i--) {
                    if (comparer(this[i])) {
                        this.splice(i, 1);
                    }
                }

                //if (length === this.length) {
                //    debugger;
                //    throw "No element in this array [" + this.join(", ") + "] satisfies the condition.";
                //}
            } else {
                var index = this.indexOf(element, comparer);
                if (index >= 0) {
                    this.splice(index, 1);
                }
            }
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

        Math.sumProduct = function (arr1, arr2) {
            if (arr1 instanceof Array && arr2 instanceof Array) {
                var sum = 0;
                for (var i = 0; i < arr1.length; i++) {
                    sum += arr1[i] * arr2[i];
                }
                return sum;
            } else {
                return arr1 * arr2;
            }
        };
    }
})();