//*************************************************************************
// jStats
//
// Version: 1.0
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: Stats
//
// Using: Matrix.js
//
(function (Matrix) {
    //
    // 给数组对象添加一个 min() 方法
    //
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

    Array.prototype.sum = function () {
        var s = 0;
        for (var i = 0; i < this.length; i++) {
            s += this[i];
        }

        return s;
    };

    Array.prototype.squareSum = function () {
        var s = 0;
        for (var i = 0; i < this.length; i++) {
            s += Math.pow(this[i], 2);
        }

        return s;
    };

    Array.prototype.powerSum = function (n) {
        var s = 0;
        for (var i = 0; i < this.length; i++) {
            s += Math.pow(this[i], n);
        }

        return s;
    };

    Array.prototype.average = function () {
        return this.sum() / this.length;
    };

    //
    // 偏差平方和
    //
    Array.prototype.squareSumOfErrors = function () {
        var s = 0;
        var avg = this.average();
        for (var i = 0; i < this.length; i++) {
            s += Math.pow(this[i] - avg, 2);
        }
        return s;
    };

    //
    // 样本标准差
    //
    Array.prototype.sampleStandardDeviation = function () {
        return Math.sqrt(this.squareSumOfErrors() / (this.length - 1));
    };

    //
    // 总体标准差
    //
    Array.prototype.populationStandardDeviation = function () {
        return Math.sqrt(this.squareSumOfErrors() / this.length);
    };

    Array.prototype.toString = function () {
        var delimiter;
        if (arguments.length <= 0) delimiter = ",";
        else delimiter = arguments[0];

        return this.join(delimiter);
    };

    // 利用动态原型方法定义一个 jStats 类
    function jStats() {
        this.attributes = {
            version: 1.1
        };

        this.dataCenter = {
            x: [],
            y: [],
            toArray: function () {
                var a = [];
                for (var i = 0; i < this.x.length; i++) {
                    a.push([this.x[i], this.y[i]]);
                }

                return a;
            }
        };

        if (arguments.length <= 0) {
        } else if (arguments.length <= 1) {
            for (var i = 0; i < arguments[0].length; i++) {
                this.dataCenter.x.push(arguments[0][i][0]);
                this.dataCenter.y.push(arguments[0][i][1]);
            }
        } else {
            this.dataCenter.x = arguments[0];
            this.dataCenter.y = arguments[1];
        }

        this.statVars = {
            n: 0,
            xBar: 0,
            Sx: 0,
            sigmaX: 0,
            yBar: 0,
            Sy: 0,
            sigmaY: 0,
            SumX: 0,
            Sum_X_2: 0,
            SumY: 0,
            Sum_Y_2: 0,
            Sum_XY: 0,
            a: 0,
            b: 0,
            r: 0,
            linearSquareSumOfErrors: 0,

            denominatorForLinearFit: 0
        };

        if (!this._initialized) {
            //Define a local copy of jStats
            var jS = this;

            //
            // 分析用户的输入
            //
            jStats.prototype.analyse = function () {
                this.statVars.n = this.dataCenter.x.length;
                this.statVars.xBar = this.dataCenter.x.average();
                this.statVars.Sx = this.dataCenter.x.sampleStandardDeviation();
                this.statVars.sigmaX = this.dataCenter.x.populationStandardDeviation();
                this.statVars.SumX = this.dataCenter.x.sum();
                this.statVars.Sum_X_2 = this.dataCenter.x.squareSum();
                this.statVars.yBar = this.dataCenter.y.average();
                this.statVars.Sy = this.dataCenter.y.sampleStandardDeviation();
                this.statVars.sigmaY = this.dataCenter.y.populationStandardDeviation();
                this.statVars.SumY = this.dataCenter.y.sum();
                this.statVars.Sum_Y_2 = this.dataCenter.y.squareSum();

                this.statVars.Sum_XY = this.pairSumOfxy();

                this.denominatorForLinearFit();

                this.statVars.a = this.slopeForLinearFit();
                this.statVars.b = this.interceptForLinearFit();

                this.statVars.linearSquareSumOfErrors = this.linearSquareSumOfErrors();
            };

            jStats.prototype.pairSumOfxy = function () {
                var s = 0;
                if (arguments.length <= 0) {
                    for (var i = 0; i < this.dataCenter.x.length; i++) {
                        s += this.dataCenter.x[i] * this.dataCenter.y[i];
                    }
                } else if (arguments.length <= 1) {
                    var m = arguments[0];
                    for (var i = 0; i < this.dataCenter.x.length; i++) {
                        s += Math.pow(this.dataCenter.x[i], m) * this.dataCenter.y[i];
                    }
                } else {
                    var m = arguments[0];
                    var n = arguments[1];

                    for (var i = 0; i < this.dataCenter.x.length; i++) {
                        s += Math.pow(this.dataCenter.x[i], m) * Math.pow(this.dataCenter.y[i], n);
                    }
                }

                return s;
            };

            jStats.prototype.denominatorForLinearFit = function () {
                this.statVars.denominatorForLinearFit = this.statVars.Sum_X_2 - this.statVars.n * Math.pow(this.statVars.xBar, 2);
                return this.statVars.denominatorForLinearFit;
            };

            jStats.prototype.slopeForLinearFit = function () {
                return (this.statVars.Sum_XY - this.statVars.n * this.statVars.xBar * this.statVars.yBar) / this.statVars.denominatorForLinearFit;
            };

            jStats.prototype.interceptForLinearFit = function () {
                return (this.statVars.yBar * this.statVars.Sum_X_2 - this.statVars.xBar * this.statVars.Sum_XY) / this.statVars.denominatorForLinearFit;
            };

            jStats.prototype.linearSquareSumOfErrors = function () {
                var sum = 0;
                for (var i = 0; i < this.dataCenter.x.length; i++) {
                    var yEstimate = this.dataCenter.x[i] * this.statVars.a + this.statVars.b;
                    var error = yEstimate - this.dataCenter.y[i];
                    sum += Math.pow(error, 2);
                }

                return sum;
            };

            jStats.prototype.squareSumOfErrors = function (parameterVector) {
                var sum = 0;
                // yEstimate = a_1 * x^(n-1) + a_2 * x^(n-2) + ... + a_(n-1) * x + a_n
                // yEstimate = [a_1, a_2, ..., a_n] [x^(n-1), x^(n-2), ..., x, x^(0)]^T
                // yEstimate = parameterVector * xVector^T
                var n = parameterVector.length;
                var xVector = new Array(n);
                for (var i = 0; i < this.dataCenter.x.length; i++) {
                    for (var j = 0; j < xVector.length; j++) {
                        xVector[j] = Math.pow(this.dataCenter.x[i], j);
                    }
                    var yEstimate = Matrix.multiply([xVector], parameterVector);

                    var error = yEstimate - this.dataCenter.y[i];
                    sum += Math.pow(error, 2);
                }

                return sum;
            };

            /// <summary>
            ///     计算拟合误差平方和
            /// </summary>
            /// <param name="y" type="Array">
            ///     原始的y值数据列
            /// </param>
            /// <param name="yEstimated" type="Array">
            ///     拟合的y值数据列
            /// </param>
            /// <returns type="Number" />
            jStats.prototype.residualSumOfSquares = function (y, yEstimated) {
                var sum = 0;
                for (var i = 0; i < y.length; i++) {
                    var error = yEstimated[i] - y[i];
                    sum += Math.pow(error, 2);
                }

                return sum;
            };    
            
            /// <summary>
            ///     Compute the average vector
            ///     | x^bar |
            ///     | x^2^bar |
            ///     | ...   |
            ///     | x^m^bar |
            /// </summary>
            jStats.prototype.averageVector = function (m) {
                var v = new Array(m);
                for(var i = 0; i < m; i++) {
                    v[i] = this.dataCenter.x.powerSum(i+1) / this.dataCenter.x.length;
                }

                return v;
            };

            /// <summary>
            ///     Compute Sigma[(x^i-x^i^bar)(x^k-x^k^bar)]
            /// </summary>
            jStats.prototype.SP_ik = function (i, k) {
                var barXi = this.dataCenter.x.powerSum(i) / this.dataCenter.x.length;
                var barXk = this.dataCenter.x.powerSum(k) / this.dataCenter.x.length;
                var sum = 0;
                for (var j = 0; j < this.dataCenter.x.length; j++) {
                    sum += (Math.pow(this.dataCenter.x[j], i) - barXi) * (Math.pow(this.dataCenter.x[j], k) - barXk);
                }

                return sum;
            };

            /// <summary>
            ///     Compute Sigma[(x^i-x^i^bar)(y-y^bar)]
            /// </summary>
            jStats.prototype.SP_i0 = function (i) {
                var barXi = this.dataCenter.x.powerSum(i) / this.dataCenter.x.length;
                var barY = this.dataCenter.y.average();
                var sum = 0;
                for (var j = 0; j < this.dataCenter.x.length; j++) {
                    sum += (Math.pow(this.dataCenter.x[j], i) - barXi) * (this.dataCenter.y[j] - barY);
                }

                return sum;
            };

            /// <summary>
            ///     Compute the matrix A of normal equations: 
            ///     | SP_11, SP_12, ..., SP_1m |
            ///     | SP_21, SP_22, ..., SP_2m |
            ///     | ...,  ...,    ..., ...   |
            ///     | SP_m1, SP_m2, ..., SP_mm |
            /// </summary>
            jStats.prototype.matrixA = function (m) {
                var a = new Array(m);
                for (var i = 0; i < m; i++) {
                    a[i] = new Array(m);
                    for (var j = 0; j < m; j++) {
                        a[i][j] = this.SP_ik(i + 1, j + 1);
                    }
                }
                return a;
            };

            /// <summary>
            ///     Compute the Constant matrix of normal equations
            ///     | SP_10 |
            ///     | SP_20 |
            ///     | ...   |
            ///     | SP_m0 |
            /// </summary>
            jStats.prototype.vectorB = function (m) {
                var v = new Array();
                for (var i = 0; i < m; i++) {
                    v.push([this.SP_i0(i+1)]);
                }

                return v;
            };

            /// <summary>
            ///     Compute the partial regression coefficient vector (matrix)
            ///     | b_1 |     | SP_11, SP_12, ..., SP_1m |^(-1)   | SP_10 |
            ///     | b_2 | =   | SP_21, SP_22, ..., SP_2m |   *    | SP_20 |
            ///     | ... |     | ...                      |        | ...   |
            ///     | b_m |     | SP_m1, SP_m2, ..., SP_mm |        | SP_m0 |
            /// </summary>
            jStats.prototype.partialRegressionCoefficientVector = function (m) {
                var rhs = this.vectorB(m);
                var lhs = this.matrixA(m);
                var matrixC = Matrix.inverse(lhs);
                var bVector = Matrix.multiply(matrixC, rhs);
                return bVector;
            };

            jStats.prototype.regressionCoefficientVector = function (m) {
                var bVector = this.partialRegressionCoefficientVector(m);
                b0 = this.dataCenter.y.average() - Math.sumProduct(bVector, this.averageVector(m));

                bVector.splice(0, 0, [b0]);
                return bVector;
            };

            this._initialized = true;
        }

        this.analyse();
    }

    jStats.prototype.plugin = function () { };

    window.JStats = jStats;
})(Matrix);