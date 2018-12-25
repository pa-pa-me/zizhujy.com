using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ZiZhuJY.Helpers.Tests
{
    [TestClass]
    public class StringHelperTest
    {
        [TestMethod]
        public void LevelPadWithTest()
        {
            Assert.AreEqual("    Test", "Test".LevelPadWith(1));
            Assert.AreEqual("    {0}", "{0}".LevelPadWith(1));
            Assert.AreEqual("    <div>{0}</div>", "<div>{0}</div>".LevelPadWith(1));

            Assert.AreEqual("Test", "Test".LevelPadWith(0));
        }
    }
}
