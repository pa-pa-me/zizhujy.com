using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text.RegularExpressions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace ZiZhuJY.Helpers.Tests
{
    [TestClass]
    public class ExpandoHelperTest
    {
        [TestMethod]
        public void ToHtmlUnorderedListTest()
        {
            dynamic expando = new ExpandoObject();

            expando.Key1 = "Value1";
            expando.Key2 = new ExpandoObject();
            expando.Key2.Key1 = "Value1";
            expando.Key2.Key2 = "Value2";
            expando.Key2.Key3 = "Value3";

            var expected = @"
<div>System.Dynamic.ExpandoObject</div>
<ul>
    <li><strong>Key1</strong> = Value1</li>
    <li><strong>Key2</strong> = System.Dynamic.ExpandoObject
        <div>System.Dynamic.ExpandoObject</div>
        <ul>
            <li><strong>Key1</strong> = Value1</li>
            <li><strong>Key2</strong> = Value2</li>
            <li><strong>Key3</strong> = Value3</li>
        </ul>
    </li>
</ul>

";
            expected = Regex.Replace(expected, "\r?\n", Environment.NewLine);

            Assert.AreEqual(expected, ((ExpandoObject) expando).ToHtmlUnorderedList(true, true));

            var list = new List<ExpandoObject>();
            dynamic expando1 = new ExpandoObject();
            expando1.Key1 = "Value1";

            dynamic expando2 = new ExpandoObject();
            expando2.Key2 = "Value2";

            list.Add(expando1);
            list.Add(expando2);

            expando.Key4 = list;

            expected = @"
<div>System.Dynamic.ExpandoObject</div>
<ul>
    <li><strong>Key1</strong> = Value1</li>
    <li><strong>Key2</strong> = System.Dynamic.ExpandoObject
        <div>System.Dynamic.ExpandoObject</div>
        <ul>
            <li><strong>Key1</strong> = Value1</li>
            <li><strong>Key2</strong> = Value2</li>
            <li><strong>Key3</strong> = Value3</li>
        </ul>
    </li>
    <li><strong>Key4</strong> = System.Collections.Generic.List`1[System.Dynamic.ExpandoObject]
        <div>System.Collections.Generic.List`1[System.Dynamic.ExpandoObject]</div>
        <ol>
            <li>
                <div>System.Dynamic.ExpandoObject</div>
                <ul>
                    <li><strong>Key1</strong> = Value1</li>
                </ul>
            </li>
            <li>
                <div>System.Dynamic.ExpandoObject</div>
                <ul>
                    <li><strong>Key2</strong> = Value2</li>
                </ul>
            </li>
        </ol>
    </li>
</ul>

";
            
            expected = Regex.Replace(expected, "\r?\n", Environment.NewLine);
            Assert.AreEqual(expected, ((ExpandoObject) expando).ToHtmlUnorderedList(true, true));
        }

        [TestMethod]
        public void ToHtmlOrderedListTest()
        {
            var list = new List<ExpandoObject>();

            dynamic expando1 = new ExpandoObject();
            expando1.Key1 = "Value1";

            dynamic expando2 = new ExpandoObject();
            expando2.Key2 = "Value2";

            var expected = @"
<div>System.Collections.Generic.List`1[System.Dynamic.ExpandoObject]</div>
<ol>
    <li>
        <div>System.Dynamic.ExpandoObject</div>
        <ul>
            <li><strong>Key1</strong> = Value1</li>
        </ul>
    </li>
    <li>
        <div>System.Dynamic.ExpandoObject</div>
        <ul>
            <li><strong>Key2</strong> = Value2</li>
        </ul>
    </li>
</ol>

";

            list.Add(expando1);
            list.Add(expando2);

            expected = Regex.Replace(expected, "\r?\n", Environment.NewLine);
            Assert.AreEqual(expected, list.ToHtmlOrderedList(true, true));
        }
    }
}
