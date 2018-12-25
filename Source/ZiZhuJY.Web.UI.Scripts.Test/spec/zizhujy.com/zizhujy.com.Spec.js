///<reference path="/../ZiZhuJY.Web.UI/Scripts/zizhujy.com.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe("zizhujy.com.js test suite", function () {
    beforeEach(function() {
        
    });

    it("Spec: indexOf() should return the index of the element in an array.", function() {
        expect([0, 1, 2, 3, 4, 5].indexOf(1)).toBe(1);

        var obj = { a: "a3", b: "b3" };
        expect([
            { a: "a", b: "b" },
            { a: "a2", b: "b2" },
            { a: "a3", b: "b3" },
            { a: "a4", b: "b4" }
        ].indexOf(obj, function(item) { return item.a === obj.a && item.b === obj.b; })).toBe(2);
    });

    it("Spec: remove() should remove an item from an array.", function() {
        expect((function() {
            var a = [0, 1, 2, 3, 4, 5];
            a.remove(3);
            return a;
        })()).toEqual([0, 1, 2, 4, 5]);

        expect((function() {
            var a = [
                { a: "a", b: "b" },
                { a: "a2", b: "b2" },
                { a: "a3", b: "b3" },
                { a: "a4", b: "b4" }
            ];
            var obj = { a: "a3", b: "b3" };
            a.remove(obj, function (item) { return item.a === obj.a && item.b === obj.b; });

            return a;
        })()).toEqual([
                { a: "a", b: "b" },
                { a: "a2", b: "b2" },
                { a: "a4", b: "b4" }
        ]);

        expect((function() {
            var a = [
                { a: "a", b: "b" },
                { a: "a", b: "b2" },
                { a: "a3", b: "b3" },
                { a: "a4", b: "b4" }
            ];

            a.remove(function (item) { return item.a === "a"; });

            return a;
        })()).toEqual([
                { a: "a3", b: "b3" },
                { a: "a4", b: "b4" }
        ]);
    });

    it("Spec: upsert() should update or insert an element among an array.", function() {
        var a = [1, 2, 3, 4];
        expect(a.upsert(5, function(item) { return item === 5; })).toEqual([1, 2, 3, 4, 5]);

        a = [
            { a: "a", b: "b" },
            { a: "a2", b: "b2" },
            { a: "a3", b: "b3" },
            { a: "a4", b: "b4" }
        ];

        expect(a.upsert({ a: "a3", b: "new b4" }, function(item) { return item.a === "a3"; })).toEqual([
            { a: "a", b: "b" },
            { a: "a2", b: "b2" },
            { a: "a3", b: "new b4" },
            { a: "a4", b: "b4" }
        ]);
    });

    it("Spec: replaceAll() should replace all the occurances of a string to be replaced.", function() {
        var s = "abcdefabcdef";
        expect(s.replaceAll("a", "g")).toEqual("gbcdefgbcdef");

        s = "\\cdot";
        expect(s.replace("\\cdot", "*")).toEqual("*");
        expect(s.replaceAll("\\cdot", "*")).toEqual("*");
        expect(s.replaceAll("\\cdot", "*")).toEqual(s.replace("\\cdot", "*"));
    });

    it("Spec: format() should replace {0}, {1}, ... to its associated string.", function() {
        expect('{0}'.format('test')).toBe('test');

        var html = ('<h3>{0}</h3>' +
            '<div class="text">{1}</div>').format('title', 'body');
        expect(html).toBe('<h3>title</h3><div class="text">body</div>');
    });

});
