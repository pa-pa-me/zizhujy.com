using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Resources;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using System.Web.Script.Serialization;
using System.Web.WebPages;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Core;
using ZiZhuJY.Helpers;

namespace ZiZhuJY.Web.UI.Utility
{
    public static class ResourceHelper
    {
        public static bool ByteOrderIsLittleEndian;

        static ResourceHelper()
        {
            // the unicode of ' is 0027, in big endian machine, it is stored as 00 27,
            // while in little endian machine (e.g. x86), it is stored as 27 00.
            ByteOrderIsLittleEndian = System.Text.Encoding.Unicode.GetBytes('\''.ToString(CultureInfo.InvariantCulture))
                .Aggregate("", (agg, val) => agg + val.ToString("X2")).Equals("2700", StringComparison.Ordinal);
        }

        public static Dictionary<string, string> Strings(string viewVirtualPath, CultureInfo cultureInfo)
        {
            #region Precompiled

            var resourceManager = CompiledResources.GetResourceManager(viewVirtualPath);
            try
            {
                var resourceSet = resourceManager.GetResourceSet(cultureInfo, false, true);

                if (resourceSet == null)
                {
                    return GetDefaultCultureResourceSet(resourceManager, cultureInfo);
                }
                
                var result = new Dictionary<string, string>();

                var enumerator = resourceSet.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    result.Add(enumerator.Key.ToString(), (string) enumerator.Value);
                }

                return result;
            }
            catch(NullReferenceException ex)
            {
                throw new NullReferenceException(
                    "NullReferenceException was met with 'viewVirtualPath' = '{0}', 'CultureInfo' = '{1}'.".FormatWith(
                        viewVirtualPath, cultureInfo), ex);
            }
            #endregion

            #region Non precompiled
            var dic = new Dictionary<string, string>();
            var resXReader = new ResXResourceReader(GetResourceFileFullName(viewVirtualPath, cultureInfo));

            foreach (DictionaryEntry entry in resXReader)
            {
                var value = entry.Value.ToString();
                //value = value.Replace("\"", "\\\"").Replace("'", "\\'").Replace("\r", "")
                //    .Replace("\n", "");
                dic.Add(entry.Key.ToString(), value);
            }
            resXReader.Close();

            return dic;
            #endregion
        }

        private static Dictionary<string, string> GetDefaultCultureResourceSet(ResourceManager resourceManager, CultureInfo cultureInfo)
        {
            var result = new Dictionary<string, string>();

            var resourceSet = resourceManager.GetResourceSet(cultureInfo, true, true);

            var enumerator = resourceSet.GetEnumerator();
            while (enumerator.MoveNext())
            {
                result.Add(enumerator.Key.ToString(), (string) enumerator.Value);
            }

            var keys = new List<string>(result.Keys);
            foreach (var key in keys)
            {
                result[key] = resourceManager.GetString(key);
            }

            return result;
        }

        public static Dictionary<string, string> Strings(string viewVirtualPath)
        {
            return Strings(viewVirtualPath, CultureHelper.GetCurrentUICulture());
        }

        public static string EscapeTheUnescapedChar(string input, string unicodeChar)
        {
            var output = input;
            // unescaped ' examples: (even number or 0 of \s)
            // '
            // \\'
            // \\\\'
            var regex = new Regex(@"((?:^|\b|[^\\]+?)(?:\\\\)*?)" + unicodeChar.Replace(@"\", @"\\"),
                RegexOptions.IgnoreCase);

            if (regex.IsMatch(input))
            {
                output = regex.Replace(input, @"$1\" + unicodeChar);
            }

            return output;
        }

        public static string GetUnicodeStringOfCharacter(char c)
        {
            var unicode = "";
            var bytes = System.Text.Encoding.Unicode.GetBytes(c.ToString(CultureInfo.InvariantCulture));

            if (!ByteOrderIsLittleEndian)
            {
                for (var i = 0; i < bytes.Length; i++)
                {
                    unicode += bytes[i].ToString("X2");
                }
            }
            else
            {
                for (var i = bytes.Length - 1; i >= 0; i--)
                {
                    unicode += bytes[i].ToString("X2");
                }
            }

            return unicode;
        }

        public static string EscapeTheUnescapedChar(string input, char c)
        {
            var output = input;

            output = EscapeTheUnescapedChar(output, c.ToString(CultureInfo.InvariantCulture));

            //// ' --> \u0027
            var unicodeC = @"\u" + GetUnicodeStringOfCharacter(c);

            output = EscapeTheUnescapedChar(output, unicodeC);

            return output;
        }

        public static string JsonResource(string viewVirtualPath, CultureInfo cultureInfo/*, params char[] charsNeedToBeDecoded*/)
        {
            var json = (new JavaScriptSerializer()).Serialize(Strings(viewVirtualPath, cultureInfo));

            //if (charsNeedToBeDecoded != null && charsNeedToBeDecoded.Length > 0)
            //{
            //    foreach (var t in charsNeedToBeDecoded)
            //    {
            //        var unicodeC = @"\\u" + GetUnicodeStringOfCharacter(t);

            //        var regex = new Regex(unicodeC, RegexOptions.IgnoreCase);

            //        json = regex.Replace(json, t.ToString(CultureInfo.InvariantCulture));
            //    }
            //}

            return json;
        }

        public static string JsonResource(string viewVirtualPath)
        {
            return JsonResource(viewVirtualPath, CultureHelper.GetCurrentUICulture());
        }

        public static string JsonStringifiedResource(string viewVirtualPath, CultureInfo cultureInfo)
        {
            var json = (new JavaScriptSerializer()).Serialize(Strings(viewVirtualPath, cultureInfo));
            
            return json;
        }

        public static string GetResourceFileFullName(string viewVirtualPath, CultureInfo cultureInfo)
        {
            string viewFullName = HostingEnvironment.MapPath(viewVirtualPath);
            string defaultPath = Path.Combine(Path.GetDirectoryName(viewFullName), "App_LocalResources", "{0}.resx".FormatWith(Path.GetFileName(viewVirtualPath)));
            string cultureName = cultureInfo.Name;
            string neutralName = cultureName;
            if (cultureName.Length > 2) neutralName = cultureName.Substring(0, 2);
            string neutralPath = Path.Combine(Path.GetDirectoryName(viewFullName), "App_LocalResources", "{0}.{1}.resx".FormatWith(Path.GetFileName(viewVirtualPath), neutralName));
            string culturePath = Path.Combine(Path.GetDirectoryName(viewFullName), "App_LocalResources", "{0}.{1}.resx".FormatWith(Path.GetFileName(viewVirtualPath), cultureName));

            return File.Exists(culturePath) ? culturePath : File.Exists(neutralName) ? neutralPath : defaultPath;
        }

        public static string GetResourceFileFullName(string viewVirtualPath)
        {
            return GetResourceFileFullName(viewVirtualPath, CultureHelper.GetCurrentUICulture());
        }
    }
}