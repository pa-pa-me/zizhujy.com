using System;
using System.ComponentModel;
using System.Reflection;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class LocalizedDisplayNameAttribute: DisplayNameAttribute
    {
        private PropertyInfo nameProperty;
        private Type resourceType;

        public LocalizedDisplayNameAttribute() : base(string.Empty) { }

        public LocalizedDisplayNameAttribute(string displayNameKey)
            : base(displayNameKey) {
        }

        public Type NameResourceType
        {
            get
            {
                return resourceType;
            }
            set
            {
                resourceType = value;
                // Initialize nameProperty when type property is provided by setter
                nameProperty = resourceType.GetProperty(base.DisplayNameValue, BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic);
            }
        }

        public override string DisplayName
        {
            get
            {
                // Check if nameProperty is null and return original display name value
                if (nameProperty == null)
                {
                    return base.DisplayName;
                }

                return (string)nameProperty.GetValue(nameProperty.DeclaringType, null);
            }
        }
    }
}