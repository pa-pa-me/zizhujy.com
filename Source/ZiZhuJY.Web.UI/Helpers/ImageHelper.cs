using System.Drawing.Imaging;

namespace ZiZhuJY.Web.UI.Utility
{
    public static class ImageHelper
    {
        public static ImageFormat GetImageFormatByExtension(string extension)
        {
            ImageFormat format = null;
            switch (extension.Replace(".","").ToLower())
            {
                case "png":
                    format = ImageFormat.Png;
                    break;

                case "jpg":
                case "jpeg":
                    format = ImageFormat.Jpeg;
                    break;

                case "gif":
                    format = ImageFormat.Gif;
                    break;

                case "ico":
                    format = ImageFormat.Icon;
                    break;

                case "bmp":
                    format = ImageFormat.Bmp;
                    break;

                case "tiff":
                    format = ImageFormat.Tiff;
                    break;

                default:
                    break;
            }

            return format;
        }
    }
}