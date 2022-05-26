using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection.Emit;
using System.Text.RegularExpressions;
using Microsoft.International.Converters.PinYinConverter;

namespace ZiZhuJY.Core
{
    public class PinYin
    {
        public static List<string[]> GetPinYin(string s)
        {
            var pinyinResult = new List<string[]>();

            foreach (var item in s.ToCharArray())
            {
                if (ChineseChar.IsValidChar(item))
                {
                    var chineseChar = new ChineseChar(item);
                    pinyinResult.Add(chineseChar.Pinyins
                        .Where(py=>!string.IsNullOrWhiteSpace(py))
                        .Select(py=>py.ToLower())
                        .Select(ConvertNumericalPinYinToAccented).ToArray());
                }
                else
                {
                    pinyinResult.Add(null);
                }
            }

            return pinyinResult;
        }

        public static string ConvertNumericalPinYinToAccented(string input)
        {
            var pinyinToneMark = new Dictionary<int, string>
            {
                {0, "aoeiuv\u00fc"},
                {1, "\u0101\u014d\u0113\u012b\u016b\u01d6\u01d6"},
                {2, "\u00e1\u00f3\u00e9\u00ed\u00fa\u01d8\u01d8"},
                {3, "\u01ce\u01d2\u011b\u01d0\u01d4\u01da\u01da"},
                {4, "\u00e0\u00f2\u00e8\u00ec\u00f9\u01dc\u01dc"}
            };

            var words = input.Split(' ');
            var accented = string.Empty;
            var t = string.Empty;

            foreach (var pinyin in words)
            {
                foreach (var c in pinyin)
                {
                    if (c >= 'a' && c <= 'z')
                    {
                        t += c;
                    }
                    else if (c == ':')
                    {
                        if (t[t.Length - 1] == 'u')
                        {
                            t = t.Substring(0, t.Length - 2) + "\u00fc";
                        }
                    }
                    else
                    {
                        if (c >= '0' && c <= '5')
                        {
                            var tone = (int) Char.GetNumericValue(c)%5;

                            if (tone != 0)
                            {
                                var match = Regex.Match(t, "[aoeiuv\u00fc]+");
                                if (!match.Success)
                                {
                                    t += c;
                                }
                                else if (match.Groups[0].Length == 1)
                                {
                                    t = t.Substring(0, match.Groups[0].Index) +
                                        pinyinToneMark[tone][pinyinToneMark[0].IndexOf(match.Groups[0].Value[0])] +
                                        t.Substring(match.Groups[0].Index +
                                                    match.Groups[0].Length);
                                }
                                else
                                {
                                    if (t.Contains("a"))
                                    {
                                        t = t.Replace("a",
                                            pinyinToneMark[tone][0].ToString(CultureInfo.InvariantCulture));
                                    }
                                    else if (t.Contains("o"))
                                    {
                                        t = t.Replace("o",
                                            pinyinToneMark[tone][1].ToString(CultureInfo.InvariantCulture));
                                    }
                                    else if (t.Contains("e"))
                                    {
                                        t = t.Replace("e",
                                            pinyinToneMark[tone][2].ToString(CultureInfo.InvariantCulture));
                                    }
                                    else if (t.Contains("ui"))
                                    {
                                        t = t.Replace("i",
                                            pinyinToneMark[tone][3].ToString(CultureInfo.InvariantCulture));
                                    }
                                    else if (t.Contains("iu"))
                                    {
                                        t = t.Replace("u",
                                            pinyinToneMark[tone][4].ToString(CultureInfo.InvariantCulture));
                                    }
                                    else
                                    {
                                        t += "!";
                                    }
                                }
                            }
                        }
                        accented += t;
                        t = string.Empty;
                    }
                }

                accented += t + " ";
            }
            accented = accented.TrimEnd();

            return accented;
        }
    }
}
