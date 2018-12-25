using System;
using System.Drawing;

namespace ZiZhuJY.ImageHandler
{
    /// <summary>
    /// Watermarker Template class
    /// </summary>
    public abstract class Watermarker : IDisposable
    {
        #region Properties

        private Image originImage;
        public Image OriginImage
        {
            get
            {
                return originImage;
            }
            set
            {
                originImage = value;
            }
        }

        private Image watermarkedImage;
        public Image WatermarkedImage
        {
            get
            {
                return watermarkedImage;
            }
            set
            {
                watermarkedImage = value;
            }
        }

        private SizeF watermarkSize;
        protected SizeF WatermarkSize
        {
            get
            {
                return watermarkSize;
            }
            set
            {
                watermarkSize = value;
            }
        }

        private float x;
        protected float X
        {
            get
            {
                return x;
            }
            set
            {
                x = value;
            }
        }

        private float y;
        protected float Y
        {
            get
            {
                return y;
            }
            set
            {
                y = value;
            }
        }

        private bool computeX = true;
        public bool ComputeX
        {
            get { return computeX; }
        }

        private bool computeY = true;
        public bool ComputeY
        {
            get { return computeY; }
        }

        private WatermarkHorizontalPostion hPos;
        public WatermarkHorizontalPostion HorizontalPosition
        {
            get
            {
                return hPos;
            }
            set
            {
                computeX = true;
                hPos = value;
            }
        }

        private WatermarkVerticalPostion vPos;
        public WatermarkVerticalPostion VerticalPosition
        {
            get
            {
                return vPos;
            }
            set
            {
                computeY = true;
                vPos = value;
            }
        }

        public WatermarkPostion Position
        {
            get
            {
                return GetPosition(this.HorizontalPosition , this.VerticalPosition) ;
            }
            set
            {
                this.HorizontalPosition = GetHorizentalPosition(value);
                this.VerticalPosition = GetVerticalPosition(value);
            }
        }

        private int hMarginPixel;
        public int HorizontalMarginPixel
        {
            get
            {
                return hMarginPixel;
            }
            set
            {
                hMarginPixel = value;
            }
        }

        private int vMarginPixel;
        public int VerticalMarginPixel
        {
            get
            {
                return vMarginPixel;
            }
            set
            {
                vMarginPixel = value;
            }
        }

        public double HorizontalMarginPercent
        {
            get
            {
                return this.HorizontalMarginPixel / this.OriginImage.Width;
            }
            set
            {
                double percent = value > 1 ? 1 : (value < 0 ? 0 : value);
                this.HorizontalMarginPixel = (int)(this.OriginImage.Width * percent);
            }
        }

        public double VerticalMarginPercent
        {
            get
            {
                return this.VerticalMarginPixel / this.OriginImage.Height;
            }
            set
            {
                double percent = value > 1 ? 1 : (value < 0 ? 0 : value);
                this.VerticalMarginPixel = (int)(this.originImage.Height * percent);
            }
        }

        private Color shadowColor;
        public Color ShadowColor
        {
            get
            {
                return shadowColor;
            }
            set
            {
                shadowColor = value;
            }
        }

        private Color foreColor;
        public Color ForeColor
        {
            get
            {
                return foreColor;
            }
            set
            {
                foreColor = value;
            }
        }

        public double ShadowOpacity
        {
            get
            {
                return shadowColor.A / 255;
            }
            set
            {
                double percent = value > 1 ? 1 : (value < 0 ? 0 : value);
                int alpha = (int)(255 * percent);

                shadowColor = Color.FromArgb(alpha, shadowColor);
            }
        }

        public virtual double ForegroundOpacity
        {
            get
            {
                return foreColor.A / 255;
            }
            set
            {
                double percent = value > 1 ? 1 : (value < 0 ? 0 : value);
                int alpha = (int)(255 * percent);

                foreColor = Color.FromArgb(alpha, foreColor);
            }
        }

        private int shadowOffsetX;
        public int ShadowOffsetX
        {
            get
            {
                return shadowOffsetX;
            }
            set
            {
                shadowOffsetX = value;
            }
        }

        private int shadowOffsetY;
        public int ShadowOffsetY
        {
            get
            {
                return shadowOffsetY;
            }
            set
            {
                shadowOffsetY = value;
            }
        }

        #endregion

        #region Contructor

        public Watermarker(Image originImage)
        {
            this.OriginImage = originImage;
            // 默认值
            this.ShadowColor = Color.FromArgb(153, 0, 0, 0);
            this.ForeColor = Color.FromArgb(153, 255, 255, 255);
            this.ShadowOffsetX = 1;
            this.ShadowOffsetY = 1;
            this.Position = WatermarkPostion.BottomRight;
            this.HorizontalMarginPixel = 10;
            this.VerticalMarginPixel = 10;
        }

        #endregion

        #region Methods

        public void SetX(float x)
        {
            this.X = x;
            computeX = false;
        }

        public void SetY(float y)
        {
            this.Y = y;
            computeY = false;
        }

        public void SetXY(float x, float y)
        {
            SetX(x);
            SetY(y);
        }

        /// <summary>
        /// Add water mark to original image
        /// </summary>
        public Image AddWatermark()
        {
            ComputeWatermarkSize();
            UpdateXY();
            watermarkedImage = AddWatermarkToOriginImage();

            return watermarkedImage;
        }

        /// <summary>
        /// hook
        /// </summary>
        /// <returns></returns>
        protected virtual SizeF ComputeWatermarkSize()
        {
            this.WatermarkSize = new SizeF(100f, 50f);
            return this.WatermarkSize;
        }

        /// <summary>
        /// hook
        /// </summary>
        protected virtual Image AddWatermarkToOriginImage()
        {
            return originImage;
        }
        
        /// <summary>
        /// hook
        /// </summary>
        protected virtual void UpdateXY()
        {
            if (this.ComputeX)
            {
                switch (this.HorizontalPosition)
                {
                    case WatermarkHorizontalPostion.Left:
                        this.X = this.HorizontalMarginPixel;
                        break;

                    case WatermarkHorizontalPostion.Center:
                        this.X = this.OriginImage.Width / 2 - this.WatermarkSize.Width / 2;
                        break;

                    case WatermarkHorizontalPostion.Right:
                        this.X = (this.OriginImage.Width - this.HorizontalMarginPixel - this.WatermarkSize.Width);
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

        private static WatermarkHorizontalPostion GetHorizentalPosition(WatermarkPostion pos)
        {
            // Mask: 000 111
            return (WatermarkHorizontalPostion)((char)pos & (char)0x07);
        }

        private static WatermarkVerticalPostion GetVerticalPosition(WatermarkPostion pos)
        {
            // Mask: 111 000
            return (WatermarkVerticalPostion)((char)pos & (char)0x38);
        }

        private static WatermarkPostion GetPosition(WatermarkHorizontalPostion hPos, WatermarkVerticalPostion vPos)
        {
            return (WatermarkPostion)((char)hPos | (char)vPos);
        }

        #endregion

        #region IDisposable 成员

        public virtual void Dispose()
        {
            this.OriginImage.Dispose();
            this.WatermarkedImage.Dispose();
        }

        #endregion
    }

    public enum WatermarkPostion
    {
        TopLeft = 0x24,         // 100 100
        TopCenter = 0x22,       // 100 010
        TopRight = 0x21,        // 100 001
        MiddleLeft = 0x14,      // 010 100
        MiddleCenter = 0x12,    // 010 010
        MiddleRight = 0x11,     // 010 001    
        BottomLeft = 0x0C,      // 001 100
        BottomCenter = 0x0A,    // 001 010
        BottomRight = 0x09,     // 001 001
    }

    public enum WatermarkHorizontalPostion
    {
        Left = 0x04,            // 000 100
        Center = 0x02,          // 000 010
        Right = 0x01,           // 000 001
    }

    public enum WatermarkVerticalPostion
    {
        Top = 0x20,             // 100 000
        Middle = 0x10,          // 010 000
        Bottom = 0x08,          // 001 000
    }
}
