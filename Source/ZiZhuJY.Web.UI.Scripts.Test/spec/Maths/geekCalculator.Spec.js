///<reference path="/../ZiZhuJY.Web.UI/Scripts/zizhujy.com.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/mathjs/math.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Maths/zizhujy.com.MathExtended.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/LaTex/zizhujy.com.LaTexLex.1.2.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/LaTex/zizhujy.com.LaTexParser.1.2.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Maths/geekCalculator.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe('geek calculator feature', function () {
    it("Spec: parse", function() {
        expect(geekCalc.parse('\\sqrt{25}')).toBe('sqrt(25)');
        expect(geekCalc.parse('x=3')).toBe('x=3');
        expect(geekCalc.parse('x^2+y^2')).toBe('pow(x, 2)+pow(y, 2)');
        expect(geekCalc.parse('1.01^{365}')).toBe('pow(1.01, 365)');
        expect(geekCalc.parse('0.99^{365}')).toBe('pow(0.99, 365)');
        expect(geekCalc.parse('0.66`6`')).toBe('\\frac{2}{3}');
        expect(geekCalc.parse('0.142857`142857`')).toBe('\\frac{1}{7}');
    });

    it('Spec: Error thrown', function() {
        expect(function() { geekCalc.parse('x=='); }).toThrow('x==');

        expect(
            function() {
                try {
                    geekCalc.parse('x==');
                    
                    return false;
                } catch (ex) {
                    return typeof ex === 'string' &&  ex === 'x==';
                }
            }()).toBe(true);
    });

    it("Spec: evaluation", function () {
        expect(geekCalc.eval('6*0.2')).toBe('=1.2=\\frac{6}{5}');
        expect(geekCalc.eval('sqrt(25)')).toBe('5');
        expect(geekCalc.eval('x=3')).toBe('3');
        expect(geekCalc.eval('y=66')).toBe('66');
        expect(geekCalc.eval('pow(1.01, 365)')).toBe('=37.78343433288715887761660479649760546027113549159100200330393389=\\frac{330911678172452160}{8758115402030107}');
        expect(geekCalc.eval('pow(0.99, 365)')).toBe('=0.02551796445229121002875033458996099289950449638640021028123795659=\\frac{388002217878591}{15205061461857824}');
        expect(geekCalc.eval('\\frac{2}{3}')).toBe('=\\frac{2}{3}=0.6666666666666666666666666666666666666666666666666666666666666667');
        expect(geekCalc.eval('\\frac{1}{7}')).toBe('=\\frac{1}{7}=0.1428571428571428571428571428571428571428571428571428571428571429');
    });

    it("Spec: parse and evaluation", function() {
        expect(geekCalc.parseAndEval('\\sqrt{25}')).toBe('5');
        expect(geekCalc.parseAndEval('0.6')).toBe('=0.6=\\frac{3}{5}');
        expect(geekCalc.parseAndEval('0.66')).toBe('=0.66=\\frac{33}{50}');
        expect(geekCalc.parseAndEval('0.66`6`')).toBe('=\\frac{2}{3}=0.6666666666666666666666666666666666666666666666666666666666666667');
    });

    it("Spec: evaluation with scope", function () {
        var scope = {};
        geekCalc.eval('x = 3', scope);

        expect(scope.x.toString()).toBe('3');
        expect(geekCalc.eval('x^2', scope)).toBe('9');

        expect(function () {
            var scope = {};
            geekCalc.parseAndEval('x = 3', scope);
            return geekCalc.parseAndEval('x^2', scope);
        }()).toBe('9');
    });
});
