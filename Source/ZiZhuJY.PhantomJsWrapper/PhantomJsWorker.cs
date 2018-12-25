using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using ZiZhuJY.Helpers;

namespace ZiZhuJY.PhantomJsWrapper
{
    public class PhantomJsWorker
    {
        public static PhantomJsExecutionResult GrabWebPageToPDF(string url, string workingDirectory = null, string outputFilePath = null, string outputFileName = null, string format = "")
        {
            // Command line input example:
            // phantomjs.exe rasterize.js 'http://zizhujy.com' zizhujy.pdf A4,landscape
            using (var process = new Process())
            {
                workingDirectory = workingDirectory ?? Directory.GetCurrentDirectory();
                outputFilePath = outputFilePath ?? workingDirectory;
                // Auto generate a file name if empty
                outputFileName = outputFileName ?? string.Format("GrabWebPageToPDF_{0}.pdf", Guid.NewGuid());

                outputFileName = outputFileName.Replace(' ', '_').Replace("'", "");

                var outputFileFullName = Path.Combine(outputFilePath, outputFileName);

                var extension = Path.GetExtension(outputFileFullName);
                if (!extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    throw new ArgumentException(
                        string.Format(
                            "File extension is not supported. Currently only support '{0}', but got a '{1}.'",
                            ".pdf", extension),
                        "outputFileName");
                }

                var startInfo = new ProcessStartInfo()
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    FileName =
                        Path.Combine(workingDirectory, ConfigurationManager.AppSettings["PhantomJSExeVirtualPath"]),
                    Arguments = string.Format("{0} '{1}' '{2}' {3}",
                        Path.Combine(workingDirectory,
                            ConfigurationManager.AppSettings["GrabWebPageToPDFJsScriptVirtualPath"]),
                        url, outputFileFullName, format)
                };

                process.StartInfo = startInfo;

                var result = new PhantomJsExecutionResult()
                {
                    WorkingDirectory = workingDirectory,
                    StartInfo = startInfo,
                    OutputFilePaths = new[] { outputFileFullName }
                };

                try
                {
                    process.Start();
                    process.PriorityClass = ProcessPriorityClass.BelowNormal;
                    var output = process.StandardOutput.ReadToEnd();
                    var error = process.StandardError.ReadToEnd();

                    result.ErrorMessage = error;
                    result.OutputMessage = output;

                    if (!process.WaitForExit((int)TimeSpan.FromMinutes(5).TotalMilliseconds))
                    {
                        throw new TimeoutException(Resources.Application.TimeoutWhenGrabingPDF);
                    }
                }
                catch (Exception ex)
                {
                    result.Exception = new Exception(result.StartInfo.ToJson(), ex);
                }

                return result;
            }
        }

        public class PhantomJsExecutionResult
        {
            public string WorkingDirectory { get; set; }
            public ProcessStartInfo StartInfo { get; set; }
            public string OutputMessage { get; set; }
            public string ErrorMessage { get; set; }
            public Exception Exception { get; set; }
            public string[] OutputFilePaths { get; set; }
        }
    }
}
