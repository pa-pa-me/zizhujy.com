using System;
using System.Web;
using System.Web.Mvc;
using ZiZhuJY.Web.UI.Utility;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class CompressContentAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            CompressResponse(filterContext);

            //base.OnActionExecuted(filterContext);
        }

        public static void CompressResponse(ActionExecutedContext filterContext)
        {
            ZiZhuJY.Helpers.Log.Info("Compressing Response");

            HttpResponse response = HttpContext.Current.Response;

            string acceptEncoding = HttpContext.Current.Request.Headers["Accept-Encoding"];

            if (!string.IsNullOrEmpty(acceptEncoding))
            {
                if (!(response.Filter is System.IO.Compression.GZipStream)
                    && !(response.Filter is System.IO.Compression.DeflateStream)
                    && !(response.Filter is HtmlWhitespaceRemovingHelper))
                {
                    if (acceptEncoding.Contains("gzip", StringComparison.InvariantCultureIgnoreCase))
                    {
                        response.Filter = new System.IO.Compression.GZipStream(response.Filter, System.IO.Compression.CompressionMode.Compress);
                        try
                        {
                            response.Headers.Remove("Content-Encoding");
                            response.AppendHeader("Content-Encoding", "gzip");
                        }
                        catch
                        {
                            try
                            {
                                response.AppendHeader("Content-Encoding", "gzip");
                                response.Headers["Content-Encoding"] = "gzip";
                            }
                            catch
                            {
                            }
                            finally
                            {
                                //filterContext.Exception = null;
                                //filterContext.ExceptionHandled = false;
                            }
                        }
                        finally { }

                        return;
                    }

                    if (acceptEncoding.Contains("deflate", StringComparison.InvariantCultureIgnoreCase))
                    {
                        response.Filter = new System.IO.Compression.DeflateStream(response.Filter, System.IO.Compression.CompressionMode.Compress);
                        try
                        {
                            response.Headers.Remove("Content-Encoding");
                            response.AppendHeader("Content-Encoding", "deflate");
                        }
                        catch
                        {
                            try
                            {
                                response.AppendHeader("Content-Encoding", "gzip");
                                response.Headers["Content-Encoding"] = "deflate";
                            }
                            catch
                            {
                            }
                            finally
                            {
                            }
                        }
                        finally { }

                        return;
                    }
                }
            }

        }
    }
}