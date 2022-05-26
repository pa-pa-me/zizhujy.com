using System;
using System.Collections.Generic;
using System.Text;
using System.Configuration;
using System.Security.Cryptography.X509Certificates;

namespace ZiZhuJY.ServiceModel.Configuration
{
    public class EndPointElement : ConfigurationElement
    {
        /// <summary>
        /// Configuration name of the contract, usually is a complete type name of the contract interface (like Client.MathService.IMathService).
        /// </summary>
        [ConfigurationProperty("contract", IsRequired = true)]
        public string Contract
        {
            get { return (string)this["contract"]; }
            set { this["contract"] = value; }
        }

        /// <summary>
        /// Clent certificate file used for authentication. (.pfx file)
        /// Can be a relative or an absolute file. 
        /// If the file require the password you can use this format: file|password .
        /// </summary>
        [ConfigurationProperty("clientCertificate", IsRequired = false)]
        public string ClientCertificate
        {
            get { return (string)this["clientCertificate"]; }
            set { this["clientCertificate"] = value; }
        }

        public X509Certificate2 GetClientCertificate()
        {
            //Load the certificate from a file
            return CertificateHelper.LoadFromFile(ClientCertificate);
        }
    }

    public class EndPointCollection : ConfigurationElementCollection
    {
        public EndPointElement this[int index]
        {
            get
            {
                return base.BaseGet(index) as EndPointElement;
            }
            set
            {
                if (base.BaseGet(index) != null)
                {
                    base.BaseRemoveAt(index);
                }
                this.BaseAdd(index, value);
            }
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new EndPointElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((EndPointElement)element).Contract;
        }

        public EndPointElement GetElementByKey(string contractName)
        {
            foreach (EndPointElement service in this)
            {
                if (string.Equals(contractName, service.Contract, StringComparison.InvariantCultureIgnoreCase))
                    return service;
            }

            return null;
        }
    }
}
