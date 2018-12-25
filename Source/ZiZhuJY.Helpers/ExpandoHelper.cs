using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;

namespace ZiZhuJY.Helpers
{
    public static class ExpandoHelper
    {
        public static string ToHtmlUnorderedList(this ExpandoObject o, bool format = false, bool lineBreak = false, int level = 0, char tab = ' ', int tabWidth = 4)
        {
            var sb = new StringBuilder();
            if (format && lineBreak)
            {
                sb.AppendLine();
            }

            AppendToStringBuilder(format, level, tab, tabWidth, sb, "<div>{0}</div>", o);

            if (format) sb.AppendLine();

            AppendToStringBuilder(format, level, tab, tabWidth, sb, "<ul>");

            foreach (var kvp in o)
            {
                if(format) sb.AppendLine();

                AppendToStringBuilder(format, level+1, tab, tabWidth, sb,
                    "<li><strong>{0}</strong> = {1}", kvp.Key, kvp.Value);

                var value = kvp.Value as ExpandoObject;

                var hasChildren = false;

                if (value != null)
                {
                    hasChildren = true;

                    if (format)
                    {
                        sb.AppendLine();
                    }

                    sb.Append(value.ToHtmlUnorderedList(format, false, level + 2, tab, tabWidth));
                    //AppendToStringBuilder(format, level + 2, tab, tabWidth, sb,
                    //    value.ToHtmlUnorderedList(format, false, level + 2, tab, tabWidth));
                }
                else
                {
                    var list = kvp.Value as IEnumerable<ExpandoObject>;
                    if (list != null)
                    {
                        hasChildren = true;

                        if (format) sb.AppendLine();

                        sb.Append(list.ToHtmlOrderedList(format, false, level + 2, tab, tabWidth));
                    }
                }

                AppendToStringBuilder(hasChildren, level+1, tab, tabWidth, sb, "</li>");
            }

            if (format) sb.AppendLine();
            AppendToStringBuilder(format, level, tab, tabWidth, sb, "</ul>");
            if (format) sb.AppendLine();

            if (format && lineBreak) sb.AppendLine();
            return sb.ToString();
        }

        public static string ToHtmlOrderedList(this IEnumerable<ExpandoObject> list, bool format = false,
            bool lineBreak = false, int level = 0, char tab = ' ', int tabWidth = 4)
        {
            var sb = new StringBuilder();
            if (format && lineBreak)
            {
                sb.AppendLine();
            }

            AppendToStringBuilder(format, level, tab, tabWidth, sb, "<div>{0}</div>", list);
            if (format) sb.AppendLine();

            AppendToStringBuilder(format, level, tab, tabWidth, sb, "<ol>");

            foreach (var element in list)
            {
                if (format) sb.AppendLine();

                AppendToStringBuilder(format, level + 1, tab, tabWidth, sb,
                    "<li>");
                sb.AppendLine();

                sb.Append(element.ToHtmlUnorderedList(format, false, level + 2, tab, tabWidth));

                AppendToStringBuilder(format, level + 1, tab, tabWidth, sb, "</li>");
            }
            
            if (format) sb.AppendLine();
            AppendToStringBuilder(format, level, tab, tabWidth, sb, "</ol>");
            if (format) sb.AppendLine();

            if (format && lineBreak) sb.AppendLine();
            return sb.ToString();
        }

        private static void AppendToStringBuilder(bool format, int level, char tab, int tabWidth, StringBuilder sb, string template, 
            params object[] args)
        {
            if (format)
            {
                sb.AppendFormatToLevel(template, level, tab, tabWidth, args);
            }
            else
            {
                sb.AppendFormat(template, args);
            }
        }
    }
}
