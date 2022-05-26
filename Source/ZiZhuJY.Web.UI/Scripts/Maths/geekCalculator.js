;
(function (global, math, Fraction, parser) {
    math.config({
        number: 'bignumber',
        precision: 64
    });

    var geekCalc = {
        parse: function(s) {
            parser.init(s);

            var countOfEqualSign = s.split("=").length - 1;

            if (countOfEqualSign === 1) {
                parser.run();
            } else if (countOfEqualSign === 0) {
                parser.runSpecific(function (p) {
                    p.expression(true);
                });
            } else {
                
            }

            if (parser.errorList.length > 0) {
                throw parser.errorList;
            }

            if (parser.tree !== null) {
                return parser.tree.eval();
            } else {
                throw s;
            }
        },
        
        eval: function (s, scope) {
            var fracRegex = /\\frac{(.+)}{(.+)}/;
            var answer = s;
            var matches = fracRegex.exec(answer);
            
            var answer2 = '';
            var finalAnswer = '';
            var evaluator = math || global;

            if (matches === null) {
                answer = evaluator.eval(s, scope).toString();

                var frac = Fraction.newFraction(answer, false);
                if (frac.valid && frac.denominator !== 1) {
                    answer2 = '\\frac{' + frac.numerator + '}{' + frac.denominator + '}';
                }
            } else {
                answer2 = evaluator.eval(matches[1] + ' / ' + matches[2]).toString();
            }

            finalAnswer = answer;

            if (answer2 !== '') {
                finalAnswer = '=' + answer + '=' + answer2;
            }

            return finalAnswer;
        },

        parseAndEval: function(s, scope) {
            return this.eval(this.parse(s), scope);
        }
    };

    // EXPORT
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = geekCalc;
    }else if (typeof define === 'function' && define.amd) {
        define(function() {
            return geekCalc;
        });
    } else {
        global['geekCalc'] = geekCalc;
    }
})(this, this['math'], this['Fraction'], this['zizhujy']['com']['LaTexParser']);