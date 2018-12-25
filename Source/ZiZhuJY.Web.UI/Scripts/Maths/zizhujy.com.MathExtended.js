;
(function(global) {
    if (!Number.isNaN) {
        try {
            if (typeof Object.defineProperty !== 'function') {
                throw new TypeError('Object.defineProperty is not a function');
            }

            (function(global) {
                var global_isNaN = global.isNaN;

                Object.defineProperty(Number, 'isNaN', {
                    value: function isNaN(value) {
                        return typeof value === 'number' && global_isNaN(value);
                    },
                    configurable: true,
                    enumerable: false,
                    writable: true
                });
            })(this);
        } catch (ex) {
            Number.isNaN = function(v) {
                return typeof v === 'number' && v.toString() === 'NaN';
            };
        }
    }

    if (!Math.floorInBase) {
        function floorInBase(n, base, big) {
            var fallback = base * Math.floor(n / base);

            if (big) {
                return big(base).times(big(n).div(big(base)).round()).toString();
            }

            return fallback;
        }

        try {
            if (typeof Object.defineProperty !== 'function') {
                throw new TypeError('Object.defineProperty is not a function');
            }

            Object.defineProperty(Math, 'floorInBase', {
                value: floorInBase,
                configurable: true,
                enumerable: false,
                writable: true
            });
        } catch (ex) {
            Math.floorInBase = floorInBase;
        }
    }

    Math.gcd = function(a, b) {
        while (b != 0) {
            var t = b;
            b = a % t;
            a = t;
        }

        return a;
    };
    global.gcd = Math.gcd;

    if (!Number.isInteger) {
        Number.isInteger = function(nVal) {
            return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
        };
    }

    if (!Number.getFractal) {
        Number.getFractal = function(n) {
            //if (typeof n !== "number") {
            //    if(parseFloat(n))
            //    throw "The argument " + n + " is not of number type.";
            //}

            if (Number.isNaN(parseFloat(n))) {
                throw "The argument '" + n + "' is not a valid number.";
            }
            
            var numberString = n.toString();
            var indexOfPeriod = numberString.indexOf(".");
            return indexOfPeriod >= 0 ? numberString.substring(indexOfPeriod + 1) : "";
        };
    }

    if (!Number.fractalLength) {
        Number.fractalLength = function(n) {
            return Number.getFractal(n).length;
        };
    }

    // Fraction static class
    function Fraction() {
        var repeatingDecimalRegex = /^([+-]?\d*\.\d*)`(\d+)`$/;

        function _reduce(frac) {
            var gcd = Math.gcd(frac.numerator, frac.denominator);

            return {
                valid: true,
                numerator: frac.numerator / gcd,
                denominator: frac.denominator / gcd
            };
        }

        // 0.[p][p][p]...
        //
        //          [p]                 [p]                    1                   [p]                  1
        // = ----------------- + ------------------- * ------------------ + ------------------ * (----------------)^2 + ...
        //     10^(p.length)         10^(p.length)        10^(p.length)        10^(p.length)        10^(p.length)
        //                 1                 1                  1
        // = [p]* (----------------- + ---------------- + ------------------- + ...)
        //           10^(p.length)      10^(p.length)^2     10^(p.length)^3
        //
        //             q                  [p]                              1
        // = [p]* ------------ = ----------------------, where q = ------------------
        //           1 - q          10^(p.length) - 1                 10^(p.length)
        //
        function _buildFractionFromBasicRepeatingDecimal(period) {
            Math.power = Math.power || Math.pow;

            var frac = {
                valid: true,
                numerator: parseInt(period),
                denominator: Math.power(10, period.length) - 1
            };

            return frac;
        }

        function _buildFractionFromRepeatingDecimal(firstPart, period) {
            Math.power = Math.power || Math.pow;

            var basic = _buildFractionFromBasicRepeatingDecimal(period);

            // 无限循环小数
            //denominator = Math.power(10, period.length) - 1;
            //numerator = parseInt(period) + Math.floor(firstPart) * denominator;
            // enhance for numbers such as 0.21`435` 
            // =0.21 + 435 * 10^{-2}\left(10^{-3}+10^{-6}+10^{-9}+...\right)
            // = 0.21 + 10^{-2} * 435 / (10^{3} - 1)
            // = 0.21 + 435 / (10^{2} * (10^{3} - 1))
            // = (0.21 * 10^{2} * (10^{3} - 1) + 435) / 10^{2} * (10^{3} - 1)
            var fractalLengthOfFirstPart = Number.getFractal(firstPart).length;
            //var denominator = basic.denominator * Math.power(10, fractalLengthOfFirstPart);
            var denominator = new Big(basic.denominator).times(Math.power(10, fractalLengthOfFirstPart));
            // var numerator = firstPart * denominator + basic.numerator;
            var numerator = new Big(firstPart).times(denominator).plus(basic.numerator);

            return {
                valid: true,
                numerator: numerator.toString(),
                denominator: denominator.toString()
            };
        }

        // Try to build fraction from a decimal, the detail discussion of algorithm can be found here:
        // http://zizhujy.com/blog/post/2014/01/21/%E5%B0%86%E5%B0%8F%E6%95%B0%E8%BD%AC%E5%8C%96%E4%B8%BA%E5%88%86%E6%95%B0%E7%9A%84%E7%AE%97%E6%B3%95.aspx
        function _buildFractionFromDecimal(firstPart, repeatingPart) {
            var period = repeatingPart;
            var denominator;
            var numerator;

            var frac = {
                valid: false,
                numerator: 0,
                denominator: 0
            };

            Math.power = Math.power || Math.pow;

            if (typeof period !== 'undefined' && period !== null && period !== "") {
                return _buildFractionFromRepeatingDecimal(firstPart, period);
            } else {
                // 有限不循环小数
                var fractal = Number.getFractal(firstPart);
                var fractalLength = fractal.length;
                denominator = Math.power(10, fractalLength);
                numerator = firstPart * denominator;
            }

            frac.valid = true;
            frac.numerator = numerator;
            frac.denominator = denominator;

            return frac;
        }

        function _parseRepeatingDecimal(decimalString) {
            var matches = repeatingDecimalRegex.exec(decimalString);
            var fractal = matches[1];

            if (fractal[0] === '.') {
                fractal = '0' + fractal;
            }

            var period = matches[2];

            return {
                fractal: fractal,
                period: period
            };
        }

        function _trimEndFromRepeatingDecimal(decimal, period) {
            var regex = new RegExp(period + '$');
            var decimalString = decimal.toString();
            
            while (!regex.test(decimalString)) {
                decimalString = decimalString.substr(0, decimalString.length - 1);
            }

            return decimalString;
        }

        function _buildFraction() {

            var frac = {
                valid: false,
                numerator: 0,
                denominator: 0
            };

            if (arguments.length <= 0) {
                throw "The number of arguments must be greater than or equal 1.";
            }

            if (typeof arguments[0] !== "number") {
                if (typeof arguments[0] !== 'string' || !repeatingDecimalRegex.test(arguments[0])) {
                    throw "The argument " + arguments[0] + " is not of number type, then it should be a string like '0.56`789`' (= 0.56789789789789...), where the 789 is the periodic digits.'";
                } else {
                    var detected = _parseRepeatingDecimal(arguments[0]);

                    frac = _buildFractionFromDecimal(parseFloat(detected.fractal), detected.period);

                    return _reduce(frac);
                }
            }

            if (arguments.length > 2) {
                throw "Only 1 or 2 arguments are allowed.";
            }

            if (!Number.isInteger(arguments[0])) {
                if (arguments.length === 2 && (typeof arguments[1] !== 'boolean')) {
                    throw "Given 2 arguments, then the 1st argument must be a INTEGER numerator, and the 2nd argument must be a INTEGER denominator; or the 1st argument is a number and the 2nd argument is a boolean valud indicating whether auto detect the repeating decimals (period). But actually the 1st argument is " + arguments[0] + ", and the 2nd argument is " + arguments[1];
                } else {
                    // find period

                    var autoDetectPeriod = true;

                    if (typeof arguments[1] !== 'undefined') {
                        autoDetectPeriod = !!arguments[1];
                    }

                    if (autoDetectPeriod) {
                        var period = _getPeriodicDigits(arguments[0]);
                        var d = _trimEndFromRepeatingDecimal(arguments[0], period);
                        frac = _buildFractionFromDecimal(d, period);
                    } else {
                        frac = _buildFractionFromDecimal(arguments[0]);
                    }
                }
            } else {
                if (typeof arguments[1] === "undefined" || typeof arguments[1] === 'boolean') {
                    frac.valid = true;
                    frac.numerator = arguments[0];
                    frac.denominator = 1;
                } else if (!Number.isInteger(arguments[1]) || arguments[1] === 0) {
                    throw "The denominator must be an non-zero INTEGER.";
                } else {
                    frac.valid = true;
                    frac.numerator = arguments[0];
                    frac.denominator = arguments[1];
                }
            }

            return _reduce(frac);
        }

        function _getPeriodicDigits(n) {
            var fractalPart = Number.getFractal(n);

            if (fractalPart === "") return "";

            var periodLength = 1;
            var period = "";

            while (periodLength < fractalPart.length) {
                period = fractalPart.substr(0, periodLength);

                for (var i = period.length; i + period.length < fractalPart.length; i += period.length) {
                    if (fractalPart.substr(i, period.length) == period) {
                        continue;
                    } else {
                        periodLength++;
                        break;
                    }
                }

                if (i + period.length >= fractalPart.length) {
                    // 0.15491549155  (period = 1549)
                    //  --> 0.15491549  (remove remainder) 155
                    //  --> 0.1549154915491549  (add 2 periods) 15491549
                    //  --> 0.15491549155  (round) 155 =?= round(15491549)
                    var remainder = fractalPart.substr(i);
                    var twoPeriods = period.toString() + period.toString();

                    if (parseFloat("0." + remainder) == Math.round(parseFloat("0." + twoPeriods), remainder.length)
                        || parseFloat("0." + remainder) == Math.floor(parseFloat("0." + twoPeriods), remainder.length)) {
                        break;
                    } else {
                        period = "";
                        break;
                    }
                }
            }

            return period;
        }

        return {
            getPeriodicDigits: _getPeriodicDigits,
            parseRepeatingDecimal: _parseRepeatingDecimal,
            trimEndFromRepeatingDecimal: _trimEndFromRepeatingDecimal,
            reduce: _reduce,
            newFraction: _buildFraction,
            newFractionFromRepeatingDecimal: _buildFractionFromRepeatingDecimal,
            newFractionFromDecimal: _buildFractionFromDecimal,
            newFractionFromBasicRepeatingDecimal: _buildFractionFromBasicRepeatingDecimal,
            repeatingDecimalRegex: repeatingDecimalRegex
        };
    }

    // Export

    // Node and other CommonJS-like environments that support module.exports.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Fraction();

        //AMD.
    } else if (typeof define == 'function' && define.amd) {
        define(function() {
            return Fraction();
        });

        //Browser.
    } else {
        global['Fraction'] = Fraction();
    }
})(this);

(function(window) {
    window.sin = Math.sin;
    Math.csc = function(x) {
        return 1 / Math.sin(x);
    };
    window.csc = Math.csc;
    window.cos = Math.cos;
    window.tan = Math.tan;
    window.cot = Math.cot = function(aValue) {
        return 1 / Math.tan(aValue);
    };
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
    window.arccot = Math.acot = Math.arccot = function(x) {
        if (x == 0) return Math.PI / 2;
        if (x < 0) return Math.atan(1 / x) + Math.PI;
        return Math.atan(1 / x);
    };
    window.ceil = Math.ceil;
    window.E = Math.E;
    window.e = Math.E;
    window.exp = Math.exp;
    Math.floorToInt = Math.floor;
    Math.floor = function(x, numberOfDecimals) {
        var factor = Math.power(10, numberOfDecimals || 0);
        return Math.floorToInt(x * factor) / factor;
    };
    window.floor = Math.floor;
    window.ln = Math.log;
    window.log = Math.log = function() {
        if (arguments.length > 0) {
            var a = 10;
            var x = arguments[0];
            if (arguments.length > 1) {
                a = arguments[0];
                x = arguments[1];
            }
            return ln(x) / ln(a);
        } else {
            return NaN;
        }
    };
    window.lg = Math.lg = function(x) {
        return Math.log(2, x);
    };
    window.max = Math.max;
    window.min = Math.min;
    window.PI = Math.PI;
    window.pi = Math.PI;
    Math.power = Math.pow;
    //
    // 让Math.pow(x, y)支持对x求奇次方根
    //
    Math.pow = function(x, y) {
        // v3:
        if (!Number.isInteger(y) && x < 0) {
            var yFrac = Fraction.newFraction(y);
            if (yFrac.valid && yFrac.denominator % 2 == 1) {
                if (yFrac.numerator % 2 == 0) {
                    return Math.pow(-x, y);
                } else {
                    return -Math.power(-x, y);
                }
            } else {
                return Math.power(x, y);
            }
        } else {
            return Math.power(x, y);
        }

        // v2:
        // 1 / y % 2 == 1 <===> the denominator of fraction y is odd, for example
        // 1 / (1/3) % 2 == 1 because 1/(1/3) == 3, while 3 % 2 == 1.
        // !Note: the y is a fraction whose numerator is 1! 
        //if (y < 1 && 1 / y % 2 == 1 && x < 0) {
        //    return -Math.power(-x, y);
        //} else {
        //    return Math.power(x, y);
        //}

        // v1:
        //        if (y < 1 && 1 / y % 2 == 1) {
        //            return (x / Math.abs(x)) * Math.power(abs(x), y);
        //        } else {
        //            return Math.power(x, y);
        //        }
    };
    window.pow = Math.pow;

    var random = Math.random;
    Math.random = function() {
        if (arguments.length <= 0) {
            return random();
        } else {
            var min = arguments[0];
            var max = arguments[1];
            var range = max - min;

            return Math.floor((random() * range) + min, Math.max(Number.getFractal(min).length, Number.getFractal(max).length));
        }
    };
    window.random = Math.random;
    Math.roundToInt = Math.round;
    Math.round = function(x, numberOfDecimals) {
        var factor = Math.power(10, numberOfDecimals || 0);
        return Math.roundToInt(x * factor) / factor;
    };
    window.round = Math.round;
    window.sqrt = Math.sqrt;
    window.sec = Math.sec = function(aValue) {
        return 1 / Math.cos(aValue);
    };
    window.cosec = Math.cosec = function(aValue) {
        return 1 / Math.sin(aValue);
    };
    window.sign = window.sgn = function(x) {
        if (x > 0) {
            return 1;
        } else if (x == 0) {
            return 0;
        } else {
            return -1;
        }
    };
})(this);