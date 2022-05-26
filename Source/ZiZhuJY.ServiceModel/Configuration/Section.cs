using System;
using System.Collections.Generic;
using System.Text;
using System.Configuration;

namespace ZiZhuJY.ServiceModel.Configuration
{
    /*
     * 
     *  Here a typical configuration:
        <configSections>
            <!-- Add devage.serviceModel section handler -->
            <section name="devage.serviceModel" type="DevAge.ServiceModel.Configuration.Section, DevAge.ServiceModel" />
        </configSections>
        ...........................
     
        <!-- Specific DevAge.ServiceModel configuration used to set the client valid certificates and server certificate 
         This is a server configuration -->
        <devage.serviceModel>
            <!-- List of service type each with the relative server certificate and client certificate list -->
            <services>
              <add name="MathService" 
                    serverCertificate="App_Data\Server.pfx"
                    clientCertificates="App_Data\Client1.cer, App_Data\Client2.cer"
                    />
            </services>
        </devage.serviceModel>

         <!-- Specific DevAge.ServiceModel configuration used to set the client certificate 
         This is a client configuration -->
        <devage.serviceModel>
            <!-- List of endPoints each with the relative client certificate to use for authentication  -->
            <endPoints>
              <add contract="IMathService" 
                    clientCertificate="Client.pfx"
                    />
            </endPoints>
        </devage.serviceModel>
     * */

    /// <summary>
    /// The DevAge.ServiceModel conficuration section handler.
    /// Contains the list of certificates files to use.
    /// </summary>
    public class Section : ConfigurationSection
    {
        public static Section GetSection()
        {
            Section section =
                (Section)ConfigurationManager.GetSection("zizhujy.serviceModel");

            return section;
        }

        [ConfigurationProperty("services")]
        public ServiceCollection Services
        {
            get { return this["services"] as ServiceCollection; }
        }

        [ConfigurationProperty("endPoints")]
        public EndPointCollection EndPoints
        {
            get { return this["endPoints"] as EndPointCollection; }
        }

        [ConfigurationProperty("userNameAuthentication")]
        public UserNameAuthenticationElement UserNameAuthentication
        {
            get { return this["userNameAuthentication"] as UserNameAuthenticationElement; }
        }
    }
}
