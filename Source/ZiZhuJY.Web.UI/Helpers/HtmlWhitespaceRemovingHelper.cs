using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Common.Helpers;

namespace ZiZhuJY.Web.UI.Utility
{
    public class HtmlWhitespaceRemovingHelper : Stream
    {
        private Stream @base;
        private StringBuilder sb = new StringBuilder();

        public HtmlWhitespaceRemovingHelper(Stream responseStream)
        {
            if (responseStream == null)
                throw new ArgumentNullException("responseStream");

            this.@base = responseStream;
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            if(buffer.IsPossiblyGZippedBytes())
            {
                this.@base.Write(buffer, offset, count);
                return;
            }

            string html = Encoding.UTF8.GetString(buffer, offset, count);

            //Thanks to Qtax
            //http://stackoverflow.com/questions/8762993/remove-white-space-from-entire-html-but-inside-pre-with-regular-expressions
            Regex regex = new Regex(@"(?<=\s)\s+(?![^<>]*</textarea>|[^<>]*</pre>)", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            //html = regex.Replace(html, match => string.Format("{0}", new string('_', match.Groups[0].Value.Length)));
            html = regex.Replace(html, string.Empty);

            var newBuffer = Encoding.UTF8.GetBytes(html);
            this.@base.Write(newBuffer, 0, newBuffer.Length);
        }

        #region Other Members
        public override int Read(byte[] buffer, int offset, int count)
        {
            throw new NotSupportedException();
        }

        public override bool CanRead
        {
            get { return false; }
        }

        public override bool CanSeek
        {
            get { return false; }
        }

        public override bool CanWrite
        {
            get { return true; }
        }

        public override long Length
        {
            get { throw new NotSupportedException(); }
        }

        public override long Position
        {
            get
            {
                throw new NotSupportedException();
            }
            set
            {
                throw new NotSupportedException();
            }
        }

        public override void Flush()
        {
            this.@base.Flush();
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            throw new NotSupportedException();
        }

        public override void SetLength(long value)
        {
            throw new NotSupportedException();
        }
        #endregion
    }
}