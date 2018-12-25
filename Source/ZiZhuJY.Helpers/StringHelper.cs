using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Helpers
{
    public static class StringHelper
    {
        public static string LevelPadWith(this string s, int level, int tabWidth =4, char tab = ' ')
        {
            return "{0}{1}".FormatWith(string.Empty.PadLeft(level*tabWidth, tab), s);
        }
    }
}