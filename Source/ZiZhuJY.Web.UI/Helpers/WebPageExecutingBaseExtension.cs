using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.WebPages;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Core;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.Helpers
{
    public static class WebPageExecutingBaseExtension
    {
        public static string Localize(this WebPageExecutingBase page, string resourceKey, string defaultValue = null)
        {
            #region Precompiled
            return CompiledResources.GetResourceManager(page.VirtualPath).GetString(resourceKey);
            #endregion

            #region Not precompiled
            var localResourceObject = HttpContext.GetLocalResourceObject(page.VirtualPath, resourceKey);

            if (localResourceObject != null)
            {
                return localResourceObject.ToString();
            }
            else
            {
                return defaultValue ?? resourceKey;
            }
            #endregion
        }

        public static string FileContent(this WebPageExecutingBase page, string fileVirtualPath, bool localize = true)
        {
            var pageFolder =
                HttpContext.Current.Server.MapPath(page.VirtualPath);

            var filePath = Path.Combine(
                Path.GetDirectoryName(pageFolder),
                fileVirtualPath);

            var result = File.ReadAllText(filePath);

            if (localize)
            {
                var regex = new Regex(@"@this.Localize\(""([^""]+)""\)");

                result = regex.Replace(result, match =>
                {
                    if (match.Groups.Count > 1)
                    {
                        var localized = Localize(page, match.Groups[1].Value);

                        return localized;
                    }
                    else
                    {
                        return match.Groups[0].Value;
                    }
                });
            }

            return result;
        }

        public static MvcHtmlString RenderCultureSelection(this WebViewPage page, string icon = "&#xe000;", string iconClass = "icon", string wrapperClass = "ui-widget", string wrapperId = "culture-selection",
            string selectId = "cultures")
        {
            var htmlString = @"<label for=""{5}"" class=""{0}"" style=""vertical-align: middle;"">{1}</label> <span class=""{3}"" id=""{4}"">{2}</span>"
                .FormatWith(
                    iconClass, icon,
                    page.Html.DropDownList(selectId, page.Html.GetAllAvailableCultureList(page.VirtualPath)),
                    wrapperClass, wrapperId, selectId);

            return new MvcHtmlString(htmlString);
        }

        public static MvcHtmlString RenderCommonMetas(this WebViewPage page, string keywordsResourceKey = "SeoKeywords",
            string descriptionResourceKey = "SeoDescription", string robotsContent = "index, follow")
        {
            return page.Html.RenderCommonMetas(page, keywordsResourceKey, descriptionResourceKey, robotsContent);
        }
    }
}