using System.Drawing;

namespace ZiZhuJY.ImageHandler.IcoMaker
{
    public class IcoMaker
    {
        public static Icon FromImage(Image image)
        {
            return FromImage(image, image.Width, image.Height);
        }

        public static Icon FromImage(Image image, int width, int height)
        {
            Bitmap bitmap = new Bitmap(image, width, height);
            Icon icon = Icon.FromHandle(bitmap.GetHicon());
            return icon;
        }
    }
}
