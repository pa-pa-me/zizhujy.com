using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net.Mime;
using System.Web.Mvc;
using System.Web.UI;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Helpers;
using ZiZhuJY.Web.Controllers;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class ImageController : CommonControllerBase
    {
        //
        // GET: /Image/

        [OutputCache(Duration = 60*60*24, Location = OutputCacheLocation.Any)]
        public ActionResult GetRandomImageSegment(string vdir)
        {
            var imageDirectory = System.Web.HttpContext.Current.Server.MapPath(vdir);
            var images = Directory.GetFiles(imageDirectory);
            var imageFullName = images[new Random().Next(0, images.Length)];

            var srcImage = Image.FromFile(imageFullName);
            var targetImage = CropImage(srcImage, GetRandomRectangle(srcImage.Width, srcImage.Height));

            var imageFormat = srcImage.RawFormat;
            var contentType = "image/{0}".FormatWith(imageFormat.ToDescriptiveString().ToLower());

            var bytes = targetImage.ToByteArray(imageFormat);
            
            var contentDisposition = new ContentDisposition
            {
                Inline = true,
                FileName = Path.GetFileName(imageFullName)
            };

            Response.AppendHeader("Content-Disposition", contentDisposition.ToString());
            return new FileContentResult(bytes, contentType);
        }

        private static Image CropImage(Image img, Rectangle cropArea)
        {
            var bitmap = new Bitmap(img);
            try
            {
                return bitmap.Clone(cropArea, bitmap.PixelFormat);
            }
            catch (OutOfMemoryException ex)
            {
                throw new Exception(
                    "CropArea = {0}; image: {1} x {2}."
                        .FormatWith(cropArea.ToJson(), img.Width, img.Height),
                    ex);
            }
        }

        private static Rectangle GetRandomRectangle(int maxWidth, int maxHeight)
        {
            var random = new Random();
            var x0 = random.Next(0, maxWidth);
            var width = random.Next(0, maxWidth - x0);
            var y0 = random.Next(0, maxHeight);
            var height = random.Next(0, maxHeight - y0);

            return new Rectangle(x0, y0, width, height);
        }

    }
}
