using System;
using System.ComponentModel;
using System.Reflection;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class LocalizedDescriptionAttribute : DescriptionAttribute
    {
        private PropertyInfo descriptionProperty;
        private Type resourceType;

        public LocalizedDescriptionAttribute(string description)
            : base(description)
        {
        }

        public Type DescriptionResourceType
        {
            get
            {
                return resourceType;
            }
            set
            {
                resourceType = value;
                descriptionProperty = resourceType.GetProperty(base.Description, BindingFlags.Static | BindingFlags.Public);
            }
        }

        public override string Description
        {
            get
            {
                if (descriptionProperty == null)
                {
                    return base.Description;
                }

                return (string)descriptionProperty.GetValue(descriptionProperty.DeclaringType, null);
            }
        }
    }
}