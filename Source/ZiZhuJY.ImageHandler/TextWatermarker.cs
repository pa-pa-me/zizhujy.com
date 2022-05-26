using System.Drawing;
using System.Collections.Generic;

namespace ZiZhuJY.ImageHandler
{
    public class TextWatermarker : Watermarker
    {
        #region Properties

        private string watermarkText;
        public string WatermarkText
        {
            get
            {
                return watermarkText;
            }
            set
            {
                watermarkText = value;
            }
        }

        // 自动计算最合适的水印文本字体大小
        private bool autoSize = true;
        public bool AutoSize
        {
            get
            {
                return autoSize;
            }
            set
            {
                autoSize = value;
            }
        }

        private double fontSizePercent;
        public double FontSizePercent
        {
            get { return fontSizePercent; }
            set {
                fontSizePercent = value > 1 ? 1 : (value <= 0.01 ? 0.01 : value);
            }
        }

        private List<Font> fonts = new List<Font>();
        public List<Font> Fonts
        {
            get
            {
                return fonts;
            }
            set
            {
                fonts = value;
            }
        }

        private Font bestFont = new Font("Arial", 12, FontStyle.Regular, GraphicsUnit.Pixel);
        public Font BestFont{
            get{
                return bestFont;
            }
            set
            {
                bestFont = value;
            }
        }

        private StringFormat StringFormat
        {
            get
            {
                StringFormat format = new StringFormat();
                if (this.ComputeX)
                {
                    switch (this.HorizontalPosition)
                    {
                        case WatermarkHorizontalPostion.Left:
                            format.Alignment = StringAlignment.Near;
                            break;

                        case WatermarkHorizontalPostion.Center:
                            format.Alignment = StringAlignment.Center;
                            break;

                        case WatermarkHorizontalPostion.Right:
                            format.Alignment = StringAlignment.Far;
                            break;
                    }
                }
                else
                {
                    format.Alignment = StringAlignment.Near;
                }

                return format;
            }
        }

        #endregion

        #region Constructor

        public TextWatermarker(Image originImage, string watermarkText) : base(originImage)
        {
            this.WatermarkText = watermarkText;

            // Default values
            this.Fonts.Add(new Font("Arial", 18, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 16, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 14, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 12, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 10, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 8, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 6, FontStyle.Regular, GraphicsUnit.Pixel));
            this.Fonts.Add(new Font("Arial", 4, FontStyle.Regular, GraphicsUnit.Pixel));
            this.FontSizePercent = 30.00 / 480.00;
            this.AutoSize = true;
        }

        #endregion

        #region Methods

        public void ChangeFont(string fontFamily, bool bold, bool italic, bool underline, bool strikeThrough)
        {
            FontStyle fontStyle = FontStyle.Regular;

            if (bold) fontStyle = fontStyle | FontStyle.Bold;
            if (italic) fontStyle = fontStyle | FontStyle.Italic;
            if (underline) fontStyle = fontStyle | FontStyle.Underline;
            if (strikeThrough) fontStyle = fontStyle | FontStyle.Strikeout;

            ChangeFont(fontFamily, fontStyle);
        }

        public void ChangeFontFamily(string fontFamily)
        {
            FontFamily ff = new FontFamily(fontFamily);
            ChangeFontFamily(ff);
        }

        public void ChangeFont(string fontFamily, FontStyle fontStyle)
        {
            for (int i = 0; i < this.Fonts.Count; i++)
            {
                this.Fonts[i] = new Font(fontFamily, this.Fonts[i].Size, fontStyle, this.Fonts[i].Unit, this.Fonts[i].GdiCharSet, this.Fonts[i].GdiVerticalFont);
            }
            this.BestFont = new Font(fontFamily, this.BestFont.Size, fontStyle, this.BestFont.Unit, this.BestFont.GdiCharSet, this.BestFont.GdiVerticalFont);
        }

        public void ChangeFont(FontFamily fontFamily, FontStyle fontStyle)
        {
            for (int i = 0; i < this.Fonts.Count; i++)
            {
                this.Fonts[i] = new Font(fontFamily, this.Fonts[i].Size, fontStyle, this.Fonts[i].Unit, this.Fonts[i].GdiCharSet, this.Fonts[i].GdiVerticalFont);
            }
            this.BestFont = new Font(fontFamily, this.BestFont.Size, fontStyle, this.BestFont.Unit, this.BestFont.GdiCharSet, this.BestFont.GdiVerticalFont);
        }

        public void ChangeFontFamily(Font font)
        {
            for (int i = 0; i < this.Fonts.Count; i++)
            {
                this.Fonts[i] = new Font(font.FontFamily, this.Fonts[i].Size, font.Style, this.Fonts[i].Unit, this.Fonts[i].GdiCharSet, this.Fonts[i].GdiVerticalFont);
            }
            this.BestFont = new Font(font.FontFamily, this.BestFont.Size, font.Style, this.BestFont.Unit, this.BestFont.GdiCharSet, this.BestFont.GdiVerticalFont);
        }

        public void ChangeFontFamily(FontFamily fontFamily)
        {
            for (int i = 0; i < this.Fonts.Count; i++)
            {
                this.Fonts[i] = new Font(fontFamily, this.Fonts[i].Size, this.Fonts[i].Style, this.Fonts[i].Unit, this.Fonts[i].GdiCharSet, this.Fonts[i].GdiVerticalFont);
            }
            this.BestFont = new Font(fontFamily, this.BestFont.Size, this.BestFont.Style, this.BestFont.Unit, this.BestFont.GdiCharSet, this.BestFont.GdiVerticalFont);
        }

        protected override SizeF ComputeWatermarkSize()
        {
            FindAvailableMaxSizedFont();
            return this.WatermarkSize;
        }

        protected override void UpdateXY()
        {
            if (this.ComputeX)
            {
                switch (this.HorizontalPosition)
                {
                    case WatermarkHorizontalPostion.Left:
                        this.X = this.HorizontalMarginPixel;
                        break;

                    case WatermarkHorizontalPostion.Center:
                        this.X = this.OriginImage.Width / 2;
                        break;

                    case WatermarkHorizontalPostion.Right:
                        this.X = (this.OriginImage.Width - this.HorizontalMarginPixel);
                        break;

                    default:
                        break;
                }
            }

            if (this.ComputeY)
            {
                switch (this.VerticalPosition)
                {
                    case WatermarkVerticalPostion.Top:
                        this.Y = this.VerticalMarginPixel;
                        break;

                    case WatermarkVerticalPostion.Middle:
                        this.Y = this.OriginImage.Height / 2 - this.WatermarkSize.Height / 2;
                        break;

                    case WatermarkVerticalPostion.Bottom:
                        this.Y = (this.OriginImage.Height - this.VerticalMarginPixel - this.WatermarkSize.Height);
                        break;

                    default:
                        break;
                }
            }
        }

        protected override Image AddWatermarkToOriginImage()
        {
            this.WatermarkedImage = this.OriginImage;
            if (this.BestFont != null)
            {
                Graphics g = Graphics.FromImage(this.WatermarkedImage);
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                SolidBrush semiTransBrushShadow = new SolidBrush(this.ShadowColor);

                StringFormat format = this.StringFormat;
                g.DrawString(this.WatermarkText, this.BestFont, semiTransBrushShadow, new PointF(this.X + this.ShadowOffsetX, this.Y + this.ShadowOffsetY), format);
                SolidBrush semiTransBrush = new SolidBrush(this.ForeColor);
                g.DrawString(this.WatermarkText, this.BestFont, semiTransBrush, new PointF(this.X, this.Y), format);
                g.Dispose();
            }
            return this.WatermarkedImage;
        }

        private Font FindAvailableMaxSizedFont()
        {
            if (this.AutoSize)
            {
                this.BestFont = FindAvailableMaxSizedFont(false);
                if (this.BestFont != null)
                {
                    if (this.BestFont.Size >= 16)
                    {
                        return this.BestFont;
                    }
                    else
                    {
                        return FindAvailableMaxSizedFont(true);
                    }
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return FindAvailableMaxSizedFont(true);
            }
        }

        private Font FindAvailableMaxSizedFont(bool byAbsoluteSizes)
        {
            if (byAbsoluteSizes)
            {
                this.Fonts.Sort(delegate(Font font1, Font font2) { return font2.Size.CompareTo(font1.Size); });
                SizeF size = new SizeF();
                Bitmap image = new Bitmap(1, 1);
                Graphics g = Graphics.FromImage(image);

                for (int i = 0; i < this.Fonts.Count; i++)
                {
                    //size = MeasureSize(this.WatermarkText, this.Fonts[i]);
                    size = g.MeasureString(this.WatermarkText, this.Fonts[i]);
                    if ((ushort)(size.Width + this.HorizontalMarginPixel * 2) < (ushort)this.OriginImage.Width && (ushort)(size.Height + this.VerticalMarginPixel * 2) < (ushort)this.OriginImage.Height)
                    {
                        g.Dispose();
                        image.Dispose();
                        this.WatermarkSize = size;
                        this.BestFont = this.fonts[i];
                        return this.Fonts[i];
                    }
                }

                g.Dispose();
                image.Dispose();

                this.WatermarkSize = new SizeF(0, 0);
                return null;
            }
            else
            {
                int fontSize = (int)(this.OriginImage.Height * this.FontSizePercent);
                fontSize = fontSize >= 1 ? fontSize : 1;
                this.BestFont = new Font(this.BestFont.FontFamily, fontSize, this.BestFont.Style, this.BestFont.Unit);
                this.WatermarkSize = MeasureSize(this.WatermarkText, this.BestFont);
                if ((ushort)(this.WatermarkSize.Width + this.HorizontalMarginPixel * 2) < (ushort)this.OriginImage.Width && (ushort)(this.WatermarkSize.Height + this.VerticalMarginPixel * 2) < (ushort)this.OriginImage.Height)
                {
                    return this.BestFont;
                }
                else
                {
                    this.WatermarkSize = new SizeF(0, 0);
                    return null;
                }
            }
        }

        private SizeF MeasureSize(string text, Font font)
        {
            // Use a test image to measure the text.
            Bitmap image = new Bitmap(1, 1);
            Graphics g = Graphics.FromImage(image);
            SizeF size = g.MeasureString(text, font);
            g.Dispose();
            image.Dispose();

            return size;
        }

        #endregion
    }
}
