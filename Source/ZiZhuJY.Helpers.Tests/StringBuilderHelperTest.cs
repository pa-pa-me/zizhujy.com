using System;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ZiZhuJY.Helpers.Tests
{
    [TestClass]
    public class StringBuilderHelperTest
    {
        [TestMethod]
        public void AppendFormatToLevelTest()
        {
            var sb = new StringBuilder();
            sb.AppendFormatToLevel("Test");

            Assert.AreEqual("    Test", sb.ToString());

            sb.Clear();
            sb.AppendFormatToLevel("Test {0}", 1, ' ', 4, "me");
            Assert.AreEqual("    Test me", sb.ToString());

            sb.Clear();
            sb.AppendFormatToLevel(1, "Test {0}", "me");
            Assert.AreEqual("    Test me", sb.ToString());
        }
    }
}
