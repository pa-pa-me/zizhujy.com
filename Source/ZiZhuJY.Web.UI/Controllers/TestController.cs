using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Reflection;
using System.Text;
using System.Web.Mvc;
using ZiZhuJY.ImageHandler;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class TestController : Controller
    {
        //
        // GET: /Test/

        public ActionResult Index()
        {
            return View("Html5AppIndex");

            /*
            // Create the in-memory bitmap where you will draw the image.
            // This bitmap is 300 pixels wide and 50 pixels high.
            Bitmap image = new Bitmap(300, 50);

            Graphics g = Graphics.FromImage(image);

            // Draw a solid white rectangle.
            // Start from point (1,1).
            // Make it 298 ixels wide and 48 pixels high.
            g.FillRectangle(Brushes.White, 1, 1, 298, 48);
            Font font = new Font("Arial", 20, FontStyle.Regular);
            
            g.DrawString("http://www.zizhujy.com", font, Brushes.Blue, 10, 5);

            Response.ContentType = "image/gif";
            // Render the image to the output stream.
            image.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Gif);

            g.Dispose();
            image.Dispose();
             */
        }

        public ActionResult Test()
        {
            return View("Index");
        }

        public void AddWatermark2()
        {
            Image originImage = Image.FromFile(@"C:\1305211066-1784_600-0_6-0.jpg");
            //Image image = ImageHandler.WatermarkHandler.AddCopyrightText(originImage, "copyright", Color.FromArgb(153,0,0,0),Color.FromArgb(153,255,255,255),
            //    1,1,"Arial", FontStyle.Bold, StringAlignment.Far, 72f,72f);

            //Image image = ImageHandler.WatermarkHandler.AddCopyrightText(originImage, "中文", CopyrightPosition.TopLeft);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.TopCenter);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.TopRight);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.MiddleLeft);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.MiddleCenter);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.MiddleRight);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.BottomLeft);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.BottomCenter);
            //image = ImageHandler.WatermarkHandler.AddCopyrightText(image, "copyright", CopyrightPosition.BottomRight);

            TextWatermarker txtWatermarkder = new TextWatermarker(originImage, "Hello");
            txtWatermarkder.HorizontalPosition = WatermarkHorizontalPostion.Right;
            txtWatermarkder.VerticalPosition = WatermarkVerticalPostion.Bottom;
            Image image = txtWatermarkder.AddWatermark();

            Response.ContentType = "image/jpeg";
            image.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

            originImage.Dispose();
            image.Dispose();
            txtWatermarkder.Dispose();
        }

        public void AddWatermark()
        {
            // First, add the image watermark
            Image originImage = Image.FromFile(@"C:\source.jpg");
            Image watermark = Image.FromFile(@"C:\clock.png");

            ImageWatermarker imgWatermarker = new ImageWatermarker(originImage, watermark);
            // You can set the watermark size, if you not then the watermark will be its original size by default
            imgWatermarker.SetWatermarkHeight(80);
            imgWatermarker.AddWatermark();

            // Second, add the text watermark
            TextWatermarker txtWatermarker = new TextWatermarker(imgWatermarker.WatermarkedImage, "www.zizhujy.com");
            txtWatermarker.Position = WatermarkPostion.TopLeft;
            txtWatermarker.AddWatermark();

            // Response and show the watermarked image in the browser
            Response.ContentType = "image/jpeg";
            // Note: save the secondly watermarked image 
            //  (txtWatermarker not imgWatermarker because the txtWatermarker comes after than imgWatermarker)
            txtWatermarker.WatermarkedImage.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

            imgWatermarker.Dispose();
            watermark.Dispose();
            originImage.Dispose();
        }


            //Image originImage = Image.FromFile(@"C:\source.jpg");
            //Image watermark = Image.FromFile(@"C:\clock.png");
            //ImageWatermarker imgWatermarker = new ImageWatermarker(originImage, watermark);
            //imgWatermarker.Position = WatermarkPostion.BottomRight;
            //imgWatermarker.SetWatermarkHeight(70);

            //imgWatermarker.ForegroundOpacity = 0.5;
            //imgWatermarker.AddWatermark();

            //TextWatermarker txtWatermark = new TextWatermarker(imgWatermarker.WatermarkedImage, "www.zizhujy.com");
            //txtWatermark.Position = WatermarkPostion.TopLeft;
            //txtWatermark.AddWatermark();
            
            //Response.ContentType = "image/jpeg";
            //txtWatermark.WatermarkedImage.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

            //originImage.Dispose();
            //watermark.Dispose();
            //imgWatermarker.Dispose();

            //txtWatermark.Dispose();
        //}

        public void AddWatermark3()
        {
            Image originImage = Image.FromFile(@"C:\1305211066-1784_600-0_6-0.jpg");
            Image watermark = Image.FromFile(@"C:\logo.png");
            ImageWatermarker imgWatermarker = new ImageWatermarker(originImage, watermark);
            imgWatermarker.Position = WatermarkPostion.TopRight;
            imgWatermarker.ForegroundOpacity = 0.9;
            imgWatermarker.AddWatermark();
            
            Response.ContentType = "image/jpeg";
            imgWatermarker.WatermarkedImage.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

            originImage.Dispose();
            watermark.Dispose();
            imgWatermarker.Dispose();
        }

        public void AddWatermark4()
        {
            //Image originImage = Image.FromFile(@"C:\1305211066-1784_600-0_6-0.jpg");
            
            //Image image = ImageHandler.WatermarkHandler.AddCopyrightText(originImage, "Hello", Color.FromArgb(153, 0, 0,0), Color.FromArgb(153, 255,255,255), new int[] {20}, CopyrightPosition.BottomRight, 0.01, 1, 1, "Arial", FontStyle.Regular, 72f, 72f);

            //Response.ContentType = "image/jpeg";
            //image.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

            //originImage.Dispose();
            //image.Dispose();
        }

        public ActionResult Base64ToImage()
        {
            return View();
        }

        [HttpPost]
        public void Base64ToImage(string base64)
        {
            byte[] binary = System.Convert.FromBase64String(base64);

            Response.ContentType = "image/*";
            Response.BinaryWrite(binary);
        }

        public ActionResult LaTex()
        {
            return View();
        }

        public ActionResult DownloadToServer()
        {
            return View();
        }

        [HttpPost]
        public string DownloadToServer(string url, string virtualPath)
        {
            //WebClient webClient = new WebClient();
            //string localFileName = url.Substring(url.LastIndexOf("/")+1);
            //string localPath = Server.MapPath(virtualPath);
            //if(!localPath.EndsWith("\\"))localPath += "\\";
            //webClient.DownloadFile(url, localPath + localFileName);

            //return localPath + localFileName;
            return "Over";
        }

        public ActionResult TreeLab()
        {
            return View();
        }

        public ActionResult ObjectViewer()
        {
            return View();
        }

        public ActionResult Lex()
        {
            return View();
        }

        public ActionResult Lex2()
        {
            return View();
        }

        public ActionResult ParserQunit()
        {
            return View();
        }

        public ActionResult ParserQunit2()
        {
            return View();
        }

        public ActionResult String_Format()
        {
            return View();
        }

        public ActionResult String()
        {
            return View();
        }

        public ActionResult IconFonts()
        {
            return View();
        }

        public ActionResult FunGrapherAppTest()
        {
            return View();
        }

        public string WriteFile()
        {
            Process p = new Process();
            p.StartInfo.WorkingDirectory = Server.MapPath("/");
            p.StartInfo.FileName = Server.MapPath("/SimpleConsole.exe");
            bool start = p.Start();
            p.WaitForExit();
            return start.ToString();
        }

        public JsonResult ListAllProcesses()
        {
            Process[] processList = Process.GetProcesses();
            return Json(processList, JsonRequestBehavior.AllowGet);
        }

        public string StartProcess()
        {
            Process p = new Process();
            p.StartInfo.WorkingDirectory = Server.MapPath("/");
            p.StartInfo.FileName = Server.MapPath("/SimpleConsole.exe");
            p.StartInfo.CreateNoWindow = true;
            p.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            
            bool start = p.Start();
            
            return string.Format("Status: {0}; ID: {1}, SessionID: {2}", start, p.Id, p.SessionId);            
        }

        public string EndProcess(int id)
        {
            Process p = Process.GetProcessById(id);
            p.Kill();
            p.Close();
            p.Dispose();           
            return id.ToString();
        }

        public string ListClientInfo()
        {
            StringBuilder sb = new StringBuilder();
            //Dictionary<string, string> list = ListObject(Request);
            //foreach (var item in list)
            //{
            //    sb.AppendFormat("{0}: {1}<br />\n", item.Key, item.Value);
            //}

            sb.AppendFormat("{0}: {1}<br />\n", "UserHostAddress", Request.UserHostAddress.ToString());
            sb.AppendFormat("{0}: {1}<br />\n", Request.UserHostName.GetType().ToString(), Request.UserHostName.ToString());
            sb.AppendFormat("{0}: {1}<br />\n", "User Port", Request.ServerVariables["REMOTE_PORT"]);
            sb.AppendFormat("{0}: {1}<br />\n", "User Port", Request.ServerVariables["SERVER_PORT"]);

            return sb.ToString();
        }

        public string NetStat()
        {
            Process process = new Process();
            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            startInfo.WorkingDirectory = Server.MapPath("/");
            startInfo.FileName = "cmd.exe";
            startInfo.Arguments = "/C netstat -N >" + Server.MapPath("/test.txt");
            process.StartInfo = startInfo;
            bool start = process.Start();
            int id = process.Id;
            bool timeout = process.WaitForExit(10000);
            try
            {
                process.Kill();
            }
            catch
            {
                // ignore
            }
            process.Close();
            process.Dispose();
            return string.Format("Process {0} started {1}, wait timeout: {2}, killed", id, start, timeout); ;
        }

        private Dictionary<string, string> ListObject<T>(T o)
        {
            Dictionary<string, string> list = new Dictionary<string, string>();
            foreach (PropertyInfo pi in o.GetType().GetProperties())
            {
                if (pi != null && pi.CanRead && pi.Name != null)
                    list.Add(pi.Name, pi.GetValue(o, null).ToString());
            }

            return list;
        }
    }
}
