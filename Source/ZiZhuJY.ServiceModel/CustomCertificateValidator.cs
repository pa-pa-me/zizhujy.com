using System;
using System.Collections.Generic;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Security.Cryptography.X509Certificates;
using System.IdentityModel.Selectors;

namespace ZiZhuJY.ServiceModel
{
    /// <summary>
    /// A class derived from X509CertificateValidator to validate the client certificate using a specific 
    /// list of certificates.
    /// If the certificate is not in the list of valid certificate this validator try to use the default PeerOrChainTrust validator.
    /// </summary>
    public class CustomCertificateValidator : X509CertificateValidator
    {
        public CustomCertificateValidator()
        {
            mValidCertificates = new List<X509Certificate2>();
        }

        public CustomCertificateValidator(IEnumerable<X509Certificate2> validCertificates)
        {
            mValidCertificates = new List<X509Certificate2>(validCertificates);
        }

        private IList<X509Certificate2> mValidCertificates;
        public IList<X509Certificate2> ValidCertificates
        {
            get { return mValidCertificates; }
            set { mValidCertificates = value; }
        }

        public override void Validate(X509Certificate2 certificate)
        {
            // Check that there is a certificate.
            if (certificate == null)
                throw new ArgumentNullException("certificate");

            foreach (X509Certificate2 cert in ValidCertificates)
            {
                if (cert.Equals(certificate))
                    return;
            }

            X509CertificateValidator.PeerOrChainTrust.Validate(certificate);
        }
    }
}
