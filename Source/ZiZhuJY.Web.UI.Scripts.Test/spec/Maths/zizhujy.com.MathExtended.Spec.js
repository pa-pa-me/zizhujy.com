///<reference path="/../ZiZhuJY.Web.UI/Scripts/bigjs/big.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Maths/zizhujy.com.MathExtended.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe('isNaN feature', function() {
    it("Spec: isNaN", function() {
        expect(Number.isNaN(NaN)).toBe(true);
        expect(Number.isNaN(1.23)).toBe(false);
    });
});

describe("zizhujy.com.MathExtended depend on big.js", function() {
    it("Spec: Big class is defined", function () {
        expect(typeof Big !== 'undefined').toBe(true);
        expect((new Big(6666666666666666)).times(9).toString()).toBe('59999999999999994');
    });
});

describe("zizhujy.com.MathExtended test suite", function () {
    it("Spec: Number.isInteger(n) can test if a number is a integer or not.", function () {
        expect(Number.isInteger(5)).toBe(true);
        expect(Number.isInteger(5.0000)).toBe(true);
        expect(Number.isInteger(5.00000001)).toBe(false);
    });

    it("Spec: Number.getFractal(n) can return the fractal part of a number as a string.", function () {
        expect(Number.getFractal(5)).toBe("");
        expect(Number.getFractal(5.1)).toBe("1");
        expect(Number.getFractal(-9.9230000)).toBe("923");
        expect(function () { Number.getFractal("nonsense"); }).toThrow();
        expect(Number.getFractal("233.33")).toBe("33");
        expect(Number.getFractal(233.33994)).toBe("33994");
        expect(Number.getFractal(2.142857)).toBe("142857");
    });

    it("Spec: Number.fractalLength(n) can find the length of a number's fractal part.", function () {
        expect(Number.fractalLength(5)).toBe(0);
        expect(Number.fractalLength(5.1)).toBe(1);
        expect(Number.fractalLength(-9.9230000)).toBe(3);
        expect(function () { Number.fractalLength("nonsense"); }).toThrow();
        expect(Number.fractalLength("233.33")).toBe(2);
        expect(Number.fractalLength(233.33994)).toBe(5);
        expect(Number.fractalLength(0.14285714285714285)).toBe(17);
    });

    it("Spec: Math.gcd(x, y) can find the greatest common divisor of x and y.", function () {
        expect(Math.gcd(15, 20)).toBe(5);
        expect(Math.gcd(666, 1000)).toBe(2);
    });

    it("Spec: Math.pow(x, y) can calculate these values correctly.", function () {
        expect(Math.pow(-5, 2 / 3)).toBe(2.924017738212866);
        expect(Math.pow(5, 2 / 3)).toBe(2.924017738212866);
        expect(Math.pow(-5, 2)).toBe(25);
        expect(Math.pow(-3, 1 / 3)).toBe(-1.4422495703074083);
        expect(Math.pow(16, 1 / 2)).toBe(4);
        expect(isNaN(Math.pow(-16, 1 / 2))).toBe(true);
        expect(Math.pow(27, 1 / 3)).toBe(3);
        expect(Math.pow(-27, 1 / 3)).toBe(-3);
        expect(Math.pow(-0.23, 2 / 3)).toBe(0.3753921822977319);
        expect(Math.pow(-1, 2 / 3)).toBe(1);
    });

    it("Spec: Math.round(x, numberOfDigits) can round a float to a number has specified number of decimal digits.", function () {
        expect(Math.round(5.5)).toEqual(6);
        expect(Math.round(5.5555, 2)).toEqual(5.56);
        expect(Math.round(0.66666, 1)).toEqual(0.7);
        expect(Math.round(0.142857142857, 5)).toEqual(0.14286);
        expect(parseFloat("0." + "14284") == Math.round(parseFloat("0." + "142857142857"), "14284".length)).toEqual(false);
    });

    it("Spec: Math.floor(x, numberOfDigits) can round a float to a lower number has specified number of decimal digits.", function () {
        expect(Math.floor(5.5)).toEqual(5);
        expect(Math.floor(5.5555, 2)).toEqual(5.55);
        expect(Math.floor(0.66666, 1)).toEqual(0.6);
        expect(Math.floor(0.142857142857, 5)).toEqual(0.14285);
        expect(parseFloat("0." + "14284") == Math.floor(parseFloat("0." + "142857142857"), "14284".length)).toEqual(false);
    });

    describe("Fraction class test suite.", function () {
        it("Spec: Fraction.periodDigits(n) can find the period digits of a number.", function () {
            expect(Fraction.getPeriodicDigits(0.6666666666666666)).toEqual("6");
            expect(Fraction.getPeriodicDigits(0.6666666666666667)).toEqual("6");
            expect(Fraction.getPeriodicDigits(0.6666666666666665)).toEqual("");
            expect(Fraction.getPeriodicDigits(0.3333333333333333)).toEqual("3");
            expect(Fraction.getPeriodicDigits(0.14285714285714285)).toEqual("142857");

            // Note: the following 2 numbers will always be interpreted as 0.14285714285714285
            // console.log(0.14285714285714286) --> 0.14285714285714285
            // console.log(0.14285714285714284) --> 0.14285714285714285
            //expect(Fraction.periodDigits(0.14285714285714286)).toEqual("142857");
            //expect(Fraction.periodDigits(0.14285714285714284)).toEqual("");

            expect(Fraction.getPeriodicDigits(0.1428571428571429)).toEqual("142857");
            expect(Fraction.getPeriodicDigits(0.1428571428571428)).toEqual("142857");
            expect(Fraction.getPeriodicDigits(0.1428571428571427)).toEqual("");
        });

        it("Spec: Fraction object can be built from decimals.", function() {
            expect(Fraction.newFractionFromDecimal(2)).toEqual({
                valid: true,
                numerator: 2,
                denominator: 1
            });

            expect(Fraction.newFractionFromDecimal(0.714285714285, '714285')).toEqual({
                valid: true,
                numerator: '714285000000000000',
                denominator: '999999000000000000'
            });
        });

        it("Spec: Can parse repeating decimals.", function() {
            expect(Fraction.parseRepeatingDecimal('0.714285`714285`')).toEqual({
                fractal: '0.714285',
                period: '714285'
            });
        });

        it("Spec: Trim end decimals from origin number.", function() {
            expect(Fraction.trimEndFromRepeatingDecimal(0.714285714285714, '714285')).toEqual('0.714285714285');
        });

        it("Spec: Fraction object can be built from numbers.", function () {
            expect(Fraction.newFraction(2)).toEqual({ valid: true, numerator: 2, denominator: 1 });
            expect(Fraction.newFraction(5, 7)).toEqual({ valid: true, numerator: 5, denominator: 7 });
            expect(function () { Fraction.newFraction(5, 7.1); }).toThrow();
            expect(function () { Fraction.newFraction(5, 0); }).toThrow();
            expect(Fraction.newFraction(0.714285714285714)).toEqual({ valid: true, numerator: 5, denominator: 7 });
            expect(Fraction.newFraction(0.666666666666666)).toEqual({ valid: true, numerator: 2, denominator: 3 });
            expect(Fraction.newFraction(0.5714285714285714)).toEqual({ valid: true, numerator: 4, denominator: 7 });
            expect(Fraction.newFraction(0.4444444444444444)).toEqual({ valid: true, numerator: 4, denominator: 9 });
            expect(Fraction.newFraction(2.142857142857143)).toEqual({ valid: true, numerator: 15, denominator: 7 });
            expect(Fraction.newFraction(0.6666666666666666)).toEqual({ valid: true, numerator: 2, denominator: 3 });
        });

        it("Spec: Fraction object can be build from repeating decimals by specifying the period.", function () {
            expect(Fraction.newFraction('0.`6`')).toEqual({ valid: true, numerator: 2, denominator: 3 });
            expect(Fraction.newFraction('.`6`')).toEqual({ valid: true, numerator: 2, denominator: 3 });
            expect(Fraction.newFraction('0.6`6`')).toEqual({ valid: true, numerator: 2, denominator: 3 });
            expect(Fraction.newFraction('2.`142857`')).toEqual({ valid: true, numerator: 15, denominator: 7 });
            expect(Fraction.newFraction('2.142857`142857`')).toEqual({ valid: true, numerator: 15, denominator: 7 });
            expect(function () { Fraction.newFraction('abcde'); }).toThrow();
            expect(Fraction.newFraction('0.21435`435`')).toEqual({ valid: true, numerator: 3569, denominator: 16650 });
        });

        it("Spec: Fraction can be constructed from a decimal and can auto detect periods if required.", function() {
            expect(Fraction.newFraction(0.6)).toEqual({ valid: true, numerator: 3, denominator: 5 });
            expect(Fraction.newFraction(0.66)).toEqual({ valid: true, numerator: 2, denominator: 3 });
            expect(Fraction.newFraction(0.66, false)).toEqual({ valid: true, numerator: 33, denominator: 50 });
            expect(Fraction.newFraction(5, false)).toEqual({ valid: true, numerator: 5, denominator: 1 });
        });

        it("Spec: Reduction of a fraction", function() {
            expect(Fraction.reduce({
                valid: true,
                numerator: 6,
                denominator: 9
            })).toEqual({
                valid: true,
                numerator: 2,
                denominator: 3
            });

            expect(Fraction.reduce({
                valid: true,
                numerator: 714285,
                denominator: 999999
            })).toEqual({
                valid: true,
                numerator: 5,
                denominator: 7
            });

            expect(Fraction.reduce({
                valid: true,
                numerator: '714285',
                denominator: '999999'
            })).toEqual({
                valid: true,
                numerator: 5,
                denominator: 7
            });
        });

        it("Spec: Convert basic repeating decimal to fraction.", function() {
            expect(Fraction.newFractionFromBasicRepeatingDecimal('6')).toEqual({
                valid: true,
                numerator: 6,
                denominator: 9
            });

            expect(Fraction.newFractionFromBasicRepeatingDecimal('285714')).toEqual({
                valid: true,
                numerator: 285714,
                denominator: 999999
            });

            expect(Fraction.newFractionFromBasicRepeatingDecimal('714285')).toEqual({
                valid: true,
                numerator: 714285,
                denominator: 999999
            });

            expect(Fraction.newFractionFromBasicRepeatingDecimal('142857')).toEqual({
                valid: true,
                numerator: 142857,
                denominator: 999999
            });

        });

        it("Spec: Convert repeating decimal to fraction.", function() {
            expect(Fraction.newFractionFromRepeatingDecimal(0.666666666666666, '6')).toEqual({
                valid: true,
                numerator: '6000000000000000',
                denominator: '9000000000000000'
            });

            expect(Fraction.newFractionFromRepeatingDecimal(0, '285714')).toEqual({
                valid: true,
                numerator: '285714',
                denominator: '999999'
            });

            expect(Fraction.newFractionFromRepeatingDecimal('0.000', '285714')).toEqual({
                valid: true,
                numerator: '285714',
                denominator: '999999000'
            });

            expect(Fraction.newFractionFromRepeatingDecimal(0.714, '285714')).toEqual({
                valid: true,
                numerator: (285714 + 0.714 * 999999000).toString(),
                denominator: '999999000'
            });

            expect(Fraction.newFractionFromRepeatingDecimal(0.714285714, '285714')).toEqual({
                valid: true,
                numerator: '714285000000000',
                denominator: '999999000000000'
            });

            expect(Fraction.newFractionFromRepeatingDecimal(0.6666666666666666, '6')).toEqual({
                valid: true,
                numerator: '60000000000000000',
                denominator: '90000000000000000'
            });

            expect(Fraction.newFractionFromRepeatingDecimal('0.66666666666666666', '6')).toEqual({
                valid: true,
                numerator: '600000000000000000',
                denominator: '900000000000000000'
            });

            expect(Fraction.newFractionFromRepeatingDecimal(2, "142857")).toEqual({
                valid: true,
                numerator: (142857 + 2 * 999999).toString(),
                denominator: '999999'
            });

            expect(Fraction.newFractionFromRepeatingDecimal(2.142857, "142857")).toEqual({
                valid: true,
                numerator: new Big(142857).plus(new Big(2.142857).times('999999000000')).toString(),
                denominator: '999999000000'
            });
        });
    });

});

describe("Trigonometric function test suite", function() {
    it("Spec: Can calculate csc(x)", function() {
        expect(csc(1)).toBe(1.1883951057781212);
    });
});

describe("floorInBase test suite", function () {
    it("Spec: without BigJs", function () {
        expect(Math.floorInBase(14.2, 0.2)).toBe(14);
        expect(Math.floorInBase(14.200000000000001, 0.2)).toBe(14.200000000000001);
        expect(Math.floorInBase(14.200000000000001, 0.2, Big)).toBe('14.2');
    })
});