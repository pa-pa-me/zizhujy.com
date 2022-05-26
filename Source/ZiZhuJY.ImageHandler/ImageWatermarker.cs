using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;

namespace ZiZhuJY.ImageHandler
{
    public class ImageWatermarker : Watermarker
    {
        #region Properties

        private Image watermarkImage;
        public Image WatermarkImage
        {
            get
            {
                return watermarkImage;
            }
            set
            {
                watermarkImage =value;
            }
        }

        // 自动计算最合适的水印图片大小
        private bool autoSize = true;
        public bool AutoSize
        {
            get { return autoSize; }
            set
            {
                autoSize = value;
            }
        }

        private ImageAttributes imageAttributes = new ImageAttributes();
        public ImageAttributes ImageAttributes
        {
            get
            {
                return imageAttributes;
            }
            set
            {
                imageAttributes = value;
            }
        }

        private List<ColorMap> colorMaps = new List<ColorMap>();
        public List<ColorMap> ColorMaps
        {
            get
            {
                return colorMaps;
            }
            set { colorMaps = value; }
        }

        public float[][] ColorMatrixElements
        {
            get
            {
                if (this.ColorMatrix != null)
                {
                    return new float[][] {
                        new float[] {this.ColorMatrix.Matrix00, this.ColorMatrix.Matrix01, this.ColorMatrix.Matrix02, this.ColorMatrix.Matrix03, this.ColorMatrix.Matrix04},
                        new float[] {this.ColorMatrix.Matrix10, this.ColorMatrix.Matrix11, this.ColorMatrix.Matrix12, this.ColorMatrix.Matrix13, this.ColorMatrix.Matrix14},
                        new float[] {this.ColorMatrix.Matrix20, this.ColorMatrix.Matrix21, this.ColorMatrix.Matrix22, this.ColorMatrix.Matrix23, this.ColorMatrix.Matrix24},
                        new float[] {this.ColorMatrix.Matrix30, this.ColorMatrix.Matrix31, this.ColorMatrix.Matrix32, this.ColorMatrix.Matrix33, this.ColorMatrix.Matrix34},
                        new float[] {this.ColorMatrix.Matrix40, this.ColorMatrix.Matrix41, this.ColorMatrix.Matrix42, this.ColorMatrix.Matrix43, this.ColorMatrix.Matrix44}
                    };
                }
                else
                {
                    return null;
                }
            }
            set
            {
                this.ColorMatrix.Matrix00 = value[0][0];
                this.ColorMatrix.Matrix01 = value[0][1];
                this.ColorMatrix.Matrix02 = value[0][2];
                this.ColorMatrix.Matrix03 = value[0][3];
                this.ColorMatrix.Matrix04 = value[0][4];
                this.ColorMatrix.Matrix10 = value[1][0];
                this.ColorMatrix.Matrix11 = value[1][1];
                this.ColorMatrix.Matrix12 = value[1][2];
                this.ColorMatrix.Matrix13 = value[1][3];
                this.ColorMatrix.Matrix14 = value[1][4];
                this.ColorMatrix.Matrix20 = value[2][0];
                this.ColorMatrix.Matrix21 = value[2][1];
                this.ColorMatrix.Matrix22 = value[2][2];
                this.ColorMatrix.Matrix23 = value[2][3];
                this.ColorMatrix.Matrix24 = value[2][4];
                this.ColorMatrix.Matrix30 = value[3][0];
                this.ColorMatrix.Matrix31 = value[3][1];
                this.ColorMatrix.Matrix32 = value[3][2];
                this.ColorMatrix.Matrix33 = value[3][3];
                this.ColorMatrix.Matrix34 = value[3][4];
                this.ColorMatrix.Matrix40 = value[4][0];
                this.ColorMatrix.Matrix41 = value[4][1];
                this.ColorMatrix.Matrix42 = value[4][2];
                this.ColorMatrix.Matrix43 = value[4][3];
                this.ColorMatrix.Matrix44 = value[4][4];
            }
        }

        private ColorMatrix colorMatrix;
        public ColorMatrix ColorMatrix
        {
            get
            {
                return colorMatrix;
            }
            set
            {
                colorMatrix = value;
            }
        }

        private bool keepScale;
        public bool KeepScale
        {
            get { return keepScale; }
            set { keepScale = value; }
        }

        public override double ForegroundOpacity
        {
            get
            {
                return base.ForegroundOpacity;
            }
            set
            {
                double percent = value > 1 ? 1 : (value < 0 ? 0 : value);

                base.ForegroundOpacity = percent;
                this.ColorMatrix.Matrix33 = (float)percent;
            }
        }

        #endregion

        #region Constructor

        public ImageWatermarker(Image originImage, Image watermarkImage)
            : base(originImage)
        {
            this.WatermarkImage = watermarkImage;

            // Default values
            this.ColorMaps.Add(new ColorMap());
            this.ColorMaps[0].OldColor = Color.FromArgb(255, 255, 255, 255);
            this.ColorMaps[0].NewColor = Color.FromArgb(0, 0, 0, 0);

            float[][] colorMatrixElements = {
                new float[]{1.0f, 0.0f, 0.0f, 0.0f, 0.0f},
                new float[]{0.0f, 1.0f, 0.0f, 0.0f, 0.0f},
                new float[]{0.0f, 0.0f, 1.0f, 0.0f, 0.0f},
                new float[]{0.0f, 0.0f, 0.0f, 0.3f, 0.0f},
                new float[]{0.0f, 0.0f, 0.0f, 0.0f, 1.0f}   
            };
            this.ColorMatrix = new ColorMatrix(colorMatrixElements);
            this.WatermarkSize = this.WatermarkImage.Size;
            this.KeepScale = true;
        }

        #endregion

        #region Methods

        protected override SizeF ComputeWatermarkSize()
        {
            if (this.AutoSize)
            {
                this.SetWatermarkWidth((int)(this.OriginImage.Width * 0.2));                
            }
            else
            {
            }
            return this.WatermarkSize;
        }

        protected override Image AddWatermarkToOriginImage()
        {
            this.WatermarkedImage = this.OriginImage;
            Graphics watermarkGraphic = Graphics.FromImage(this.WatermarkedImage);

            this.ImageAttributes.SetRemapTable(this.ColorMaps.ToArray(), ColorAdjustType.Bitmap);
            this.ImageAttributes.SetColorMatrix(this.ColorMatrix, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);

            watermarkGraphic.DrawImage(this.WatermarkImage,
                new Rectangle((int)this.X, (int)this.Y, (int)this.WatermarkSize.Width, (int)this.WatermarkSize.Height),
                0, 0, this.WatermarkImage.Width, this.WatermarkImage.Height,
                GraphicsUnit.Pixel, this.ImageAttributes);

            watermarkGraphic.Dispose();
            imageAttributes.Dispose();

            return this.WatermarkedImage;
        }

        public void SetWatermarkWidth(int width)
        {
            float height = this.WatermarkSize.Height;
            if (this.KeepScale)
            {
                height = height * width / this.WatermarkSize.Width;
            }

            this.WatermarkSize = new SizeF(width, height);
        }

        public void SetWatermarkHeight(int height)
        {
            float width = this.WatermarkSize.Width;
            if (this.KeepScale)
            {
                width = width * height / this.WatermarkSize.Height;
            }

            this.WatermarkSize = new SizeF(width, height);
        }

        public void SetWatermarkSize(int width, int height)
        {
            this.WatermarkSize = new SizeF(width, height);
            this.KeepScale = false;
        }

        public override void Dispose()
        {
            base.Dispose();
            this.WatermarkImage.Dispose();
        }

        #endregion
    }
}
