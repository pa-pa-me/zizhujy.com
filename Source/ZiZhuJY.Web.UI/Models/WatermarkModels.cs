using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.IO;
using System.Web;
using ZiZhuJY.ImageHandler;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.Models
{
    #region Models

    public class TextWatermarkModel
    {
        private HttpPostedFileBase file;
        [Required]
        [Display(Name = "Image 图像")]
        public HttpPostedFileBase File
        {
            get { return file; }
            set
            {
                file = value;
                if (file != null)
                {
                    string extension = Path.GetExtension(file.FileName);
                    if (ImageHelper.GetImageFormatByExtension(extension) != null)
                    {
                        image = Image.FromStream(file.InputStream);
                    }
                }
            }
        }

        private Image image;
        public Image Image { get { return image; } set { image = value; } }

        [Required]
        [Display(Name = "Watermark Text 水印文本")]
        public string CopyrightText { get; set; }

        [Display(Name = "Watermark Shadow Color 水印阴影颜色")]
        public Color ShadowColor { get; set; }

        [Display(Name = "Watermark Shadow Opacity 阴影透明度")]
        public double ShadowOpacity { get; set; }

        [Display(Name = "Watermark Text Color 水印文本颜色")]
        public Color TextColor { get; set; }

        [Display(Name = "Watermark Text Opacity水印文本透明度")]
        public double TextOpacity { get; set; }

        [Display(Name = "Watermark Position 水印位置")]
        public WatermarkPostion CopyrightPosition { get; set; }

        [Display(Name = "Watermark Font 水印字体")]
        public string FontFamily { get; set; }

        //[Display(Name = "Watermark Font Style 字体样式")]
        //public FontStyle FontStyle { get; set; }

        [Display(Name="Bold 加粗")]
        public bool Bold { get; set; }

        [Display(Name = "Italic 倾斜")]
        public bool Italic { get; set; }

        [Display(Name = "Underline 下划线")]
        public bool Underline { get; set; }

        [Display(Name = "StrikeThrough 删除线")]
        public bool StrikeThrough { get; set; }
    }

    public class ImageWatermarkModel
    {
        private HttpPostedFileBase file;
        [Required]
        [Display(Name = "Source Image 源图像")]
        public HttpPostedFileBase File
        {
            get { return file; }
            set
            {
                file = value;
                if (file != null)
                {
                    string extension = Path.GetExtension(file.FileName);
                    if (ImageHelper.GetImageFormatByExtension(extension) != null)
                    {
                        image = Image.FromStream(file.InputStream);
                    }
                }
            }
        }

        private Image image;
        public Image Image { get { return image; } set { image = value; } }

        private HttpPostedFileBase fileWatermark;
        [Required]
        [Display(Name = "Watermark Image 水印图片")]
        public HttpPostedFileBase FileWatermark
        {
            get { return fileWatermark; }
            set
            {
                fileWatermark = value;
                if (fileWatermark != null)
                {
                    string extension = Path.GetExtension(fileWatermark.FileName);
                    if (ImageHelper.GetImageFormatByExtension(extension) != null)
                    {
                        watermarkImage = Image.FromStream(fileWatermark.InputStream);
                    }
                }
            }
        }
        private Image watermarkImage;
        public Image WatermarkImage { get { return watermarkImage; } set { watermarkImage = value; } }

        [Display(Name = "Watermark Opacity 水印透明度")]
        public double WatermarkOpacity { get; set; }

        [Display(Name = "Watermark Position 水印位置")]
        public WatermarkPostion WatermarkPosition { get; set; }
    }

    #endregion
}