///<reference path="/../ZiZhuJY.Web.UI/Scripts/BigJs/Big.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/BigJsParser/BigJsParser.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe('Big Js Parser feature', function() {
    it("Spec: eval functions.", function() {
        expect(BigParser.eval('6 * 0.2')).toBe('1.2');
        expect(BigParser.eval('5 * 0.2')).toBe('1');
    });
});