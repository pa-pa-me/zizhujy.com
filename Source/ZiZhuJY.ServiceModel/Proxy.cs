using System;
using System.Collections.Generic;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Security.Cryptography.X509Certificates;

namespace ZiZhuJY.ServiceModel
{
    /// <summary>
    /// Client Proxy configurator
    /// </summary>
    public static class Proxy<T> where T : class
    {
        /// <summary>
        /// Configure the specified client proxy using the certificate file specified in the configuration file
        /// </summary>
        public static void Configure(ClientBase<T> client)
        {
            //Check if there is a valid configuration section
            Configuration.Section section = Configuration.Section.GetSection();
            if (section == null || section.EndPoints == null)
                return;

            //Check if there is a valid configuration for this service
            Configuration.EndPointElement element = section.EndPoints.GetElementByKey(client.Endpoint.Contract.ConfigurationName);
            if (element == null)
                return;

            X509Certificate2 certificate = element.GetClientCertificate();

            if (certificate != null)
                client.ClientCredentials.ClientCertificate.Certificate = certificate;
        }
    }
}
