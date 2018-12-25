using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace ZiZhuJY.Common.Extensions
{
    public static class ArrayExtensions
    {
        public static T[] SubArray<T>(this T[] data, int index, int length)
        {
            var result = new T[length];
            Array.Copy(data, index, result, 0, length);

            return result;
        }
        public static T[] SubArrayDeepClone<T>(this T[] data, int index, int length)
        {
            var arrCopy = new T[length];
            Array.Copy(data, index, arrCopy, 0, length);
            using (var ms = new MemoryStream())
            {
                var bf = new BinaryFormatter();
                bf.Serialize(ms, arrCopy);
                ms.Position = 0;
                return (T[])bf.Deserialize(ms);
            }
        }
    }
}
