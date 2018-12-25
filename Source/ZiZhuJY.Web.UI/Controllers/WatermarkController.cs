using System.IO;
using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;
using ZiZhuJY.Web.UI.Models;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    [CompressContent(Order = 9999)]
    [RemoveWhitespaces(Order = -1)]
    public class WatermarkController : Controller
    {
        //
        // GET: /Watermark/

        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Watermark/

        //[HttpPost]
        //public void Index(TextWatermarkModel model)
        //{
        //    if (ModelState.IsValid)
        //    {

        //        Response.ContentType = "image/jpeg";
        //        ImageHandler.TextWatermarker txtWatermarker = new ImageHandler.TextWatermarker(model.Image, model.CopyrightText);
        //        txtWatermarker.ChangeFont(model.FontFamily, model.Bold, model.Italic, model.Underline, model.StrikeThrough);
        //        txtWatermarker.Position = model.CopyrightPosition;
        //        txtWatermarker.AddWatermark();
        //        txtWatermarker.WatermarkedImage.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
        //        txtWatermarker.Dispose();
        //    }
        //    else
        //    {
        //    }
        //}

        [HttpPost]
        public Stream WatermarkText(TextWatermarkModel model)
        {
            if (ModelState.IsValid)
            {
                ImageHandler.TextWatermarker txtWatermarker = new ImageHandler.TextWatermarker(model.Image, model.CopyrightText);
                txtWatermarker.ChangeFont(model.FontFamily, model.Bold, model.Italic, model.Underline, model.StrikeThrough);
                txtWatermarker.Position = model.CopyrightPosition;
                txtWatermarker.AddWatermark();
                MemoryStream mem = new MemoryStream();
                //txtWatermarker.WatermarkedImage.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                
                string fileName = model.File.FileName;
                string extension = Path.GetExtension(fileName);
                Response.ContentType = "image/" + extension;
                txtWatermarker.WatermarkedImage.Save(mem, ImageHelper.GetImageFormatByExtension(extension));
                Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", fileName));
                mem.WriteTo(Response.OutputStream);
                mem.Dispose();
                txtWatermarker.Dispose();
                return Response.OutputStream;
            }
            else
            {
                return null;
            }
        }

        //
        // GET: /Watermark/ImageWatermark

        public ActionResult ImageWatermark()
        {
            return View();
        }

        [HttpPost]
        public Stream WatermarkImage(ImageWatermarkModel model)
        {
            if (ModelState.IsValid)
            {
                ImageHandler.ImageWatermarker imgWatermark = new ImageHandler.ImageWatermarker(model.Image, model.WatermarkImage);
                imgWatermark.Position = model.WatermarkPosition;
                imgWatermark.AddWatermark();
                MemoryStream mem = new MemoryStream();

                string fileName = model.File.FileName;
                string extension = Path.GetExtension(fileName);
                imgWatermark.WatermarkedImage.Save(mem, ImageHelper.GetImageFormatByExtension(extension));
                Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", fileName));
                mem.WriteTo(Response.OutputStream);
                mem.Dispose();
                imgWatermark.Dispose();

                return Response.OutputStream;
            }
            else
            {
                return null;
            }
        }
    }
}
