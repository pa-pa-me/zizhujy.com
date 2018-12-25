using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Core;

namespace ZiZhuJY.Web.UI.Utility
{
    public static class CultureSelectionHelper
    {
        public class CultureRoute
        {
            public string Url { get; set; }
            public string ActionName { get; set; }
            public string ControllerName { get; set; }
            public RouteValueDictionary RouteValues { get; set; }
            public bool IsSelected { get; set; }

            public MvcHtmlString HtmlSafeUrl
            {
                get
                {
                    return MvcHtmlString.Create(Url);
                }
            }

        }

        public static CultureRoute CultureUrl(this HtmlHelper helper, string cultureName, string cultureRouteName = "culture", bool strictSelected = false)
        {
            // set the input culture to lower
            cultureName = cultureName.ToLower();
            // retrieve the route values from the view context
            var routeValues = new RouteValueDictionary(helper.ViewContext.RouteData.Values);
            // copy the query strings into the route values to generate the link
            var queryString = helper.ViewContext.HttpContext.Request.QueryString;
            foreach (var key in queryString.Cast<string>().Where(key => queryString[key] != null && !string.IsNullOrWhiteSpace(key)))
            {
                if (routeValues.ContainsKey(key))
                {
                    routeValues[key] = queryString[key];
                }
                else
                {
                    routeValues.Add(key, queryString[key]);
                }
            }
            var actionName = routeValues["action"].ToString();
            var controllerName = routeValues["controller"].ToString();
            // set the culture into route values
            routeValues[cultureRouteName] = cultureName;
            // generate the culture specify url
            var urlHelper = new UrlHelper(helper.ViewContext.RequestContext, helper.RouteCollection);
            var url = urlHelper.RouteUrl("Localization", routeValues);
            // check whether the current thread ui culture is this culture
            var currentCultureName = Thread.CurrentThread.CurrentUICulture.Name.ToLower();
            var isSelected = strictSelected ? currentCultureName == cultureName : currentCultureName.StartsWith(cultureName);

            return new CultureRoute() { Url = url, ActionName = actionName, ControllerName = controllerName, RouteValues = routeValues, IsSelected = isSelected };

        }

        public static MvcHtmlString CultureSelectionLink(this HtmlHelper helper, string cultureName, string selectedText, string unselectedText, IDictionary<string, object> htmlAttributes, string cultureRouteName = "culture", bool strictSelected = false)
        {
            var culture = helper.CultureUrl(cultureName, cultureRouteName, strictSelected);
            var link = helper.RouteLink(culture.IsSelected ? selectedText : unselectedText, "Localization", culture.RouteValues, htmlAttributes);
            return link;
        }

        public static MvcHtmlString CultureSelectionLink(this HtmlHelper helper, string cultureName, string selectedText, string unselectedText, IDictionary<string, object> selectedHtmlAttributes, IDictionary<string, object> unselectedHtmlAttributes, string cultureRouteName = "culture", bool strictSelected = false)
        {
            var culture = helper.CultureUrl(cultureName, cultureRouteName, strictSelected);
            var link = helper.RouteLink(culture.IsSelected ? selectedText : unselectedText, "Localization", culture.RouteValues, culture.IsSelected ? selectedHtmlAttributes : unselectedHtmlAttributes);
            return link;
        }
        
        public static string[] GetAllAvailableCultures(this HtmlHelper helper, string virtualPath, string resourceFolder = "App_LocalResources")
        {
            #region precompiled
            return CompiledResources.GetAvailableCulturesFor(virtualPath, resourceFolder, true);
            #endregion

            #region Not precompiled
            List<string> availableCultures = new List<string>();
            string cultureFilesFolder = Path.Combine(Path.GetDirectoryName(HostingEnvironment.MapPath(virtualPath)), resourceFolder);
            string currentViewName = Path.GetFileName(virtualPath);
            string[] fileNames = Directory.GetFiles(cultureFilesFolder, "*.resx", SearchOption.TopDirectoryOnly);
            bool hasDefaultCultureCode = false;
            foreach (string filePath in fileNames)
            {
                string fileName = Path.GetFileNameWithoutExtension(filePath);
                if (fileName.StartsWith(currentViewName, StringComparison.InvariantCultureIgnoreCase))
                {
                    string temp = fileName.TrimStart(currentViewName);
                    int cultureStart = temp.LastIndexOf(".");
                    if (cultureStart >= 0)
                    {
                        availableCultures.Add(temp.Substring(cultureStart + 1));
                    }
                    else
                    {
                        hasDefaultCultureCode = true;
                    }
                }
            }

            if (hasDefaultCultureCode)
            {
                string defaultCultureCode = LookupDefaultCultureCode(availableCultures);
                if (!string.IsNullOrWhiteSpace(defaultCultureCode))
                {
                    availableCultures.Add(defaultCultureCode);
                }
            }

            return availableCultures.ToArray();
            #endregion
        }


        public static SelectListItem[] GetAllAvailableCultureList(this HtmlHelper helper, string virtualPath, string resourceFolder = "App_LocalResources", string cultureRouteName = "culture", bool strictSelected = false)
        {
            var availableCultures = GetAllAvailableCultures(helper, virtualPath, resourceFolder);
            var list = new List<SelectListItem>();
            var selected = false;
            foreach (var cultureCode in availableCultures)
            {
                var culture = helper.CultureUrl(cultureCode, cultureRouteName, strictSelected);
                list.Add(new SelectListItem() { Text = LookupCultureName(cultureCode), Value = helper.CultureUrl(cultureCode, cultureRouteName, strictSelected).Url, Selected = culture.IsSelected });

                if (culture.IsSelected) selected = true;
            }

            if (!selected)
            {
                // Selete the default culture
                list[list.Count - 1].Selected = true;
            }

            return list.ToArray();
        }

        public static string LookupCultureName(string cultureCode)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                {"en-US", "English (United State)"},
                {"en", "English"},
                {"zh-CN", "中文（简体）"},
                {"zh", "中文"},
                {"af", "Afrikaans"},
                {"af-ZA", "Afrikaans - South Africa"},
                {"sq", "Albanian"},
                {"sq-AL", "Albanian - Albania"},
                {"ar", "Arabic"},
                {"ar-DZ", "Arabic - Algeria"},
                {"ar-BH", "Arabic - Bahrain"},
                {"ar-EG", "Arabic - Egypt"},
                {"ar-IQ", "Arabic - Iraq"},
                {"ar-JO", "Arabic - Jordan"},
                {"ar-KW", "Arabic - Kuwait"},
                {"ar-LB", "Arabic - Lebanon"},
                {"ar-LY", "Arabic - Libya"},
                {"ar-MA", "Arabic - Morocco"},
                {"ar-OM", "Arabic - Oman"},
                {"ar-QA", "Arabic - Qatar"},
                {"ar-SA", "Arabic - Saudi Arabia"},
                {"ar-SY", "Arabic - Syria"},
                {"ar-TN", "Arabic - Tunisia"},
                {"ar-AE", "Arabic - United Arab Emirates"},
                {"ar-YE", "Arabic - Yemen"},
                {"hy", "Armenian"},
                {"hy-AM", "Armenian - Armenia"},
                {"az", "Azeri"},
                {"az-AZ-Cyrl", "Azeri (Cyrillic) - Azerbaijan"},
                {"az-AZ-Latn", "Azeri (Latin) - Azerbaijan"},
                {"eu", "Basque"},
                {"eu-ES", "Basque - Basque"},
                {"be", "Belarusian"},
                {"be-BY", "Belarusian - Belarus"},
                {"bg", "Bulgarian"},
                {"bg-BG", "Bulgarian - Bulgaria"},
                {"ca", "Catalan"},
                {"ca-ES", "Catalan - Catalan"},
                {"zh-HK", "Chinese - Hong Kong SAR"},
                {"zh-MO", "Chinese - Macao SAR"},
                {"zh-CHS", "中文（简体）"},
                {"zh-SG", "Chinese - Singapore"},
                {"zh-TW", "中文（繁體）"},
                {"zh-CHT", "中文（繁體）"},
                {"hr", "Croatian"},
                {"hr-HR", "Croatian - Croatia"},
                {"cs", "Czech"},
                {"cs-CZ", "Czech - Czech Republic"},
                {"da", "Danish"},
                {"da-DK", "Danish - Denmark"},
                {"div", "Dhivehi"},
                {"div-MV", "Dhivehi - Maldives"},
                {"nl", "Dutch"},
                {"nl-BE", "Dutch - Belgium"},
                {"nl-NL", "Dutch - The Netherlands"},
                {"en-AU", "English - Australia"},
                {"en-BZ", "English - Belize"},
                {"en-CA", "English - Canada"},
                {"en-CB", "English - Caribbean"},
                {"en-IE", "English - Ireland"},
                {"en-JM", "English - Jamaica"},
                {"en-NZ", "English - New Zealand"},
                {"en-PH", "English - Philippines"},
                {"en-ZA", "English - South Africa"},
                {"en-TT", "English - Trinidad and Tobago"},
                {"en-GB", "English - United Kingdom"},
                {"en-ZW", "English - Zimbabwe"},
                {"et", "Estonian"},
                {"et-EE", "Estonian - Estonia"},
                {"fo", "Faroese"},
                {"fo-FO", "Faroese - Faroe Islands"},
                {"fa", "Farsi"},
                {"fa-IR", "Farsi - Iran"},
                {"fi", "Finnish"},
                {"fi-FI", "Finnish - Finland"},
                {"fr", "French"},
                {"fr-BE", "French - Belgium"},
                {"fr-CA", "French - Canada"},
                {"fr-FR", "French - France"},
                {"fr-LU", "French - Luxembourg"},
                {"fr-MC", "French - Monaco"},
                {"fr-CH", "French - Switzerland"},
                {"gl", "Galician"},
                {"gl-ES", "Galician - Galician"},
                {"ka", "Georgian"},
                {"ka-GE", "Georgian - Georgia"},
                {"de", "German"},
                {"de-AT", "German - Austria"},
                {"de-DE", "German - Germany"},
                {"de-LI", "German - Liechtenstein"},
                {"de-LU", "German - Luxembourg"},
                {"de-CH", "German - Switzerland"},
                {"el", "Greek"},
                {"el-GR", "Greek - Greece"},
                {"gu", "Gujarati"},
                {"gu-IN", "Gujarati - India"},
                {"he", "Hebrew"},
                {"he-IL", "Hebrew - Israel"},
                {"hi", "Hindi"},
                {"hi-IN", "Hindi - India"},
                {"hu", "Hungarian"},
                {"hu-HU", "Hungarian - Hungary"},
                {"is", "Icelandic"},
                {"is-IS", "Icelandic - Iceland"},
                {"id", "Indonesian"},
                {"id-ID", "Indonesian - Indonesia"},
                {"it", "Italian"},
                {"it-IT", "Italian - Italy"},
                {"it-CH", "Italian - Switzerland"},
                {"ja", "Japanese"},
                {"ja-JP", "Japanese - Japan"},
                {"kn", "Kannada"},
                {"kn-IN", "Kannada - India"},
                {"kk", "Kazakh"},
                {"kk-KZ", "Kazakh - Kazakhstan"},
                {"kok", "Konkani"},
                {"kok-IN", "Konkani - India"},
                {"ko", "Korean"},
                {"ko-KR", "Korean - Korea"},
                {"ky", "Kyrgyz"},
                {"ky-KG", "Kyrgyz - Kyrgyzstan"},
                {"lv", "Latvian"},
                {"lv-LV", "Latvian - Latvia"},
                {"lt", "Lithuanian"},
                {"lt-LT", "Lithuanian - Lithuania"},
                {"mk", "Macedonian"},
                {"mk-MK", "Macedonian - Former Yugoslav Republic of Macedonia"},
                {"ms", "Malay"},
                {"ms-BN", "Malay - Brunei"},
                {"ms-MY", "Malay - Malaysia"},
                {"mr", "Marathi"},
                {"mr-IN", "Marathi - India"},
                {"mn", "Mongolian"},
                {"mn-MN", "Mongolian - Mongolia"},
                {"no", "Norwegian"},
                {"nb-NO", "Norwegian (Bokmål) - Norway"},
                {"nn-NO", "Norwegian (Nynorsk) - Norway"},
                {"pl", "Polish"},
                {"pl-PL", "Polish - Poland"},
                {"pt", "Portuguese"},
                {"pt-BR", "Portuguese - Brazil"},
                {"pt-PT", "Portuguese - Portugal"},
                {"pa", "Punjabi"},
                {"pa-IN", "Punjabi - India"},
                {"ro", "Romanian"},
                {"ro-RO", "Romanian - Romania"},
                {"ru", "Russian"},
                {"ru-RU", "Russian - Russia"},
                {"sa", "Sanskrit"},
                {"sa-IN", "Sanskrit - India"},
                {"sr-SP-Cyrl", "Serbian (Cyrillic) - Serbia"},
                {"sr-SP-Latn", "Serbian (Latin) - Serbia"},
                {"sk", "Slovak"},
                {"sk-SK", "Slovak - Slovakia"},
                {"sl", "Slovenian"},
                {"sl-SI", "Slovenian - Slovenia"},
                {"es", "Spanish"},
                {"es-AR", "Spanish - Argentina"},
                {"es-BO", "Spanish - Bolivia"},
                {"es-CL", "Spanish - Chile"},
                {"es-CO", "Spanish - Colombia"},
                {"es-CR", "Spanish - Costa Rica"},
                {"es-DO", "Spanish - Dominican Republic"},
                {"es-EC", "Spanish - Ecuador"},
                {"es-SV", "Spanish - El Salvador"},
                {"es-GT", "Spanish - Guatemala"},
                {"es-HN", "Spanish - Honduras"},
                {"es-MX", "Spanish - Mexico"},
                {"es-NI", "Spanish - Nicaragua"},
                {"es-PA", "Spanish - Panama"},
                {"es-PY", "Spanish - Paraguay"},
                {"es-PE", "Spanish - Peru"},
                {"es-PR", "Spanish - Puerto Rico"},
                {"es-ES", "Spanish - Spain"},
                {"es-UY", "Spanish - Uruguay"},
                {"es-VE", "Spanish - Venezuela"},
                {"sw", "Swahili"},
                {"sw-KE", "Swahili - Kenya"},
                {"sv", "Swedish"},
                {"sv-FI", "Swedish - Finland"},
                {"sv-SE", "Swedish - Sweden"},
                {"syr", "Syriac"},
                {"syr-SY", "Syriac - Syria"},
                {"ta", "Tamil"},
                {"ta-IN", "Tamil - India"},
                {"tt", "Tatar"},
                {"tt-RU", "Tatar - Russia"},
                {"te", "Telugu"},
                {"te-IN", "Telugu - India"},
                {"th", "Thai"},
                {"th-TH", "Thai - Thailand"},
                {"tr", "Turkish"},
                {"tr-TR", "Turkish - Turkey"},
                {"uk", "Ukrainian"},
                {"uk-UA", "Ukrainian - Ukraine"},
                {"ur", "Urdu"},
                {"ur-PK", "Urdu - Pakistan"},
                {"uz", "Uzbek"},
                {"uz-UZ-Cyrl", "Uzbek (Cyrillic) - Uzbekistan"},
                {"uz-UZ-Latn", "Uzbek (Latin) - Uzbekistan"},
                {"vi", "Vietnamese"},
            };

            if (dic.ContainsKey(cultureCode))
            {
                return dic[cultureCode];
            }
            else
            {
                return cultureCode;
            }
        }

        #region Private Methods
        private static string LookupDefaultCultureCode(List<string> availabeCultures)
        {
            if (availabeCultures.Contains("zh-CN"))
            {
                if (!availabeCultures.Contains("en-US"))
                {
                    return "en-US";
                }
                else
                {
                    return string.Empty;
                }
            }
            else
            {
                return "zh-CN";
            }
        }
        #endregion
    }
}