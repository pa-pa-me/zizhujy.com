using System;
using System.Collections.Generic;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;

namespace ZiZhuJY.ServiceModel
{

    //ISS .svc example
    //<%@ServiceHost Service="YourCalculatorService"
    //               Factory="DevAge.ServiceModel.CertificateServiceHostFactory"
    //               language=c# Debug="true" %>
    // 
    // For more informations look at:
    // http://msdn2.microsoft.com/en-us/library/aa395224.aspx  "Custom Service Host"

    /// <summary>
    /// The factory class derived from ServiceHostFactory used to create the CertificateServiceHost class.
    /// Useful when hosting the service with IIS where you cannot specify what class to create but you can specify the host factory.
    /// </summary>
    public class CertificateServiceHostFactory : ServiceHostFactory
    {
        protected override ServiceHost CreateServiceHost(Type serviceType, Uri[] baseAddresses)
        {
            return new CertificateServiceHost(serviceType, baseAddresses);
        }
    }
}
