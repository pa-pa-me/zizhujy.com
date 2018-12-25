using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.UnitTest.Specs
{
    [TestClass]
    public class ResourceHelperSpec
    {
        [TestMethod]
        public void EscapeTheUnescapedChar()
        {
            Assert.AreEqual(@"test no c", ResourceHelper.EscapeTheUnescapedChar(@"test no c", '\''));
            Assert.AreEqual(@"test unsafe \'", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe '", '\''));
            Assert.AreEqual(@"test safe \'", ResourceHelper.EscapeTheUnescapedChar(@"test safe \'", '\''));
            Assert.AreEqual(@"test unsafe \\\'", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\'", '\''));
            Assert.AreEqual(@"test safe \\\'", ResourceHelper.EscapeTheUnescapedChar(@"test safe \\\'", '\''));
            Assert.AreEqual(@"test unsafe \\\\\'", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\'", '\''));
            Assert.AreEqual(@"test safe \\\\\'", ResourceHelper.EscapeTheUnescapedChar(@"test safe \\\\\'", '\''));
            Assert.AreEqual(@"test unsafe \\\\\\\'", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\\'", '\''));

            Assert.AreEqual(@"test unsafe \\\\\\\' 2nd unsafe \\\' 3rd unsafe \' 4th safe \'", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\\' 2nd unsafe \\' 3rd unsafe ' 4th safe \'", '\''));

            Assert.AreEqual(@"\'", ResourceHelper.EscapeTheUnescapedChar(@"'", '\''));
            Assert.AreEqual(@"\'", ResourceHelper.EscapeTheUnescapedChar(@"\'", '\''));
            Assert.AreEqual(@"\' more content", ResourceHelper.EscapeTheUnescapedChar(@"\' more content", '\''));
            Assert.AreEqual(@"\' more content", ResourceHelper.EscapeTheUnescapedChar(@"' more content", '\''));
        }

        [TestMethod]
        public void EscapeTheUnescapedUnicodeChars()
        {
            Assert.AreEqual(@"test no c", ResourceHelper.EscapeTheUnescapedChar(@"test no c", @"\u0027"));
            Assert.AreEqual(@"test unsafe \\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \u0027", @"\u0027"));
            Assert.AreEqual(@"test safe \\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test safe \\u0027", @"\u0027"));
            Assert.AreEqual(@"test unsafe \\\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\u0027", @"\u0027"));
            Assert.AreEqual(@"test safe \\\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test safe \\\\u0027", @"\u0027"));
            Assert.AreEqual(@"test unsafe \\\\\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\u0027", @"\u0027"));
            Assert.AreEqual(@"test safe \\\\\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test safe \\\\\\u0027", @"\u0027"));
            Assert.AreEqual(@"test unsafe \\\\\\\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\\\u0027", @"\u0027"));

            Assert.AreEqual(@"test unsafe \\\\\\\\u0027 2nd unsafe \\\\u0027 3rd unsafe \\u0027 4th safe \\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\\\u0027 2nd unsafe \\\u0027 3rd unsafe \u0027 4th safe \\u0027", @"\u0027"));

            Assert.AreEqual(@"\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"\u0027", @"\u0027"));
            Assert.AreEqual(@"\\u0027", ResourceHelper.EscapeTheUnescapedChar(@"\\u0027", @"\u0027"));
            Assert.AreEqual(@"\\u0027 more content", ResourceHelper.EscapeTheUnescapedChar(@"\\u0027 more content", @"\u0027"));
            Assert.AreEqual(@"\\u0027 more content", ResourceHelper.EscapeTheUnescapedChar(@"\u0027 more content", @"\u0027"));

            Assert.AreEqual(
                @"test unsafe \\\\\\\\u0027 2nd unsafe \\\\u0027 3rd unsafe \\u0027 4th safe \\u0027test unsafe \\\\\\\' 2nd unsafe \\\' 3rd unsafe \' 4th safe \'",
                ResourceHelper.EscapeTheUnescapedChar(
                    @"test unsafe \\\\\\\u0027 2nd unsafe \\\u0027 3rd unsafe \u0027 4th safe \\u0027test unsafe \\\\\\\' 2nd unsafe \\\' 3rd unsafe \' 4th safe \'",
                    @"\u0027"));
        }

        [TestMethod]
        public void EscapeTheUnescapedCharAndUnicodeChars()
        {
            //Assert.AreEqual(@"test unsafe \\\\\\\\u0027 2nd unsafe \\\\u0027 3rd unsafe \\u0027 4th safe \\u0027test unsafe \\\\\\\' 2nd unsafe \\\' 3rd unsafe \' 4th safe \'", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\\\u0027 2nd unsafe \\\u0027 3rd unsafe \u0027 4th safe \\u0027test unsafe \\\\\\' 2nd unsafe \\' 3rd unsafe ' 4th safe \'", '\''));

            //Assert.AreEqual(@"test unsafe \\\\\\\' 2nd unsafe \\\' 3rd unsafe \' 4th safe \'test unsafe \\\\\\\\u0027 2nd unsafe \\\\u0027 3rd unsafe \\u0027 4th safe \\u0027", ResourceHelper.EscapeTheUnescapedChar(@"test unsafe \\\\\\' 2nd unsafe \\' 3rd unsafe ' 4th safe \'test unsafe \\\\\\\u0027 2nd unsafe \\\u0027 3rd unsafe \u0027 4th safe \\u0027", '\''));
        }
    }
}
