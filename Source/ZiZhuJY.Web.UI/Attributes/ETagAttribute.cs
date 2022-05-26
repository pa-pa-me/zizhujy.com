using System;
using System.IO;
using System.Security.Cryptography;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Web.UI.Attributes
{
    public sealed class ETagAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!filterContext.HttpContext.Request.HttpMethod.Equals("GET", StringComparison.OrdinalIgnoreCase))
            {
                base.OnActionExecuting(filterContext);
                return;
            }

            var cachedETag = GetCachedETagForCurrentRequest();
            var requestedETag = GetRequestedETag();

            if (cachedETag == null || !cachedETag.Equals(requestedETag))
            {
                var response = filterContext.HttpContext.Response;
                response.Filter = new ETagFilter(response.Filter);
            }
            else
            {
                // Not modified
                filterContext.HttpContext.Response.StatusCode = 304;
                filterContext.HttpContext.Response.StatusDescription = "Not Modified";
                filterContext.HttpContext.Response.SuppressContent = true;

                // Set the same ETag again?
                SetETagToCurrentResponse(cachedETag);
            }
        }

        private static string GetRequestedETag()
        {
            return HttpContext.Current.Request.Headers["If-None-Match"];
        }

        private static string GetCachedETagForCurrentRequest()
        {
            var requestId = GetRequestId(HttpContext.Current.Request);

            return (string)HttpRuntime.Cache.Get(requestId);
        }

        private static string GetRequestId(HttpRequest request)
        {
            return "ETagCacheOf {0} {1}".FormatWith(request.HttpMethod, request.RawUrl);
        }

        private static string GetToken(byte[] array)
        {
            var checksum = MD5.Create().ComputeHash(array);
            return Convert.ToBase64String(checksum, 0, checksum.Length);
        }

        private static void SetETagToCurrentResponse(string etag)
        {
            HttpContext.Current.Response.Cache.SetETag(etag);
            HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.ServerAndPrivate);

            HttpRuntime.Cache.Insert(GetRequestId(HttpContext.Current.Request), etag,
                null, DateTime.UtcNow.AddDays(30), Cache.NoSlidingExpiration);
        }

        public sealed class ETagFilter : MemoryStream
        {
            private readonly MemoryStream _stream;
            private readonly Stream _filter;

            public ETagFilter(Stream filter)
            {
                _stream = new MemoryStream();
                this._filter = filter;
            }

            public override void Write(byte[] buffer, int offset, int count)
            {
                _filter.Write(buffer, offset, count);
                // Copy
                _stream.Write(buffer, offset, count);
            }

            public override void Close()
            {
                SetETagToCurrentResponse(GetToken(_stream.ToArray()));

                base.Close();
            }
        }
    }
}