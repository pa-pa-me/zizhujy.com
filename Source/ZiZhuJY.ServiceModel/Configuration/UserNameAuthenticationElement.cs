using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.ServiceModel.Security;

namespace ZiZhuJY.ServiceModel.Configuration
{
    public class UserNameAuthenticationElement : ConfigurationElement
    {
        [ConfigurationProperty("userNamePasswordValidationMode", IsRequired = true)]
        public UserNamePasswordValidationMode UserNamePasswordValidationMode
        {
            //get { return (UserNamePasswordValidationMode)Enum.Parse(typeof(UserNamePasswordValidationMode), (string)this["userNamePasswordValidationMode"]); }
            get { return (UserNamePasswordValidationMode)this["userNamePasswordValidationMode"]; }
            set { this["userNamePasswordValidationMode"] = value; }
        }

        [ConfigurationProperty("membershipProviderName", IsRequired = true)]
        public string MembershipProviderName
        {
            get { return (string)this["membershipProviderName"]; }
            set { this["membershipProviderName"] = value; }
        }
    }
}
