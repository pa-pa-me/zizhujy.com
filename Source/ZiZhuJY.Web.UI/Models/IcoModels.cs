using System.Drawing;
using System.IO;
using System.Net;
using System.Web;
using ZiZhuJY.Web.UI.Attributes;
using ZiZhuJY.Web.UI.Resources.Models.Apps;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.Models
{
    public class IcoModel
    {
        private HttpPostedFileBase file;
        [LocalizedDisplayName("File", NameResourceType=typeof(Names))]
        public HttpPostedFileBase File
        {
            get { return this.file; }
            set
            {
                this.file = value;
                if (this.file != null)
                {
                    string extension = Path.GetExtension(file.FileName);
                    if (ImageHelper.GetImageFormatByExtension(extension) != null)
                    {
                        this.image = Image.FromStream(file.InputStream);
                    }
                }
            }
        }

        private string link;
        [LocalizedDisplayName("Link", NameResourceType = typeof(Names))]
        public string Link
        {
            get { return this.link; }
            set
            {
                this.link = value;
                if (!string.IsNullOrWhiteSpace(value))
                {
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(this.link.Trim());
                    request.Method = "get";
                    HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                    this.image = Image.FromStream(response.GetResponseStream());
                    response.Close();
                }
            }
        }

        private Image image;
        public Image Image { get { return image; } set { image = value; } }
    }
}