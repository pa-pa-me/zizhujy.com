﻿;
(function (global, Big) {
    'use strict';

    var BigParser = {
        parse: function (s) {
            var a = [];
            var token = '';

            var i = 0;
            a.push('Big');
            while (i < s.length) {
                if ('0123456789.'.indexOf(s[i]) >= 0) {
                    while ('0123456789.'.indexOf(s[i]) >= 0) {
                        token += s[i];
                        i++;
                    }

                    a.push('(' + token + ')');
                    token = '';

                    continue;
                }

                if ('*'.indexOf(s[i]) >= 0) {
                    a.push('.times');
                    i++;

                    continue;
                }

                i++;
            }

            return a.join('');
        },

        eval: function(s) {
            return global.eval(this.parse(s)).toString();
        }
    };

    // EXPORT
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BigParser;
    }else if (typeof define === 'function' && define.amd) {
        define(function() {
            return BigParser;
        });
    } else {
        global['BigParser'] = BigParser;
    }
})(this, Big);