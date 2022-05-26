using ZiZhuJY.Core;

namespace ZiZhuJY.Web.UI.Models
{
    public class AnnualRingModel
    {
        public int LunarYear { get; set; }
        public ZodiacYears Zodiac { get; set; }

        public static AnnualRingModel FromLunarYear(int lunarYear)
        {
            var model = new AnnualRingModel {LunarYear = lunarYear, Zodiac = ZodiacYear.GetZodiac(lunarYear)};
            return model;
        }
    }
}