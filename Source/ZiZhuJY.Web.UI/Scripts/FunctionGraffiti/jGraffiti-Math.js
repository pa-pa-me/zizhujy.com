//*************************************************************************
// jGraffiti-Math
//
// Version: 1.0
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: 在线做图用到的函数以及常量
//

(function (window) {
    window.sin = Math.sin;
    window.cos = Math.cos;
    window.tan = Math.tan;
    window.tg = Math.tan;
    window.abs = Math.abs;
    window.acos = Math.acos;
    window.asin = Math.asin;
    window.atan = Math.atan;
    window.atg = Math.atan;
    window.atan2 = Math.atan2;
    window.atg2 = Math.atg2;
    window.ceil = Math.ceil;
    window.E = window.e = Math.E;
    window.exp = Math.exp;
    window.floor = Math.floor;
    //    window.LN10 = Math.LN10;
    //    window.ln10 = Math.LN10;
    //    window.LN2 = Math.LN2;
    //    window.ln2 = Math.LN2;
    window.ln = Math.log;
    //    window.LOG10E = Math.LOG10E;
    //    window.log10e = Math.LOG10E;
    //    window.LOG2E = Math.LOG2E;
    //    window.log2e = Math.LOG2E;
    window.max = Math.max;
    window.min = Math.min;
    window.PI = Math.PI;
    window.pi = Math.PI;
    if (Math.power == null) {
        // 此判断非常重要，如果Math.power 已经在别的地方定义过了，再次这样重新定义，会导致循环引用，从而引发
        // Uncaught RangeError: Maximum call stack size exceeded 错误
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
        };
    }
    window.pow = Math.pow;
    window.random = Math.random;
    window.round = Math.round;
    window.sqrt = Math.sqrt;
    //    window.SQRT1_2 = Math.SQRT1_2;
    //    window.sqrt1_2 = Math.sqrt1_2;
    //    window.SQRT2 = Math.SQRT2;
    //    window.sqrt2 = Math.SQRT2;
})(window);