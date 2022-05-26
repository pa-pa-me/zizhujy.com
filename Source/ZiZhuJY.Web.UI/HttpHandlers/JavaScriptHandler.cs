using System;
using System.IO;
using System.Net;
using System.Security;
using System.Web;
using System.Web.Caching;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.HttpHandlers
{
    /// <summary>
    /// Removes whitespace in all stylesheets added to the handler of the HTML document
    /// </summary>
    /// <remarks>
    /// 
    /// This handler uses an external library to perform minification of scripts.
    /// See the ZiZhuJY.Web.UI.Utility.JavascriptMinifier class for more details.
    /// 
    /// </remarks>
    public class JavaScriptHandler : IHttpHandler
    {
        #region Properties

        /// <summary>
        ///     Gets a value indicating whether another request can use the <see cref="T:System.Web.IHttpHandler"></see> instance.
        /// </summary>
        /// <value></value>
        /// <returns>true if the <see cref="T:System.Web.IHttpHandler"/> instance is reusable; otherwise, false.</returns>
        public bool IsReusable
        {
            get { return false; }
        }

        #endregion

        #region Implemented Interfaces

        /// <summary>
        /// Enables processing of HTTP Web requests by a custom
        ///     HttpHandler that implements the <see cref="T:System.Web.IHttpHandler"/> interface.
        /// </summary>
        /// <param name="context">
        /// An <see cref="T:System.Web.HttpContext"/> object that provides
        ///     references to the intrinsic server objects
        ///     (for example, Request, Response, Session, and Server) used to service HTTP requests.
        /// </param>
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                var request = context.Request;
                string path = request.Path;

                if (string.IsNullOrEmpty(path))
                {
                    return;
                }

                string rawUrl = request.RawUrl.Trim();
                string cacheKey = context.Server.HtmlDecode(rawUrl);
                string script = (string) context.Cache[cacheKey];
                //bool minify = ((request.QueryString["minify"] != null) && (request.QueryString["minify"].ToString().Trim() != "false"));
                bool minify = true;
                if (rawUrl.Contains(".min.js"))
                {
                    minify = false;
                }
                else if ((request.QueryString["minify"] != null)
                         &&
                         string.Equals(request.QueryString["minify"].ToString().Trim(), "false",
                             StringComparison.OrdinalIgnoreCase)
                         && request.QueryString["password"] != null
                         && request.QueryString["password"].ToString().Trim().Equals("532154"))
                {
                    // Protect javascript from now (2013-6-9) on!
                    minify = false;
                }

#if DEBUG
                minify = false;
#endif

                if (string.IsNullOrEmpty(script))
                {
                    script = RetrieveLocalScript(path, cacheKey, minify);
                }

                if (string.IsNullOrEmpty(script))
                {
                    // May be compressing error met.
                    return;
                }

                SetHeaders(script.GetHashCode(), context);
                context.Response.Write(script);
            }
            catch (Exception ex)
            {
                // Log it and then ignore
            }
        }

        #endregion

        #region Methods

        /// <summary>
        /// Retrieves the local script from the disk
        /// </summary>
        /// <param name="file">The file name.</param>
        /// <param name="cacheKey">The key used to insert this script into the cache.</param>
        /// <param name="minify">Whether or not the local script should be minified</param>
        /// <returns>The retrieved local script.</returns>
        private static string RetrieveLocalScript(string file, string cacheKey, bool minify)
        {
            if(StringComparer.OrdinalIgnoreCase.Compare(Path.GetExtension(file), ".js") != 0) {
                throw new SecurityException("No access");
            }

            var script = string.Empty;

            try{
                var path = HttpContext.Current.Server.MapPath(file);
                if(File.Exists(path)){
                    using (var reader = new StreamReader(path)){
                        script = reader.ReadToEnd();
                    }

                    script = ProcessScript(script, file, minify);
                    HttpContext.Current.Cache.Insert(cacheKey, script, new CacheDependency(path));
                    return script;
                }
            }catch(Exception ex) {
            }

            return script;
        }

        /// <summary>
        /// Call this method for any extra processing that needs to be done on a script resource before
        /// being wriiten to the response.
        /// </summary>
        /// <param name="script"></param>
        /// <param name="filePath"></param>
        /// <param name="shouldMinify"></param>
        /// <returns></returns>
        private static string ProcessScript(string script, string filePath, bool shouldMinify)
        {
            if ((shouldMinify))
            {
                var min = new JavascriptMinifier();
                // Variable minification would bring some problems to js, so 
                // keep this option be VariableMinification.None for safer!
                min.VariableMinification = VariableMinification.None;

                return min.Minify(script);
            }
            else
            {
                return script;
            }
        }

        private static void SetHeaders(int hash, HttpContext context)
        {
            var response = context.Response;
            response.ContentType = "text/jvascript";
            var cache = response.Cache;
            cache.VaryByHeaders["Accept-Encoding"] = true;
            cache.SetExpires(DateTime.Now.ToUniversalTime().AddDays(7));
            cache.SetMaxAge(new TimeSpan(7, 0, 0, 0));
            cache.SetRevalidation(HttpCacheRevalidation.AllCaches);

            var etag = string.Format("\"{0}\"", hash);
            var incomingEtag = context.Request.Headers["If-None-Match"];

            cache.SetETag(etag);
            cache.SetCacheability(HttpCacheability.Public);

            if (string.Compare(incomingEtag, etag) != 0)
            {
                return;
            }

            response.Clear();
            response.StatusCode = (int)HttpStatusCode.NotModified;
            response.SuppressContent = true;
        }

        #endregion
    }
}