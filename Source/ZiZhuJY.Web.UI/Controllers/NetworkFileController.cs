using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Common.Helpers;
using ZiZhuJY.Web.Controllers;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class NetworkFileController : CommonControllerBase
    {
        public ActionResult Get(string url, string fileName, string contentType)
        {
            var fileContents = NetworkFileHelper.GetNetworkFileBinaryContent(url);

            if (string.IsNullOrWhiteSpace(fileName))
            {
                fileName = GetFileNameFromUrl(url);
            }

            if (string.IsNullOrWhiteSpace(contentType))
            {
                contentType = fileExtensionContentTypeMapping.GetValue(Path.GetExtension(fileName).ToLower());
            }

            var contentDisposition = new ContentDisposition
            {
                Inline = true,
                FileName = fileName
            };

            Response.AddHeader("Content-Disposition", contentDisposition.ToString());

            return new FileContentResult(fileContents, contentType);
        }

        private readonly Dictionary<string, string> fileExtensionContentTypeMapping = new Dictionary<string, string>()
        {
            {".css", "text/css"}
        };

        private static string GetFileNameFromUrl(string url)
        {
            return url.Substring(url.LastIndexOf("/") + 1);
        }

    }
}
