using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.UnitTest.Specs
{
    [Binding]
    public class ResourceHelperSteps
    {
        private string input;
        private char c;
        private string actualOutput;

        [Given(@"a input string (.*)")]
        public void GivenAInputStringTest(string theInput)
        {
            input = theInput;
        }
        
        [Given(@"a target character (.) to escape")]
        public void GivenATargetCharacterToEscape(char theChar)
        {
            c = theChar;
        }

        [When(@"I call the method EscapeTheUnescapedChar\(input, c\) to escape c in the input string")]
        public void WhenICallTheMethodEscapeTheUnescapedCharTestToEscapeCInTheInputString()
        {
            actualOutput = ResourceHelper.EscapeTheUnescapedChar(input, c);
        }
        
        [Then(@"the (.*) should escaped all the unescaped 'c's")]
        public void ThenTheTestShouldEscapedAllTheUnescapedS(string expectedOutput)
        {
            Assert.AreEqual(expectedOutput, actualOutput);
        }
    }
}
