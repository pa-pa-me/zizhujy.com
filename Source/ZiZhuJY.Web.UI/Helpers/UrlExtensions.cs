using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace ZiZhuJY.Web.UI.Helpers
{
    public static class UrlExtensions
    {
        public static string Content(this UrlHelper urlHelper, string contentPath, bool toAbsolute = false)
        {
            var path = urlHelper.Content(contentPath);
            var url = new Uri(HttpContext.Current.Request.Url, path);

            return url.AbsoluteUri;
        }

        public static string RandomContent(this UrlHelper urlHelper, string contentDirectory, bool toAbsolute = false)
        {
            var directoryInfo = new DirectoryInfo(HttpContext.Current.Server.MapPath(contentDirectory));
            if (directoryInfo.Exists)
            {
                var fileList = directoryInfo.GetFiles();

                var virtualPath = ReverseMapPath(fileList[new Random().Next(0, fileList.Length)].FullName);

                return urlHelper.Content(virtualPath, toAbsolute);
            }
            else
            {
                throw new ArgumentException("contentDirectory is not a valid directory path.", "contentDirectory");
            }
        }

        private static string ReverseMapPath(string path)
        {
            var appPath = HttpContext.Current.Server.MapPath("~");

            if (appPath.EndsWith("\\"))
            {
                appPath = appPath.Substring(0, appPath.Length - 1);
            }

            if (path.StartsWith(appPath))
            {
                var virtualPath = string.Format("~/{0}", path.Substring(appPath.Length).Replace("\\", "/"));

                return virtualPath;
            }
            else
            {
                return path;
            }
        }
    }
}