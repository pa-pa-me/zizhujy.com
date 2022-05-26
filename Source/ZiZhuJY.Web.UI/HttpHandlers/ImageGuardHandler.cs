using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Web;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.HttpHandlers
{
    public class ImageGuardHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var response = context.Response;
            var request = context.Request;
            string imagePath = null;

            // Check whether the page requesting the image is from your site.
            if (request.UrlReferrer != null)
            {
                // Perform a case-insensitive comparison of the referer.
                if (string.Compare(request.Url.Host, request.UrlReferrer.Host, true, CultureInfo.InvariantCulture) == 0)
                {
                    // The requesting host is correct.
                    // Allow the image to be served(if it exists).
                    imagePath = request.PhysicalPath;
                    if (!File.Exists(imagePath))
                    {
                        response.StatusCode = 404;
                        response.StatusDescription = "File not found";
                        return;
                    }
                    else
                    {
                        // Serve the image normally
                        response.ContentType = GetMimeTypeByFileExtension(Path.GetExtension(imagePath));
                        response.WriteFile(imagePath);
                        return;
                    }
                }
                else
                {
                    // Add watermark to the image
                    imagePath = request.PhysicalPath;

                    // Set the content type to the appropriate image type.
                    var extension = Path.GetExtension(imagePath);
                    if (extension != null)
                    {
                        response.ContentType = "image/" + extension.Replace(".", "").ToLower();
                    }
                    else
                    {
                        response.ContentType = "image/*";
                    }

                    // Serve the image.
                    var image = Image.FromFile(imagePath);

                    var txtWatermarker = new ImageHandler.TextWatermarker(image, "zizhujy.com");
                    txtWatermarker.AddWatermark();

                    image = txtWatermarker.WatermarkedImage;
                    //image.Save(response.OutputStream, ImageHelper.GetImageFormatByExtension(Path.GetExtension(imagePath)));

                    var mem = new MemoryStream();
                    image.Save(mem, ImageHelper.GetImageFormatByExtension(Path.GetExtension(imagePath)));

                    // Write the MemoryStream data to the OutputStream
                    response.ContentType = GetMimeTypeByFileExtension(imagePath);
                    mem.WriteTo(response.OutputStream);

                    mem.Dispose();

                    image.Dispose();
                    txtWatermarker.Dispose();
                    return;
                }
            }
            else
            {
                // Add watermark to the image
                imagePath = request.PhysicalPath;

                // Set the content type to the appropriate image type.
                var extension = Path.GetExtension(imagePath);
                if (extension != null)
                {
                    response.ContentType = "image/" + extension.Replace(".", "").ToLower();
                }
                else
                {
                    response.ContentType = "image/*";
                }

                // Serve the image.
                var image = Image.FromFile(imagePath);
                var txtWatermarker = new ImageHandler.TextWatermarker(image, "zizhujy.com");
                txtWatermarker.AddWatermark();
                image = txtWatermarker.WatermarkedImage;

                // If the image is in PNG format, then it can be saved into response.OutputStream directly 
                var format = ImageHelper.GetImageFormatByExtension(Path.GetExtension(imagePath));
                //if (format.Equals(ImageFormat.Png))
                if (true)
                {
                    // Create the PNG in memory
                    var mem = new MemoryStream();
                    image.Save(mem, ImageFormat.Png);

                    // Write the MemoryStream data to the output stream.
                    response.ContentType = GetMimeTypeByFileExtension(imagePath);
                    mem.WriteTo(response.OutputStream);
                    mem.Dispose();
                }
                else
                {
                    image.Save(response.OutputStream, format);
                }

                image.Dispose();
                txtWatermarker.Dispose();
                return;
            }
        }

        public bool IsReusable
        {
            get { return true; }
        }

        private string GetMimeTypeByFileExtension(string fileExtension)
        {
            switch (fileExtension.ToLower())
            {
                case ".txt":
                    return "text/plain";
                case ".doc":
                    return "application/ms-word";
                case ".xls":
                    return "application/vnd.ms-excel";
                case ".gif":
                    return "image/gif";
                case ".jpg":
                case "jpeg":
                    return "image/jpeg";
                case ".bmp":
                    return "image/bmp";
                case ".png":
                    return "image/png";
                case ".wav":
                    return "audio/wav";
                case ".ppt":
                    return "application/mspowerpoint";
                case "dwg":
                    return "image/vnd.dwg";
                default:
                    return "application/octet-stream";
            }
        }
    }
}