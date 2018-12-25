//*************************************************************************
// Matrix
//
// Version: 1.0
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Matrix Manipulation
//
//
(function () {
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
    if (Math.round2 == null) {
        // 此判断非常重要，如果Math.round2 已经在别的地方定义过了，再次这样重新定义，会导致循环引用，从而引发
        // Uncaught RangeError: Maximum call stack size exceeded 错误
        Math.round2 = Math.round;
        Math.round = function () {
            if (arguments.length >= 2) {
                n = arguments[0];
                m = arguments[1];

                var roundedNumber = Math.round2(n * Math.pow(10, m)) / Math.pow(10, m);
                return roundedNumber;
            } else if (arguments.length >= 1) {
                n = arguments[0];
                return Math.round2(n);
            } else {
                return 0;
            }
        };
    }

    Array.prototype.col = function (j) {
        var c = new Array();
        for (var i = 0; i < this.length; i++) {
            c.push(this[i][j]);
        }

        return c;
    };

    if (typeof zizhujy == "undefined") {
        zizhujy = {};
    }

    if (typeof zizhujy.com == "undefined") {
        zizhujy.com = {};
    }

    zizhujy.com.Matrix = {};

    zizhujy.com.Matrix.__extendMatrix__ = function (m) {
        if (this.isMatrix(m)) {
            var extended = m.clone();
            var rows = extended.length;
            var cols = extended[0].length;

            if (rows == cols) {
                for (var i = 0; i < rows; i++) {
                    for (var j = rows; j < 2 * cols; j++) {
                        extended[i].push(i == j % rows ? 1 : 0);
                    }
                }

                return extended;
            } else {
                return m;
            }
        } else {
            return m;
        }
    };

    zizhujy.com.Matrix.__getRHS__ = function (extendedMatrix) {
        var m = extendedMatrix.length;
        var n = extendedMatrix[0].length;

        var rhs = [];
        for (var i = 0; i < m; i++) {
            rhs.push([]);
            rhs[i].push(extendedMatrix[i].slice(m, n).toString());
        }

        return this.getMatrix(rhs.join(";"));
    };

    zizhujy.com.Matrix.__removeZeroRows__ = function (a) {
        var m = a.length;
        var n = a[0].length;
        var q = 0;
        var zeroIndexes = this.__zeroRowsIndexes__(a);
        var index = false;

        // Remove the zero rows (if any) and free up the matrix with nonzero parameters
        var w = this.__getZeroRows__(a);
        var l = m - w;
        if (w != 0) {
            var b = [];

            for (var i = 0; i < l; i++) {
                b.push([]);
                for (var j = 0; j < n; j++) {
                    b[i].push(0);
                }
            }

            for (var i = 0; i < m; i++) {
                for (var j = 0; j < w; j++) {
                    if (zeroIndexes[j] != i) {
                        index = true;
                    } else {
                        index = false;
                        break;
                    }
                }

                if (index) {
                    for (var k = 0; k < n; k++) {
                        b[q][k] = a[i][k];
                    }

                    q++;
                }
            }

            return b;
        } else {
            return a.clone();
        }
    };

    zizhujy.com.Matrix.__zeroRowsIndexes__ = function (a) {
        var m = a.length;
        var n = a[0].length;
        var r = this.__getZeroRows__(a);
        var zeroRowIndexes = [];
        for (var i = 0; i < r; i++) {
            zeroRowIndexes.push(0);
        }

        var q = 0; var zero = false;
        if (r != 0) {
            for (var i = 0; i < m; i++) {
                if (a[i][0] == 0) {
                    for (var j = 0; j < n; j++) {
                        if (a[i][j] == 0) {
                            zero = true;
                            zeroRowIndexes[q] = i;
                        } else {
                            zero = false;
                            break;
                        }
                    }

                    if (zero) q++;
                }
            }
            return zeroRowIndexes;
        } else {
            return null;
        }
    };

    zizhujy.com.Matrix.__getZeroRows__ = function (a) {
        var m = a.length;
        var n = a[0].length;
        var r = m; var k = 0;

        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (a[i][j] != 0) {
                    k++;
                    break;
                }
            }
        }

        r -= k;
        return r;
    };

    zizhujy.com.Matrix.getMatrix = function (s) {
        s = s.replace("，", ",").replace("；", ";");
        s = s.replace(/[\r\n;]+/g, ";").trim(/^[\s;]*/).trim(/[\s;]*$/);
        s = s.replace(/[\s,]+/g, ",");

        var a = s.split(";");
        for (var i = 0; i < a.length; i++) {
            a[i] = a[i].toString().trim(/^[\s,]*/).trim(/[\s,]*$/).split(",");
        }
        if (this.isMatrix(a)) {
            return a;
        } else {
            return null;
        }
    };

    zizhujy.com.Matrix.isMatrix = function (a) {
        if (a instanceof Array) {
            if (a.length >= 1) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] instanceof Array) {
                        if (a[i].length != a[0].length) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    zizhujy.com.Matrix.toString = function () {
        var a = [];
        var rowDelimiter = "\r\n";
        var colDelimiter = " ";
        var digitNo = -1;

        if (arguments.length >= 4) {
            a = arguments[0];
            digitNo = arguments[1];
            rowDelimiter = arguments[2];
            colDelimiter = arguments[3];
        } else if (arguments.length >= 3) {
            a = arguments[0];
            digitNo = arguments[1];
            rowDelimiter = arguments[2];
        } else if (arguments.length >= 2) {
            a = arguments[0];
            digitNo = arguments[1];
        } else if (arguments.length >= 1) {
            a = arguments[0];
        } else {
            return "";
        }

        if (this.isMatrix(a)) {
            if (digitNo == -1) {
                var sb = new Array();

                for (var i = 0; i < a.length; i++) {
                    sb.push(a[i].join(colDelimiter))
                }

                return sb.join(rowDelimiter);
            } else {
                var list = new Array();

                for (var i = 0; i < a.length; i++) {
                    var elements = new Array();
                    for (var j = 0; j < a[0].length; j++) {
                        elements.push(Math.round(a[i][j], digitNo));
                    }
                    list.push(elements.join(colDelimiter));
                }

                return list.join(rowDelimiter);
            }
        } else {
            return a;
        }
    };

    //
    // Inverse a *extended matrix* using Gauss Jordan methodology
    //
    // a is the extended matrix
    //
    zizhujy.com.Matrix.inverse_GaussJordan = function (a) {
        var b = this.__removeZeroRows__(a);
        var m = b.length;
        var n = b[0].length;
        var c = -1; var r = 0;

        var t = 0; var k = 0;
        var R = new Array(n);
        var K = new Array(n);

        var p = -1; var pp = -1;

        while (k < m) {
            // Finding the first non-zero column index
            for (var i = t; i < n; i++) {
                for (var j = k; j < m; j++) {
                    if (b[j][i] != 0) {
                        c = i;
                        break;
                    }
                }
                if (c == i) {
                    break;
                }
            }
            // Finding the first non-zero entry in the column "c" to start iterating
            for (var i = k; i < m; i++) {
                if (b[i][c] != 0) {
                    r = i;
                    break;
                }
            }
            // Interchanging rows(if neccessary) to get the first entry of the located
            // column non-zero
            if (r != k) {
                for (var i = 0; i < n; i++) {
                    K[i] = b[k][i];
                    R[i] = b[r][i];
                    b[k][i] = R[i];
                    b[r][i] = K[i];
                }
            }
            // Checking for the first first entry from the previous iteration if it is 1
            // if not divide the rows by the multiplicative inverse of that number
            p = b[k][c];
            if (p != 1) {
                for (var i = 0; i < n; i++) {
                    b[k][i] *= Math.pow(p, -1);
                }
            }
            // Then multiplying the first number times other non-zero entry rows to get all
            // numbers equal to 0 below the selected number 
            for (var i = 0; i < m; i++) {
                if (i == k) {
                    continue;
                } else {
                    if (b[i][c] != 0) {
                        pp = b[i][c];
                        for (var j = 0; j < n; j++) {
                            b[i][j] -= pp * b[k][j];
                        }
                    }
                }
            }
            // Adjusting the indexes for the next iteration
            t = c + 1;
            k++;
        }
        // Adding the removed zero rows if there were any
        var zeroRowsOfa = this.__getZeroRows__(a);
        if (zeroRowsOfa != 0) {
            var g = b.clone();
            for (var i = m + 1; i < zeroRowsOfa; i++) {
                for (var j = 0; j < n; j++) {
                    g[i][j] = 0;
                }
            }
            return g;
        } else {
            return b;
        }
    };

    zizhujy.com.Matrix.inverse = function (a) {
        return this.__getRHS__(this.inverse_GaussJordan(this.__extendMatrix__(a)));
    };

    zizhujy.com.Matrix.transpose = function (a) {
        if (this.isMatrix(a)) {
            var m = a.length;
            var n = a[0].length;

            var t = new Array(n);
            for (var i = 0; i < n; i++) {
                t[i] = new Array(m);
                for (var j = 0; j < m; j++) {
                    t[i][j] = a[j][i];
                }
            }

            return t;
        } else {
            return a;
        }
    };

    zizhujy.com.Matrix.add = function (a, b) {
        if (this.isMatrix(a) && this.isMatrix(b)) {
            var m = a.length;
            var n = a[0].length;
            if (m == b.length && n == b[0].length) {
                var s = new Array(m);
                for (var i = 0; i < m; i++) {
                    s[i] = new Array(n);
                    for (var j = 0; j < n; j++) {
                        s[i][j] = parseFloat(a[i][j]) + parseFloat(b[i][j]);
                    }
                }

                return s;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    zizhujy.com.Matrix.subtract = function (a, b) {
        if (this.isMatrix(a) && this.isMatrix(b)) {
            var m = a.length;
            var n = a[0].length;
            if (m == b.length && n == b[0].length) {
                var s = new Array(m);
                for (var i = 0; i < m; i++) {
                    s[i] = new Array(n);
                    for (var j = 0; j < n; j++) {
                        s[i][j] = parseFloat(a[i][j]) - parseFloat(b[i][j]);
                    }
                }

                return s;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    zizhujy.com.Matrix.multiply = function (a, b) {
        if (this.isMatrix(a) && this.isMatrix(b)) {
            if (a[0].length == b.length) {
                var rows = a.length;
                var cols = b[0].length;

                var p = new Array(rows);
                for (var i = 0; i < rows; i++) {
                    p[i] = new Array(cols);
                    for (var j = 0; j < cols; j++) {
                        p[i][j] = this.sumProduction(a[i], b.col(j));
                    }
                }

                return p;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    zizhujy.com.Matrix.sumProduction = function (a, b) {
        if ((a instanceof Array) && (b instanceof Array)) {
            if (a.length == b.length) {
                var s = 0;
                for (var i = 0; i < a.length; i++) {
                    s += parseFloat(a[i]) * parseFloat(b[i]);
                }

                return s;
            } else {
                return NaN;
            }
        } else {
            return NaN;
        }
    };

    window.Matrix = zizhujy.com.Matrix;

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
})();