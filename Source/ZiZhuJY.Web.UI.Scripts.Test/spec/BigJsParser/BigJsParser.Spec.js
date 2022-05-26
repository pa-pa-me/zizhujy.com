///<reference path="/../ZiZhuJY.Web.UI/Scripts/BigJs/Big.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/BigJsParser/BigJsParser.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe('Big Js Parser feature', function () {
    it("Spec: parse functionalities.", function() {
        expect(BigParser.parse('1+1')).toBe('Big(1).plus(1)');
        expect(BigParser.parse('1-1')).toBe('Big(1).minus(1)');
        expect(BigParser.parse('6/2')).toBe('Big(6).div(2)');
    });

    it("Spec: eval functions.", function() {
        expect(BigParser.eval('6 * 0.2')).toBe('1.2');
        expect(BigParser.eval('5 * 0.2')).toBe('1');
        expect(BigParser.eval('6+1')).toBe('7');
        expect(BigParser.eval('1-1')).toBe('0');
        expect(BigParser.eval('6/2')).toBe('3');
    });
});