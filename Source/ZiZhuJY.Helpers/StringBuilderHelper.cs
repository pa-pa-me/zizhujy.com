using System.Text;

namespace ZiZhuJY.Helpers
{
    public static class StringBuilderHelper
    {
        public static void AppendFormatToLevel(this StringBuilder sb, string format, int level = 1, char tab = ' ', int tabWidth = 4, params object[] args)
        {
            sb.AppendFormat(format.LevelPadWith(level, tabWidth, tab), args);
        }

        public static void AppendFormatToLevel(this StringBuilder sb, int level, string format, params object[] args)
        {
            sb.AppendFormatToLevel(format, 1, ' ', 4, args);
        }
    }
}
