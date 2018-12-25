using System;
using System.IO;
using System.Web.Mvc;

namespace ZiZhuJY.Web.UI.Controllers
{

    [Authorize(Roles = "Administrators")]
    public class FileServiceController : Controller
    {
        //
        // GET: /FileService/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /FileService/DownloadFile?sourceVirtualPath=sourcePath

        public string DownloadFile(string sourceVirtualPath)
        {
            try
            {
                Response.AppendHeader("Content-Disposition", string.Format("attachment; filename={0}", Path.GetFileName(Server.MapPath(sourceVirtualPath))));
                Response.TransmitFile(Server.MapPath(sourceVirtualPath));
                Response.End();

                return "Donwload successfully.";
            }
            catch (Exception ex)
            {
                return string.Format("Error occurred: {0}\r\nSource: {1}\r\n{2}", ex.Message, ex.Source, ex.StackTrace);
            }
        }
    }
}
