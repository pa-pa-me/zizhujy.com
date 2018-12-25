using System;
using System.Collections.Generic;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Security;
using System.Security.Cryptography.X509Certificates;

namespace ZiZhuJY.ServiceModel
{
    /// <summary>
    /// A class that derive from the ServiceHost system class to automatically set the 
    /// server certificate used for service authentication.
    /// This class set the Credentials.ServiceCertificate.Certificate property override any certificate configuration.
    /// Consider anyway that you must correctly configure the binding security.
    /// </summary>
    public class CertificateServiceHost : ServiceHost
    {
        public CertificateServiceHost(Type serviceType, Uri[] baseAddresses)
            : base(serviceType, baseAddresses)
        {
        }

        protected override void ApplyConfiguration()
        {
            try
            {
                //Check if there is a valid configuration section
                Configuration.Section section = Configuration.Section.GetSection();
                if (section == null || section.Services == null)
                {
                    //System.IO.File.WriteAllText(@"test.txt", string.Format("section is null"));
                    return;
                }

                //Check if there is a valid configuration for this service
                Configuration.ServiceElement element = section.Services.GetElementByKey(Description.ConfigurationName);
                if (element == null)
                {
                    //StringBuilder sb = new StringBuilder();
                    //foreach (Configuration.ServiceElement service in section.Services)
                    //{
                    //    sb.AppendLine(service.Name);
                    //}
                    //System.IO.File.WriteAllText(@"test2.txt", string.Format("element is null, Description.Name: {0}\r\nAll services list:{1}", Description.ConfigurationName, sb.ToString()));
                    return;
                }

                X509Certificate2 serverCertificate = element.GetServerCertificate();

                //Set the server certificate
                if (serverCertificate != null)
                {
                    this.Credentials.ServiceCertificate.Certificate = serverCertificate;
                }
                else
                {
                    //System.IO.File.WriteAllText(@"test3.txt", string.Format("serverCertificate is null"));
                }

                //Set the userNameAuthentication
                Configuration.UserNameAuthenticationElement userNameAuthElement = section.UserNameAuthentication;
                if (userNameAuthElement != null)
                {
                    this.Credentials.UserNameAuthentication.UserNamePasswordValidationMode = userNameAuthElement.UserNamePasswordValidationMode;
                    // Don't know how to configure the MembershipProvider from conig files, currently use default membership provider
                    //this.Credentials.UserNameAuthentication.MembershipProvider = userNameAuthElement.MembershipProviderName;
                }

                base.ApplyConfiguration();

                //Set the client certificates and the validator
                if (string.IsNullOrEmpty(element.ClientCertificates) == false)
                {
                    X509ClientCertificateAuthentication authentication =
                                this.Credentials.ClientCertificate.Authentication;

                    authentication.CertificateValidationMode =
                        System.ServiceModel.Security.X509CertificateValidationMode.Custom;

                    authentication.CustomCertificateValidator =
                        new CustomCertificateValidator(element.GetClientCertificates());
                }
            }
            catch(Exception ex)
            {
                //throw;
                System.IO.File.WriteAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Exception2.txt"), string.Format("Error occurred: {0}\r\n{1}\r\n{2}", ex.Message, ex.Source, ex.StackTrace));
            }
            finally
            {
            }
        }
    }
}
