using System;
using System.Linq;

namespace ZiZhuJY.Common.Extensions
{
    public static class StringExtensions
    {
        public static string TrimStart(this string source, string trimString, StringComparison comp = StringComparison.InvariantCultureIgnoreCase)
        {
            if (source.StartsWith(trimString, comp))
            {
                return source.Substring(trimString.Length);
            }
            else
            {
                return source;
            }
        }

        public static string TrimEnd(this string source, string trimString, StringComparison comp = StringComparison.InvariantCultureIgnoreCase)
        {
            if (source.EndsWith(trimString, comp))
            {
                return source.Substring(0, source.Length - trimString.Length);
            }
            else
            {
                return source;
            }
        }

        public static string Trim(this string source, string trimString, StringComparison comp = StringComparison.InvariantCultureIgnoreCase)
        {
            return source.TrimStart(trimString, comp).TrimEnd(trimString, comp);
        }

        /// <summary>
        /// A short cut for string.Format()
        /// </summary>
        /// <param name="format">The format.</param>
        /// <param name="parameters">The parameters.</param>
        /// <returns>The target string.</returns>
        public static string FormatWith(this string format, params object[] parameters)
        {
            try
            {
                return string.Format(format, parameters);
            }
            catch (FormatException ex)
            {
                var callerInfo = string.Format("{0}.format(\"{1}\")", format, string.Join("\", \"", parameters));

                var newException = new FormatException(
                    string.Format("Format exception met when processing `{0}`.", callerInfo));

                var exceptionString = newException.ToString();

                throw new FormatException(exceptionString);
            }
        }

        /// <summary>
        /// Extract a sub string from the parent string. For example, "||target|abcd".Substring("||", "|") = "target"
        /// </summary>
        /// <param name="s">The s.</param>
        /// <param name="startAfter">The string that the sub string starts after.</param>
        /// <param name="endBefore">The string that the sub string ends before.</param>
        /// <param name="comparison">The comparison method.</param>
        /// <returns>The sub string.</returns>
        public static string Substring(this string s, string startAfter, string endBefore, StringComparison comparison)
        {
            int index1 = s.IndexOf(startAfter, comparison);
            if (index1 >= 0) index1 += startAfter.Length;
            else return "";

            int index2 = s.IndexOf(endBefore, index1, comparison);
            if (index2 >= 0) return s.Substring(index1, index2 - index1);
            else return s.Substring(index1);
        }

        /// <summary>
        /// Determines whether the source string contains a specified sub string.
        /// </summary>
        /// <param name="source">The source string.</param>
        /// <param name="toCheck">The specified string to check.</param>
        /// <param name="comp">The comparison option.</param>
        /// <returns>
        ///   <c>true</c> if [contains] [the specified string to check]; otherwise, <c>false</c>.
        /// </returns>
        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }

        public static string Substr(this string source, int start, int end)
        {
            return source.Substring(start, end - start);
        }

        public static string FirstLetterToLower(this string source)
        {
            var a = source.ToCharArray();
            for (var i = 0; i < a.Length; i++)
            {
                if (char.IsLetter(a[i]))
                {
                    a[i] = char.ToLower(a[i]);
                    break;
                }
            }

            return new string(a);
        }

        public static string FirstLetterToUpper(this string source)
        {
            var a = source.ToCharArray();
            for (var i = 0; i < a.Length; i++)
            {
                if (Char.IsLetter(a[i]))
                {
                    a[i] = char.ToUpper(a[i]);
                    break;
                }
            }

            return new string(a);
        }
    }
}