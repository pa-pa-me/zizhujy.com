using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Common.Tests
{
    [TestClass]
    public class StringExtensionsTest
    {
        [TestMethod]
        public void SubStrTests()
        {
            Assert.AreEqual("Test", "Test".Substr(0, 4));
        }

        [TestMethod]
        public void FirstLetterToLowerTests()
        {
            Assert.AreEqual("_testTest", "_TestTest".FirstLetterToLower());
            Assert.AreEqual("home", "home".FirstLetterToLower());
            Assert.AreEqual("home", "Home".FirstLetterToLower());
            Assert.AreEqual("hOme", "hOme".FirstLetterToLower());
        }

        [TestMethod]
        public void FirstLetterToUpperTests()
        {
            Assert.AreEqual("Plotter", "plotter".FirstLetterToUpper());
            Assert.AreEqual("_Plotter", "_plotter".FirstLetterToUpper());
            Assert.AreEqual("Home", "Home".FirstLetterToUpper());
        }
    }
}
