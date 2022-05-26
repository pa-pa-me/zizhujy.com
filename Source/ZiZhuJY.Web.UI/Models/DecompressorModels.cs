using System.Web;
using ZiZhuJY.Web.UI.Attributes;
using ZiZhuJY.Web.UI.Resources.Controllers.Apps;

namespace ZiZhuJY.Web.UI.Models
{
    public enum CompressorActions
    {
        [LocalizedDescription("Decompress", DescriptionResourceType=typeof(Decompressor))]
        Decompress,

        [LocalizedDescription("Compress", DescriptionResourceType = typeof(Decompressor))]
        Compress
    }

    public class DecompressorModel
    {
        private HttpPostedFileBase file;
        [LocalizedDisplayName("File", NameResourceType = typeof(Decompressor))]
        public HttpPostedFileBase File
        {
            get { return this.file; }
            set
            {
                this.file = value;
                if (this.file != null)
                {
                    // TODO: validation file format
                }
            }
        }

        private string password;
        [LocalizedDisplayName("Password", NameResourceType = typeof(Decompressor))]
        public string Password
        {
            get
            {
                return this.password;
            }
            set
            {
                this.password = value;
            }
        }

        private CompressorActions action;
        [LocalizedDisplayName("ActionName", NameResourceType = typeof(Decompressor))]
        public CompressorActions Action
        {
            get
            {
                return this.action;
            }
            set
            {
                this.action = value;
            }
        }
    }
}