using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Common.Helpers
{
    public class FileHelper
    {
        public static string GetHash(FileStream stream)
        {
            var sb = new StringBuilder();

            if (stream != null)
            {
                stream.Seek(0, SeekOrigin.Begin);

                var md5 = MD5.Create();
                var hash = md5.ComputeHash(stream);
                foreach (var b in hash)
                {
                    sb.Append(b.ToString("x2"));
                }

                stream.Seek(0, SeekOrigin.Begin);
            }

            return sb.ToString();
        }

        public static string GetHash(string filePath)
        {
            using (var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                return GetHash(fs);
            }
        }

        public static string ReadTextFrom(Stream stream, Encoding encoding)
        {
            var buffer = new byte[1024];
            var sb = new StringBuilder();

            if (stream == null) return sb.ToString();

            while (stream.CanRead)
            {
                var count = stream.Read(buffer, 0, buffer.Length);

                if (count > 0)
                {
                    sb.Append(encoding.GetString(buffer, 0, count));
                }
                else
                {
                    break;
                }
            }

            return sb.ToString();
        }

        public static string ReadTextFrom(Stream stream)
        {
            return ReadTextFrom(stream, Encoding.UTF8);
        }

        public static byte[] ReadBinaryFrom(Stream stream)
        {
            var buffer = new byte[1024];
            var list = new List<byte>();

            if (stream == null) return list.ToArray();

            while (stream.CanRead)
            {
                var count = stream.Read(buffer, 0, buffer.Length);

                if (count > 0)
                {
                    list.AddRange(buffer.SubArray(0, count));
                }
                else
                {
                    break;
                }
            }

            return list.ToArray();
        }

        public static string ReadTextFrom(Uri uri)
        {
            var request = WebRequest.Create(uri);
            var response = request.GetResponse();
            var text = ReadTextFrom(response.GetResponseStream());
            return text;
        }

        public static byte[] ReadBinaryFrom(Uri uri)
        {
            var request = WebRequest.Create(uri);
            var response = request.GetResponse();
            var b = ReadBinaryFrom(response.GetResponseStream());
            return b;
        }
    }
}
