///<reference path="/../ZiZhuJY.Web.UI/Scripts/zizhujy.com.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Maths/zizhujy.com.MathExtended.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Latex/zizhujy.com.LaTexLex.1.2.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Latex/zizhujy.com.LaTexParser.1.2.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe('LaTex Tree Node feature', function () {
    it("Spec: Tree Node eval() functions.", function () {
        var node = new zizhujy.com.LaTexParser.TreeNode(zizhujy.com.LaTexParser.nodeTypeEnum.DIGITAL_NUMBER, '3', null);

        expect(node.expression).toBe('3');
        expect(node.getExpression()).toBe('3');

        var result = node.eval();
        expect(result).toBe('3');
    });

    it("Spec: Tree Node's eval() functions.", function () {
        var evalFactor = zizhujy.com.LaTexParser.TreeNode.evalFactor;

        expect(evalFactor('3', 'sqrt(3)', 'x')).toBe('3 * sqrt(3) * x');
        expect(evalFactor('3', '4', '5', '6')).toBe('3 * 4 * 5 * 6');
        expect(evalFactor('3', '^', '4')).toBe('pow(3, 4)');
        expect(evalFactor('3', '^', '4', '^', '6')).toBe('pow(pow(3, 4), 6)');
    });
});

describe('LaTex parser feature', function () {

    var parser = zizhujy.com.LaTexParser;

    it("Spec: basic expression evaluations", function () {
        parser.init('y=x');
        parser.run();
        parser.tree.eval();
        expect(parser.tree.evalCache).toEqual('y=x');
    });

    it("Spec: https://bitbucket.org/JeffTian/zizhujy.com/issue/26", function () {
        parser.init('y=3');
        parser.run();
        parser.tree.eval();
        expect(parser.tree.evalCache).toEqual('y=3');

        parser.init('y=3\\sqrt{3}x-\\sqrt{3}\\pi+ 1');
        parser.run();
        parser.tree.eval();
        expect(parser.tree.nodeType).toEqual({ value: 0, name: 'Equation' });
        expect(parser.tree.getExpression()).toBe('y=3\\sqrt{3}x-\\sqrt{3}\\pi+1');
        expect(parser.tree.children.length).toBe(3);
        expect(parser.tree.eval()).toBe('y=3 * sqrt(3) * x-sqrt(3) * pi+1');

        parser.init('y=3\\sqrt{3}x');
        parser.run();
        parser.tree.eval();
        expect(parser.tree.nodeType).toEqual({ value: 0, name: 'Equation' });
        expect(parser.tree.getExpression()).toBe('y=3\\sqrt{3}x');
        expect(parser.tree.children.length).toBe(3);
        expect(parser.tree.children[0].eval()).toBe('y');
        expect(parser.tree.children[1].eval()).toBe('=');
        expect(parser.tree.children[2].eval()).toBe('3 * sqrt(3) * x');
        expect(parser.tree.children[2].children.length).toBe(1);
        expect(parser.tree.children[2].nodeType).toEqual({ value: 1, name: 'Expression' });
        expect(parser.tree.children[2].children[0].nodeType).toEqual({
            value: 2,
            name: 'Term'
        });
        expect(parser.tree.children[2].children[0].children[0].nodeType).toEqual({
            value: 3,
            name: 'Factor'
        });
        expect(parser.tree.children[2].children[0].children[0].children.length).toBe(3);
        expect(parser.tree.children[2].children[0].children[0].eval())
            .toBe('3 * sqrt(3) * x');
        expect(parser.tree.eval()).toBe('y=3 * sqrt(3) * x');
    });

    it("Spec: https://bitbucket.org/JeffTian/zizhujy.com/issue/24", function () {
        parser.init('y=a4*x^4+a3*x^3+a2*x^2+a1*x+a0');
        parser.run();
        expect(parser.tree.eval()).toBe('y=a4*pow(x, 4)+a3*pow(x, 3)+a2*pow(x, 2)+a1*x+a0');

        var a4 = -0.000005265634399620467;
        var a3 = 0.04161267168819904;
        var a2 = -123.3164005279541;
        var a1 = 162413.744140625;
        var a0 = -80213083.26683944;
        var x = 1995;
        var y = 0;

        var expectedY = a4 * pow(x, 4) + a3 * pow(x, 3) + a2 * pow(x, 2) + a1 * x + a0;

        //throw expectedY;

        eval(parser.tree.eval());
        /* 26.1776220202446 */
        expect(y).toEqual(expectedY);
        expect(y).toEqual(26.1776220202446);
    });
});