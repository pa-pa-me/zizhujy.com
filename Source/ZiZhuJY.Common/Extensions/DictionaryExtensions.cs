using System.Collections.Generic;

namespace ZiZhuJY.Common.Extensions
{
    public static class DictionaryExtensions
    {
        public static TValue GetValue<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key)
        {
            try
            {
                return dic[key];
            }
            catch (KeyNotFoundException ex)
            {
                throw new TheKeyNotFoundException<TKey>(key, ex);
            }
        }

        public sealed class TheKeyNotFoundException<TKey> : KeyNotFoundException
        {
            public KeyNotFoundException OriginalException { get; set; }

            public TheKeyNotFoundException(TKey key, KeyNotFoundException originalException)
                : base(string.Format("The given key '{0}' was not present in the dictionary.", key))
            {
                OriginalException = originalException;
                HelpLink = originalException.HelpLink;
                Source = originalException.Source;
            }
        }
    }
}
