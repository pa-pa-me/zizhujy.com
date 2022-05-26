using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.WebPages;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Common.Helpers;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Helpers
{
    public static class HtmlExtensions
    {
        private static WebViewPage GetWebViewPage(this HtmlHelper html)
        {
            try
            {
                return (WebViewPage)html.ViewDataContainer;
            }
            catch (Exception ex)
            {
                throw new Exception("Are you not using Razor engine? This method is only for Razor Engine!", ex);
            }
        }

        public static string Localize(this HtmlHelper html, string resourceKey, string defaultValue = null)
        {
            var page = html.GetWebViewPage();
            return page.Localize(resourceKey, defaultValue);
        }


        [Obsolete]
        public static string Localize(this HtmlHelper html, WebPageExecutingBase page, string resourceKey, string defaultValue = null)
        {

            return page.Localize(resourceKey, defaultValue);
        }

        public static bool AdsEnabled(this HtmlHelper html)
        {
            var adsFree = HttpContext.Current.Request.QueryString["adsFree"];

            return adsFree == null
                   || (!adsFree.Equals("True", StringComparison.OrdinalIgnoreCase)
                       && !adsFree.Equals("1", StringComparison.OrdinalIgnoreCase));
        }

        public static MvcHtmlString RenderAds(this HtmlHelper html, string adsCode)
        {
            if (html.AdsEnabled())
            {
                var renderedHtml =
                    HttpContext.Current.Request.IsLocal
                        ? @"<div style=""background-color: Blue; width: 100%; height: 100%;""></div>"
                        : adsCode;

                return new MvcHtmlString(renderedHtml);
            }
            else
            {
                return new MvcHtmlString(string.Empty);
            }
        }

        public static MvcHtmlString RenderAds(this HtmlHelper html, string adsCode, string wrapperClass, string wrapperStyle)
        {
            if (html.AdsEnabled())
            {
                var renderedHtml = @"<div class=""{1}"" style=""{2}"">
                                        {0}
                                    </div>"
                    .FormatWith(
                        HttpContext.Current.Request.IsLocal
                            ? @"<div style=""background-color: Blue; width: 100%; height: 100%;""></div>"
                            : adsCode,
                        wrapperClass,
                        wrapperStyle
                    );

                return new MvcHtmlString(renderedHtml);
            }
            else
            {
                return new MvcHtmlString(string.Empty);
            }
        }

        public static MvcHtmlString RenderKeywords(this HtmlHelper html, string content = "")
        {
            var htmlText = @"<meta name=""keywords"" content=""{0}"" />"
                .FormatWith(content);

            return new MvcHtmlString(htmlText);
        }

        public static MvcHtmlString RenderDescription(this HtmlHelper html, string content = "")
        {
            var htmlText = @"<meta name=""description"" content=""{0}"" />"
                .FormatWith(content);

            return new MvcHtmlString(htmlText);
        }

        public static MvcHtmlString RenderRobots(this HtmlHelper html, string content = "index, follow")
        {
            var htmlText = @"<meta name=""robots"" content=""{0}"" />"
                .FormatWith(content);

            return new MvcHtmlString(htmlText);
        }

        public static MvcHtmlString RenderCommonMetas(this HtmlHelper html, string keywordsResourceKey = "SeoKeywords",
            string descriptionResourceKey = "SeoDescription",
            string robotsContent = "index, follow")
        {
            var page = html.GetWebViewPage();
            return html.RenderCommonMetas(page, keywordsResourceKey, descriptionResourceKey, robotsContent);
        }

        public static MvcHtmlString RenderCommonMetas(this HtmlHelper html, WebPageExecutingBase page,
            string keywordsResourceKey = "SeoKeywords", string descriptionResourceKey = "SeoDescription",
            string robotsContent = "index, follow")
        {
            var htmlText = @"{0}{1}{2}".FormatWith(
                html.RenderKeywords(page.Localize(keywordsResourceKey)),
                html.RenderDescription(page.Localize(descriptionResourceKey)),
                html.RenderRobots(robotsContent));

            return new MvcHtmlString(htmlText);
        }

        public static MvcHtmlString ItemLink(this HtmlHelper html, string href, string text,
            string title, string onclick = null,
            LinkTarget target = LinkTarget.Self)
        {
            var htmlText = @"<a href=""{0}"" target=""{1}"" {2}{3}>{4}</a>"
                .FormatWith(href, target,
                !string.IsNullOrEmpty(title) ? " title=\"{0}\"".FormatWith(title) : string.Empty,
                    !string.IsNullOrWhiteSpace(onclick) ? " onclick=\"{0}\"".FormatWith(onclick) : string.Empty,
                    text);

            return new MvcHtmlString(htmlText);
        }

        public static MvcHtmlString ItemLink(this HtmlHelper html, string href, string text,
            LinkTarget target = LinkTarget.Self)
        {
            return ItemLink(html, href, text, text, null, target);
        }

        public static MvcHtmlString ScriptItemLink(this HtmlHelper html, string onclick, string text,
            string title = null, LinkTarget target = LinkTarget.Self)
        {
            if (!onclick.TrimEnd().EndsWith("return false;"))
            {
                onclick += "; return false;";
            }

            return ItemLink(html, "javascript:void(0)", text, title ?? text, onclick, target);
        }

        public static IHtmlString Markdown(this HtmlHelper html, string source, Dictionary<string, object> options = null)
        {
            var markdown = new MarkdownDeep.Markdown
            {
                ExtraMode = true,
            };

            if (options != null)
            {
                if (options.ContainsKey("UrlBaseLocation"))
                {
                    markdown.UrlBaseLocation = options["UrlBaseLocation"].ToString();
                }

                if (options.ContainsKey("NewWindowForExternalLinks"))
                {
                    markdown.NewWindowForExternalLinks = (bool)options["NewWindowForExternalLinks"];
                }
            }

            //markdown.FormatCodeSpan = (md, s) =>
            //{
            //    const string template = "<pre{0}>{1}</pre>";

            //    var match = Regex.Match(s, @"^(javascript)\r?\n(.*)",
            //        RegexOptions.IgnoreCase | RegexOptions.Singleline);

            //    var @class = String.Empty;
            //    var content = s;
            //    if (match.Success)
            //    {
            //        @class = @" class=""brush: {0}""".FormatWith(match.Groups[1].Value.ToLower());
            //        content = match.Groups[2].Value;
            //    }

            //    return template.FormatWith(@class, content);
            //};

            markdown.FormatCodeBlock = (md, s, remark) =>
            {
                const string template = "<pre{0}>{1}</pre>";
                var @class = string.Empty;

                if (!string.IsNullOrWhiteSpace(remark))
                {
                    @class = @" class=""brush: {0}""".FormatWith(remark.ToLower());
                }

                return template.FormatWith(@class, s);
            };

            var output = markdown.Transform(source);

            // Auto link:
            const string urlPattern =
                @"(?:http://|https://|ftp://|//)(?:[\w-_]+\.)+(?:[\w]{2,4})(?:/[^/\s\r\n\b""'`]+)*(?:/)?";

            output = Regex.Replace(output,
                @"(?<=<p(?:\s+[^<>]*)*>[^<>]*)(" + urlPattern + @")(?=[^<>]*</p>)",
                @"<a href=""$1"" target=""_blank"">$1</a>");

            return html.Raw(output);
        }

        public static MvcHtmlString RenderJavaScripts(this HtmlHelper html, params string[] paths)
        {
            return RenderJavaScripts(html, BundleTable.EnableOptimizations, paths);
        }

        public static MvcHtmlString RenderJavaScripts(this HtmlHelper html, bool appendHash, params string[] paths)
        {
            return RenderReferences(html, @"<script type=""text/javascript"" src=""{0}""></script>",
                appendHash, paths);
        }

        public static MvcHtmlString RenderCsses(this HtmlHelper html, params string[] paths)
        {
            return RenderCsses(html, BundleTable.EnableOptimizations, paths);
        }

        public static MvcHtmlString RenderCssesForMedia(this HtmlHelper html, string media, params string[] paths)
        {
            return RenderCssesForMedia(html, media, BundleTable.EnableOptimizations, paths);
        }

        public static MvcHtmlString RenderCsses(this HtmlHelper html, bool appendHash, params string[] paths)
        {
            return RenderReferences(html,
                @"<link rel=""stylesheet"" type=""text/css"" href=""{0}"" />",
                appendHash, paths);
        }

        public static MvcHtmlString RenderCssesForMedia(this HtmlHelper html, string media, bool appendHash,
            params string[] paths)
        {
            return RenderReferences(html,
                @"<link rel=""stylesheet"" type=""text/css"" href=""{{0}}"" media=""{0}"" />"
                    .FormatWith(media),
                appendHash, paths);
        }

        public static MvcHtmlString RenderReferences(this HtmlHelper html, string htmlTagTemplate,
            bool appendHash, params string[] referencePaths)
        {
            var urlHelper = new UrlHelper(html.ViewContext.RequestContext);
            var sb = new StringBuilder();

            foreach (var path in referencePaths)
            {
                var url = path;

                if (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                    url.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
                    url.StartsWith("//", StringComparison.InvariantCultureIgnoreCase))
                {
                    // External files, no hash appending process
                    sb.Append(string.Format(htmlTagTemplate, url));
                }
                else
                {
                    Bundle bundle = null;

                    if (url.StartsWith("~"))
                    {
                        // Is the path provided a bundle path?
                        bundle = BundleTable.Bundles.GetBundleFor(url);
                    }

                    if (bundle != null)
                    {
                        if (bundle is StyleBundle)
                        {
                            sb.Append(Styles.Render(url));
                        }
                        else if (bundle is ScriptBundle)
                        {
                            sb.Append(Scripts.Render(url));
                        }
                    }
                    else
                    {
                        url = urlHelper.Content(url);

                        if (appendHash)
                        {
                            // TODO: handle proxy url
                            try
                            {
                                var filePath = HttpContext.Current.Server.MapPath(path);

                                url = "{0}?v={1}".FormatWith(url, FileHashHelper.GetFileHash(filePath));
                            }
                            catch (Exception)
                            {
                                url = url;
                            }
                        }

                        sb.Append(string.Format(htmlTagTemplate, url));
                    }
                }
            }

            return new MvcHtmlString(sb.ToString());
        }

        [Obsolete]
        public static string FileContent(this HtmlHelper html, string filePath)
        {
            return File.ReadAllText(filePath);
        }

        public static string GetUrlWithQueryString(this HtmlHelper html, string action, string controller, IDictionary<string, object> queryStrings)
        {
            var rvd = new RouteValueDictionary(html.ViewContext.RouteData.Values);
            var request = html.ViewContext.RequestContext.HttpContext.Request;

            if (request.Url == null)
            {
                throw new Exception("Current Request Url is null!");
            }

            foreach (string key in request.QueryString.Keys)
            {
                rvd[key] = request.QueryString[key];
            }

            foreach (var key in queryStrings.Keys)
            {
                rvd[key] = queryStrings[key];
            }

            var url = new UrlHelper(html.ViewContext.RequestContext);
            return url.Action(action, controller, rvd, request.Url.Scheme, request.Url.Host);
        }
    }

    public enum LinkTarget
    {
        [StringValue("_self")]
        Self,
        [StringValue("_blank")]
        New
    }
}