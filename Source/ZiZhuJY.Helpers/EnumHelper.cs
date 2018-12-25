using System;

namespace ZiZhuJY.Helpers
{
    public class EnumHelper
    {
        public static T ParseEnum<T>(string value)
        {
            return (T) Enum.Parse(typeof (T), value, true);
        }
    }
}
