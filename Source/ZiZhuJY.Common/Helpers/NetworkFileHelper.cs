using System;
using System.Text;
using System.Web;
using System.Web.Caching;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Common.Services;

namespace ZiZhuJY.Common.Helpers
{
    public class NetworkFileHelper
    {
        private const string NetworkFileContentCacheIdentifier = "NetworkFileContentCache";

        public static byte[] GetNetworkFileBinaryContent(string uriString)
        {
            var uri = new Uri(uriString);

            var key = "{0}${1}".FormatWith(NetworkFileContentCacheIdentifier, uri.AbsoluteUri);

            var cache = (byte[])HttpRuntime.Cache.Get(key);

            if (cache == null)
            {
                byte[] b;
                var readFromNetworkSuccess = false;

                try
                {
                    b = FileHelper.ReadBinaryFrom(uri);
                    readFromNetworkSuccess = true;
                }
                catch (Exception)
                {
                    // fail, read from the backup if any
                    b = BackupService.ReadBinaryBackup(uri.AbsolutePath);
                }

                if (readFromNetworkSuccess)
                {
                    // Create a backup
                    BackupService.SaveBinaryBackup(uri.AbsolutePath, b);
                }

                HttpRuntime.Cache.Insert(key,
                    b,
                    null,
                    DateTime.UtcNow.AddDays(7),
                    Cache.NoSlidingExpiration);
            }

            cache = (byte[])HttpRuntime.Cache.Get(key);

            return cache;
        }

        public static string GetNetworkFileTextContent(string uriString, Encoding encoding)
        {
            var bytes = GetNetworkFileBinaryContent(uriString);

            return encoding.GetString(bytes);
        }

        public static string GetNetworkFileTextContent(string uriString)
        {
            return GetNetworkFileTextContent(uriString, Encoding.UTF8);
        }
    }
}
