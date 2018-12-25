using System;
using System.Globalization;
using ZiZhuJY.Helpers;

namespace ZiZhuJY.Core
{
    public enum ZodiacYears
    {
        Rat = 1,
        Ox,
        Tiger,
        Rabbit,
        Dragon,
        Snake,
        Horse,
        Goat,
        Monkey,
        Rooster,
        Dog,
        Pig
    }

    public class ZodiacYear
    {
        public static ZodiacYears GetZodiac(DateTime datetime)
        {
            var calendar = new ChineseLunisolarCalendar();
            var sexagenaryYear = calendar.GetSexagenaryYear(datetime);
            var terrestrialBranch = calendar.GetTerrestrialBranch(sexagenaryYear);

            return (ZodiacYears) terrestrialBranch;
        }

        public static ZodiacYears GetZodiac(int lunarYear)
        {
            var calendar = new ChineseLunisolarCalendar();
            var lunarDateTime = new DateTime(lunarYear, 1, 1, calendar);
            var sexagenaryYear = calendar.GetSexagenaryYear(lunarDateTime);
            var terrestrialBranch = calendar.GetTerrestrialBranch(sexagenaryYear);

            return (ZodiacYears) terrestrialBranch;
        }
    }
}
