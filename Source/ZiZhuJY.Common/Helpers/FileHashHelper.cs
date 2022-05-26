using System.Web;
using System.Web.Caching;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Common.Helpers
{
    public static class FileHashHelper
    {
        private const string FileHashCacheIdentifier = "FileHashCache";
        public static string GetFileHash(string filePath)
        {
            var key = "{0}${1}".FormatWith(FileHashCacheIdentifier, filePath);

            var cache = (string)HttpRuntime.Cache.Get(key);

            if (string.IsNullOrWhiteSpace(cache))
            {
                HttpRuntime.Cache.Insert(key,
                    FileHelper.GetHash(filePath),
                    new CacheDependency(filePath));
            }

            cache = (string)HttpRuntime.Cache.Get(key);

            return cache;
        }
    }
}
