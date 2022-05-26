//*************************************************************************
// jMatrix
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
    // 给对象添加一个clone方法
    //
    Object.prototype.clone = function() {
        var newObject = (this instanceof Array) ? [] : {};
        for (var i in this) {
            if ( i == 'clone') continue;
            if (this[i] && typeof this[i] == "object") {
                newObject[i] = this[i].clone();
            }else{
                newObject[i] = this[i];
            }
        }

        return newObject;
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

    Array.prototype.sum = function() {
        var s = 0;
        for(var i = 0; i < this.length; i++) {
            s += this[i];
        }

        return s;
    };

    Array.prototype.squareSum = function() {
        var s = 0;
        for(var i = 0; i < this.length; i++) {
            s += Math.pow(this[i], 2);
        }

        return s;
    };

    Array.prototype.average = function() {
        return this.sum() / this.length;
    };

    //
    // 偏差平方和
    //
    Array.prototype.squareSumOfErrors = function() {
        var s = 0;
        var avg = this.average();
        for(var i = 0; i < this.length; i++) {
            s += Math.pow(this[i] - avg, 2);
        }
        return s;
    };

    //
    // 样本标准差
    //
    Array.prototype.sampleStandardDeviation = function() {
        return Math.sqrt(this.squareSumOfErrors() / (this.length - 1));
    };

    //
    // 总体标准差
    //
    Array.prototype.populationStandardDeviation = function () {
        return Math.sqrt(this.squareSumOfErrors() / this.length);
    };

    Array.prototype.col = function(j) {
        var res = new Array(this[0].length);
        for(var i = 0; i < this.length; i++) {
            res[i] = this[i][j];
        }
        return res;
    };

    Array.prototype.toString = function() {
        var delimiter;
        if(arguments.length <= 0) delimiter = ",";
        else delimiter = arguments[0];

        return this.join(delimiter);
    };

    // 利用动态原型方法定义一个 jMatrix 类
    function jMatrix() {
        this.attributes = {
            version: 1.0
        };

        this.dataCenter = {
            originMatrix : [],
            extendedMatrix: [],
            inversedMatrix : []
        };

        if(arguments.length <= 0){
        }else {
            this.dataCenter.originMatrix = arguments[0].clone();
            this.dataCenter.extendedMatrix = arguments[0].clone();
            var m = this.dataCenter.extendedMatrix.length;
            var n = this.dataCenter.extendedMatrix[0].length;
            for (var i = 0; i < m; i++) {
                for(var j = m; j < 2 * n; j++) {
                    this.dataCenter.extendedMatrix[i].push(i == j % m ? 1 : 0);
                }
            }
        }

        if (!this._initialized) {
            //Define a local copy of jStats
            var jM = this;

            jMatrix.prototype.productArray = function (a) {
                function pairSum(a, b) {
                    var s = 0;
                    for(var i = 0; i < a.length; i++) {
                        s += a[i] * b[i];
                    }

                    return s;
                }

                var lhs = this.dataCenter.originMatrix.clone();
                var rhs = a.clone();

                var m = lhs.length;
                var n = lhs[0].length;

                if(rhs.length == n) {
                    var c = rhs[0].length;

                    var res = new Array(m);
                    if(c > 1) {
                        for(var i = 0; i < m; i++) {
                            res[i] = new Array(c);
                            for ( var j = 0; j < c; j++) {
                                res[i][j] = pairSum(lhs[i], rhs.col(j));
                            }
                        }
                    }else{
                        for(var i = 0; i < m; i++) {
                            res[i] = pairSum(lhs[i], rhs);
                        }
                    }

                    return res;
                }else{
                    return null;
                }
            };

            jMatrix.prototype.inverse = function() {
                var inversed = this.gaussJordan(this.dataCenter.extendedMatrix);
                this.dataCenter.inversedMatrix = this.__getRHS__(inversed);
                return new jMatrix(this.dataCenter.inversedMatrix);
            };

            jMatrix.prototype.__getRHS__ = function(extendedMatrix) {
                var m = extendedMatrix.length;
                var n = extendedMatrix[0].length;

                var rhs = [];
                for(var i = 0; i < m; i++) {
                    rhs.push([]);
                    rhs[i].push(extendedMatrix[i].slice(m, n));
                }

                return rhs;
            };

            jMatrix.prototype.__removeZeroRows__ = function (a) {
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

                    for(var i = 0; i < l; i++) {
                        b.push([]);
                        for(var j = 0; j < n; j++) {
                            b[i].push(0);
                        }
                    }

                    for(var i = 0; i < m ; i++){
                        for (var j = 0; j < w; j ++) {
                            if (zeroIndexes[j] != i) {
                                index = true;
                            }else{
                                index = false;
                                break;
                            }
                        }

                        if(index) {
                            for (var k = 0; k < n; k++){
                                b[q][k] = a[i][k];
                            }

                            q++;
                        }
                    }

                    return b;
                }else {
                    return a.clone();
                }
            };

            jMatrix.prototype.__zeroRowsIndexes__ = function (a) {
                var m = a.length;
                var n = a[0].length;
                var r = this.__getZeroRows__(a);
                var zeroRowIndexes = [];
                for(var i = 0; i < r; i++) {
                    zeroRowIndexes.push(0);
                }

                var q = 0; var zero = false;
                if ( r != 0) {
                    for (var i = 0; i < m; i++) {
                        if (a[i][0] == 0) {
                            for (var j = 0; j < n; j ++) {
                                if (a[i][j] == 0) {
                                    zero = true;
                                    zeroRowIndexes[q] = i;
                                }else {
                                    zero = false;
                                    break;
                                }
                            }

                            if (zero) q ++;
                        }
                    }
                    return zeroRowIndexes;
                } else {
                    return null;
                }
            };

            jMatrix.prototype.__getZeroRows__ = function (a) {
                var m = a.length;
                var n = a[0].length;
                var r = m; var k = 0;

                for (var i = 0; i < m; i++) {
                    for (var j = 0; j < n; j++) {   
                        if (a[i][j] != 0) {
                            k ++;
                            break;
                        }
                    }
                }

                r -= k;
                return r;
            };

            jMatrix.prototype.gaussJordan = function (a) {
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
                    for(var i = t; i < n; i++) {    
                        for(var j = k; j < m; j++) {
                            if (b[j][i] != 0) {
                                c = i;
                                break;
                            }
                        }
                        if( c == i) {
                            break;
                        }
                    }
                    // Finding the first non-zero entry in the column "c" to start iterating
                    for (var i = k; i < m; i++) {
                        if(b[i][c] != 0) {
                            r = i;
                            break;
                        }
                    }
                    // Interchanging rows(if neccessary) to get the first entry of the located
                    // column non-zero
                    if (r!=k) {
                        for(var i = 0; i < n; i++) {
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
                    for (var i = 0; i < m; i++){
                        if (i == k) {
                            continue;
                        }else {
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
                    k ++;
                }
                // Adding the removed zero rows if there were any
                var zeroRowsOfa = this.__getZeroRows__(a);
                if (zeroRowsOfa != 0) {
                    var g = b.clone();
                    for(var i = m + 1; i < zeroRowsOfa; i++) {
                        for(var j = 0; j < n; j++) {
                            g[i][j] = 0;
                        }
                    }
                    return g;
                }else {
                    return b;
                }
            };

            jMatrix.prototype.toString = function() {
                var delimiter ;

                if(arguments.length <= 0) delimiter = "\r\n";
                else delimiter = arguments[0];

                return this.dataCenter.originMatrix.toString(delimiter);
            };

            jMatrix.prototype.toArray = function () {
                return this.dataCenter.originMatrix;
            };

            this._initialized = true;
        }
    }

    jMatrix.prototype.plugin = function() {};

    window.JMatrix = jMatrix;
})();