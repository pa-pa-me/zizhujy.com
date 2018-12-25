using System.IO;
using System.Web.Mvc;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class DeleteTempFiles : ActionFilterAttribute
    {
        public static readonly string TempFileList = "TempFileList";

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            if (filterContext.Result is FilePathResult)
            {
                var fileName = ((FilePathResult)filterContext.Result).FileName;

                filterContext.HttpContext.Response.Flush();
                filterContext.HttpContext.Response.End();

                File.Delete(fileName);
            }
            else
            {
                var filePathList = (string[])filterContext.HttpContext.Items[TempFileList];

                if (filePathList == null)
                {
                    return;
                }

                filterContext.HttpContext.Response.Flush();
                filterContext.HttpContext.Response.End();

                foreach (var path in filePathList)
                {
                    File.Delete(path);
                }
            }
        }
    }
}