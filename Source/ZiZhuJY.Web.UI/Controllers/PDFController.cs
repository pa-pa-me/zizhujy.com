using System;
using System.IO;
using System.Net.Mime;
using System.Web.Mvc;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Helpers;
using ZiZhuJY.PhantomJsWrapper;
using ZiZhuJY.Web.Controllers;
using ZiZhuJY.Web.UI.App_GlobalResources;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class PDFController : CommonControllerBase
    {
        [DeleteTempFiles]
        public ActionResult ViewPDF(string url, string format = "", string fileName = null)
        {
            // Always use ~/Bin folder as working directory for now, otherwise the phantomjs.exe won't be found;
            // At the same time, use another folder as the output folder, which can grants IIS 
            // the writing permission, while ~/Bin folder doesn't.
            var result = PhantomJsWorker.GrabWebPageToPDF(url, 
                Server.MapPath("~/Bin"), Server.MapPath("~/Temp"),
                fileName, format);

            if (result.Exception != null)
            {
                return Error(result.Exception.Message, new HandleErrorInfo(result.Exception, "PDF", "ViewPDF"));
            }

            if (!string.IsNullOrEmpty(result.ErrorMessage))
            {
                return Error(result.ErrorMessage,
                    new HandleErrorInfo(new Exception(result.ErrorMessage), "PDF", "ViewPDF"));
            }

            var filePath = result.OutputFilePaths[0];

            if (System.IO.File.Exists(filePath))
            {
                HttpContext.Items.Add(DeleteTempFiles.TempFileList, new[] { filePath });
                var fileContents = System.IO.File.ReadAllBytes(filePath);

                var contentDisposition = new ContentDisposition
                {
                    Inline = true,
                    FileName = Path.GetFileName(filePath)
                };

                Response.AppendHeader("Content-Disposition", contentDisposition.ToString());
                return new FileContentResult(fileContents, "application/pdf");
            }
            else
            {
                var ex =
                    new FileNotFoundException(
                        result.StartInfo.ToJson(),
                        filePath);

                if (string.IsNullOrEmpty(result.OutputMessage))
                {
                    result.OutputMessage =
                        "The file was not found, is it caused by write permission problem? For example, according to the default security setting, the IIS can't generate file to the '~/Bin' folder.";
                }

                return
                    Error(Application.Format_FailedToGetPDF.FormatWith(url,
                        result.OutputMessage), new HandleErrorInfo(ex, "PDF", "ViewPDF"));
            }
        }
    }
}
