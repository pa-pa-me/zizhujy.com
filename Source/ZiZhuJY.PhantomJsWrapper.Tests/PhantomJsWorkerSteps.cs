using NUnit.Framework;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;
using TechTalk.SpecFlow;

namespace ZiZhuJY.PhantomJsWrapper.Tests
{
    [Binding]
    public class PhantomJsWorkerSteps
    {
        private string url = string.Empty;
        private PhantomJsWorker.PhantomJsExecutionResult executionResult;

        [Given(@"the web page url is ""(.*)""")]
        public void GivenTheWebPageUrlIs(string webPageUrl)
        {
            url = webPageUrl;
        }
        
        [When(@"I grab it")]
        public void WhenIGrabIt()
        {
            executionResult = PhantomJsWorker.GrabWebPageToPDF(url);
        }
        
        [Then(@"there I will get informed with the pdf path")]
        public void ThenThereIWillGetInformedWithThePdfPath()
        {
            Trace.WriteLine(string.Format("Start Info Arguments:\r\n{0}", executionResult.StartInfo.Arguments));
            Trace.WriteLine(string.Format("Standard Output:\r\n{0}", executionResult.OutputMessage));
            Trace.WriteLine(string.Format("Standard Error:\r\n{0}", executionResult.ErrorMessage));

            Assert.IsTrue(!string.IsNullOrEmpty(executionResult.OutputFilePaths[0]));

            var regex = new Regex(@"GrabWebPageToPDF_[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}\.pdf");

            //Assert.IsTrue(regex.IsMatch(_executionOutput.OutputFilePaths[0]),
            //string.Format("Actual output file path is : {0}", _executionOutput.OutputFilePaths[0]));

            Assert.IsTrue(File.Exists(executionResult.OutputFilePaths[0]));

            File.Delete(executionResult.OutputFilePaths[0]);
        }
    }
}
