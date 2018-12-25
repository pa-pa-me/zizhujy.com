using System;
using System.Reflection;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class StringValueAttribute : Attribute
    {
        public string StringValue { get; protected set; }

        public StringValueAttribute(string value)
        {
            StringValue = value;
        }
    }

    public static class EnumExtensions
    {
        public static string GetStringValue(this Enum value)
        {
            var type = value.GetType();

            var fieldInfo = type.GetField(value.ToString());

            var attributes = fieldInfo.GetCustomAttributes(typeof(StringValueAttribute), false)
                as StringValueAttribute[];

            return attributes != null && attributes.Length > 0
                ? attributes[0].StringValue
                : value.ToString();
        }
    }
}