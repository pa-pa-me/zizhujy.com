using System;
using System.Text;

namespace ZiZhuJY.Web.UI.Models
{
    public class ProxyParams
    {
        #region User defined parameters
        private string  type;
        public string Type { get { return type; } set { type = value; } }

        private string url;
        public string Url { get { return url; } set { url = value; } }

        private string data;
        public string Data { get { return data; } set { data = value; } }
        public byte[] Bytes
        {
            get
            {
                if (!string.IsNullOrEmpty(data))
                {
                    byte[] bytes = Encoding.UTF8.GetBytes(data);
                    return bytes;
                }
                else
                {
                    return null;
                }
            }
        }
        #endregion

        #region necessary for internal
        public string ContentType
        {
            get
            {
                if (type.Equals("POST", StringComparison.OrdinalIgnoreCase))
                {
                    return "application/x-www-form-urlencoded";
                }
                else
                {
                    return "";
                }
            }
        }
        public int ContentLength
        {
            get
            {
                if (this.Bytes != null)
                {
                    return this.Bytes.Length;
                }
                else
                {
                    return 0;
                }
            }
        }
        #endregion
    }
}