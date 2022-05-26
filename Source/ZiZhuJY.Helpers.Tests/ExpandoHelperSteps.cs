using System.Dynamic;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace ZiZhuJY.Helpers.Tests
{
    [Binding]
    public class ExpandoHelperSteps
    {
        private ExpandoObject expando;
        private string actualHtml;

        [Given(@"an expando object")]
        public void GivenAnExpandoObject(Table table)
        {
            expando = table.CreateDynamicInstance();
        }

        [When(@"I generate html for it")]
        public void WhenIGenerateHtmlForIt()
        {
            actualHtml = expando.ToHtmlUnorderedList();
        }

        [Then(@"the result should be ""(.*)""")]
        public void ThenTheResultShouldBe(string expectedHtmlString)
        {
            Assert.AreEqual(expectedHtmlString, actualHtml);
        }
    }
}
