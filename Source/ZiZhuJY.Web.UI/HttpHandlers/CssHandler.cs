using System;
using System.IO;
using System.Net;
using System.Security;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Caching;

namespace ZiZhuJY.Web.UI.HttpHandlers
{
    /// <summary>
    /// Removes whitespace in all stylesheets added to the header of the HTML document.
    /// </summary>
    public class CssHandler : IHttpHandler
    {
        #region Properties

        /// <summary>
        ///     Gets a value indicating whether another request can use the <see cref="T:System.Web.IHttpHandler"></see> instance.
        /// </summary>
        /// <value></value>
        /// <returns>true if the <see cref="T:System.Web.IHttpHandler"/> instance is reusable; otherwise, false.</returns>
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        #endregion

        #region Implemented Interfaces

        /// <summary>
        /// Enables processing of HTTP Web request by a custom 
        ///     HttpHandler that implements the <see cref="T:System.Web.IHttpHandler"/> interface.
        /// </summary>
        /// <param name="context">
        /// An <see cref="T:System.Web.HttpContext"/> object that provides 
        ///     references to the intrinsic server objects
        ///     (for example, Request, Response, Session, and Server) used to server HTTP requests.
        /// </param>
        public void ProcessRequest(HttpContext context)
        {
            var request = context.Request;
            string path = request.Path;

            if (!string.IsNullOrEmpty(path))
            {
                if (StringComparer.InvariantCultureIgnoreCase.Compare(Path.GetExtension(path), ".css") != 0)
                {
                    throw new SecurityException("Invalid CSS file extension");
                }

                string rawUrl = request.RawUrl.Trim();
                string cacheKey = request.RawUrl.Trim();
                string css = (string)context.Cache[cacheKey];
                //bool minify = ((request.QueryString["minify"] != null) && (request.QueryString["minify"].ToString().Trim() != "false"));
                bool minify = true;
                if (rawUrl.Contains(".min.js"))
                {
                    minify = false;
                }
                else if ((request.QueryString["minify"] != null)
                   && string.Equals(request.QueryString["minify"].ToString().Trim(), "false", StringComparison.OrdinalIgnoreCase)
                   && request.QueryString["password"] != null
                   && request.QueryString["password"].ToString().Trim().Equals("532154"))
                {
                    // Protect javascript from now (2013-6-9) on!
                    minify = false;
                }

#if DEBUG
                minify = false;
#endif

                if (String.IsNullOrEmpty(css))
                {
                    css = RetrieveLocalCss(path, cacheKey, minify);
                }

                // Make sure css isn't empty
                if (css != null)
                {
                    // Configure response headers
                    SetHeaders(css.GetHashCode(), context);

                    context.Response.Write(css);
                }
                else
                {
                    context.Response.Status = "404 Bad Request";
                }
            }
        }

        #endregion

        #region Methods

        /// <summary>
        /// This will make the browser and server keep the output
        ///     in its cache and thereby improve performance.
        /// </summary>
        /// <param name="hash">
        /// The hash number.
        /// </param>
        /// <param name="context">
        /// The context.
        /// </param>
        private static void SetHeaders(int hash, HttpContext context)
        {

            var response = context.Response;
            response.ContentType = "text/css";

            var cache = response.Cache;
            cache.VaryByHeaders["Accept-Encoding"] = true;

            cache.SetExpires(DateTime.Now.ToUniversalTime().AddDays(7));
            cache.SetMaxAge(new TimeSpan(7, 0, 0, 0));
            cache.SetRevalidation(HttpCacheRevalidation.AllCaches);

            var etag = string.Format("\"{0}\"", hash);
            var incomingEtag = context.Request.Headers["If-None-Match"];

            cache.SetETag(etag);
            cache.SetCacheability(HttpCacheability.Public);

            if (String.Compare(incomingEtag, etag) != 0)
            {
                return;
            }

            response.Clear();
            response.StatusCode = (int)HttpStatusCode.NotModified;
            response.SuppressContent = true;
        }

        /// <summary>
        /// Retrieves the local CSS from the disk
        /// </summary>
        /// <param name="file">
        /// The file name.
        /// </param>
        /// <param name="cacheKey">
        /// The key used to insert this script into the cache.
        /// </param>
        /// <returns>
        /// The retrieve local css.
        /// </returns>
        private static string RetrieveLocalCss(string file, string cacheKey, bool minify)
        {
            var path = HttpContext.Current.Server.MapPath(file);
            try
            {
                string css;
                using (var reader = new StreamReader(path))
                {
                    css = reader.ReadToEnd();
                }

                css = ProcessCss(css, minify);
                HttpContext.Current.Cache.Insert(cacheKey, css, new CacheDependency(path));

                return css;
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Call this method to do any post-processing on the css before its returned in the context response.
        /// </summary>
        /// <param name="css"></param>
        /// <returns></returns>
        private static string ProcessCss(string css, bool minify)
        {
            if (minify)
            {
                css = StripWhitespace(css);
                return css;
            }
            else
            {
                return css;
            }
        }

        /// <summary>
        /// Strips the whitespace from any .css file.
        /// </summary>
        /// <param name="body">
        /// The body string.
        /// </param>
        /// <returns>
        /// The strip whitespace.
        /// </returns>
        private static string StripWhitespace(string body)
        {

            body = body.Replace("  ", " ");
            body = body.Replace(Environment.NewLine, String.Empty);
            body = body.Replace("\t", string.Empty);
            body = body.Replace(" {", "{");
            body = body.Replace(" :", ":");
            body = body.Replace(": ", ":");
            body = body.Replace(", ", ",");
            body = body.Replace("; ", ";");
            body = body.Replace(";}", "}");

            // sometimes found when retrieving CSS remotely
            // body = body.Replace(@"?", string.Empty);

            // body = Regex.Replace(body, @"/\*[^\*]*\*+([^/\*]*\*+)*/", "$1");
            body = Regex.Replace(
                body, @"(?<=[>])\s{2,}(?=[<])|(?<=[>])\s{2,}(?=&nbsp;)|(?<=&ndsp;)\s{2,}(?=[<])", String.Empty);

            // Remove comments from CSS
            body = Regex.Replace(body, @"/\*[\d\D]*?\*/", string.Empty);

            return body;
        }

        #endregion
    }
}