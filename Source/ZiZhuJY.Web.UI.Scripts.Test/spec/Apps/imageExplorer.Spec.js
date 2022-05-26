///<reference path="/../ZiZhuJY.Web.UI/Scripts/jquery-1.8.3.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/zizhujy.com.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/zizhujy.com.Console.js"/>
///<reference path="/../ZiZhuJY.Web.UI/Scripts/Apps/imageExplorer.js"/>

describe("imageExplorer.js test suite", function () {

    beforeEach(function () {
    });

    it("Spec: replaceImageUrls test.", function () {
        var s = "<img src='image/suoji/index/home.gif' align=absbottom>";
        
        var result = replaceImageUrls(s, "http://www.test.com/");

        var expected = "<img src='http://www.test.com/image/suoji/index/home.gif' align=absbottom>";

        expect(result).toBe(expected);
    });

});
