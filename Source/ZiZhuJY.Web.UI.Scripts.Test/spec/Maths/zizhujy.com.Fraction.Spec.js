///<reference path="/../ZiZhuJY.Web.UI/Scripts/mathjs/math.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Maths/zizhujy.com.MathExtended.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe('Convert finite decimal to fraction feature', function() {
    it("Spec: fromFiniteDecimal", function () {
        expect(Fraction.fromFiniteDecimal('0.6')).toEqual({ valid: true, numerator: 3, denominator: 5 });
        expect(Fraction.fromFiniteDecimal(0.2)).toEqual({ valid: true, numerator: 1, denominator: 5 });
        
        expect(Fraction.fromFiniteDecimal('0.6', math)).toEqual({ valid: true, numerator: 3, denominator: 5 });
        expect(Fraction.fromFiniteDecimal(0.6, math)).toEqual({ valid: true, numerator: 3, denominator: 5 });
    });
});
