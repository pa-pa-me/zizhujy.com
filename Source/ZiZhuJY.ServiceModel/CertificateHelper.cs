using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography.X509Certificates;

namespace ZiZhuJY.ServiceModel
{
    static class CertificateHelper
    {
        /// <summary>
        /// Load a certificate from the specified file.
        /// The filename can contains the password when using this format: file|password.
        /// The file can be a relative file or an absolute file.
        /// Return null if the file is not specified.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public static X509Certificate2 LoadFromFile(string file)
        {
            if (file != null)
                file = file.Trim();

            if (string.IsNullOrEmpty(file))
                return null;

            string[] parts = file.Split('|');
            if (parts.Length > 2)
                throw new ArgumentException("Certificate file name format not valid, but be in the format 'file|password'");

            string fullPath = PathHelper.LocateServerPath(parts[0].Trim());

            string password = string.Empty;
            if (parts.Length == 2)
                password = parts[1];

            X509Certificate2 cert = null;
            try
            {
                cert = new X509Certificate2(fullPath, password, X509KeyStorageFlags.MachineKeySet);
            }
            catch(Exception ex)
            {
                //System.IO.File.WriteAllText(@"test4.txt", string.Format("Read password: {0}", password));
                System.IO.File.WriteAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Exception.txt"), string.Format("File Path: {3}, Password: {4}\r\nError occurred: {0}\r\n{1}\r\n{2}", ex.Message, ex.Source, ex.StackTrace, fullPath, password));
                throw;
            }
            return cert;
        }
    }
}
