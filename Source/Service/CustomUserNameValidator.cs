using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IdentityModel.Selectors;
using System.ServiceModel;
using System.IdentityModel.Tokens;

namespace ZiZhuJY.ServiceModel.Samples
{
    public class CustomUserNameValidator : UserNamePasswordValidator
    {
        public override void Validate(string userName, string password)
        {
            if (null == userName || null == password)
            {
                throw new ArgumentNullException();
            }

            if (!(userName == "test1" && password == "1test"))
            {
                //throw new FaultException("Unknown Username or Incorrect Password");
                throw new SecurityTokenException("Unkown Username or Incorrect Password");
            }
        }
    }
}
