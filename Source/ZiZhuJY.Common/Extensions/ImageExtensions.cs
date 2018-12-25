using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Reflection;
using System.Linq;

namespace ZiZhuJY.Common.Extensions
{
    public static class ImageExtensions
    {
        public static byte[] ToByteArray(this System.Drawing.Image image, ImageFormat imageFormat)
        {
            var ms = new MemoryStream();
            image.Save(ms, imageFormat);

            return ms.ToArray();
        }

        private static readonly Dictionary<Guid, string> KnownImageFormats =
            (from p in typeof(ImageFormat).GetProperties(BindingFlags.Static | BindingFlags.Public)
             where p.PropertyType == typeof(ImageFormat)
             let value = (ImageFormat)p.GetValue(null, null)
             select new { Guid = value.Guid, Name = value.ToString() })
                .ToDictionary(p => p.Guid, p => p.Name);
        public static string ToDescriptiveString(this ImageFormat imageFormat)
        {
            string name;

            if (KnownImageFormats.TryGetValue(imageFormat.Guid, out name))
            {
                return name;
            }
            else
            {
                return "*";
            }
        }
    }
}
