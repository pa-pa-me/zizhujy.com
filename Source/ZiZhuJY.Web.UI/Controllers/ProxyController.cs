using System;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Mvc;
using ZiZhuJY.Common.Helpers;
using ZiZhuJY.Web.UI.Models;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class ProxyController : Controller
    {
        //
        // GET: /Proxy/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Index(ProxyParams proxyParams, string action)
        {
            if (action.Equals("Submit", StringComparison.OrdinalIgnoreCase))
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(proxyParams.Url);
                request.Method = proxyParams.Type;
                request.ContentType = proxyParams.ContentType;
                request.ContentLength = proxyParams.ContentLength;
                if (proxyParams.Bytes != null)
                {
                    using (Stream requestStream = request.GetRequestStream())
                    {
                        requestStream.Write(proxyParams.Bytes, 0, proxyParams.Bytes.Length);
                    }
                }

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    StreamReader reader = new StreamReader(response.GetResponseStream(), true);
                    string responseText = reader.ReadToEnd();
                    reader.Close();
                    reader.Dispose();
                    response.GetResponseStream().Close();
                    response.GetResponseStream().Dispose();
                    response.Close();
                    ViewBag.ResponseRaw = responseText;
                }

                return View();
            }
            else
            {
                return View();
            }
        }

        public string Request(string url, string contentType, long contentLength = 0, string method = "GET")
        {
            string result = "";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = method;
            request.ContentType = contentType;
            request.ContentLength = contentLength;
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                StreamReader reader = new StreamReader(response.GetResponseStream(), true);
                string responseText = reader.ReadToEnd();
                reader.Close();
                reader.Dispose();
                response.GetResponseStream().Close();
                response.GetResponseStream().Dispose();
                response.Close();

                result = responseText;
            }

            return result;
        }

        public ActionResult Proxy()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public void Proxy(ProxyParams proxyParams)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(proxyParams.Url);
            request.Method = proxyParams.Type;
            request.ContentType = proxyParams.ContentType;
            request.ContentLength = proxyParams.ContentLength;
            if (proxyParams.Bytes != null)
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(proxyParams.Bytes, 0, proxyParams.Bytes.Length);
                }
            }

            #region get response
            using (WebResponse response = request.GetResponse())
            {
                Response.Clear();

                StreamReader reader = new StreamReader(response.GetResponseStream());
                string responseText = reader.ReadToEnd();
                
                byte[] contentBytes = Encoding.ASCII.GetBytes(responseText);
                int contentLength = contentBytes.Length;

                reader.Close();
                reader.Dispose();

                response.Close();

                for (var i = 0; i < response.Headers.Count; i++)
                {
                    if (response.Headers.GetKey(i).Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
                    {
                        Response.Headers.Add(response.Headers.GetKey(i), contentLength.ToString());
                    }
                    else
                    {
                        Response.Headers.Add(response.Headers.GetKey(i), response.Headers.Get(i));
                    }
                }

                Response.Write(responseText);
                Response.Flush();
            }
            #endregion
        }

        [HttpPost]
        [ValidateInput(false)]
        public void UploadImage(ProxyParams proxyParams, string originImageLink)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(originImageLink);
            request.Method = "GET";
            byte[] imageBuffer = new byte[1024];
            byte[] imageBytes;
            using (WebResponse response = request.GetResponse())
            {
                Stream responseStream = response.GetResponseStream();
                MemoryStream memoryStream = new MemoryStream();
                BufferedStream bufferedStream = new BufferedStream(responseStream);
                int length = 0;
                while ((length = bufferedStream.Read(imageBuffer, 0, imageBuffer.Length)) > 0)
                {
                    memoryStream.Write(imageBuffer, 0, length);
                }

                responseStream.Close();
                responseStream.Dispose();


                bufferedStream.Close();
                bufferedStream.Dispose();

                imageBytes = memoryStream.ToArray();
                memoryStream.Close();
                memoryStream.Dispose();
            }

            var request2 = (HttpWebRequest)WebRequest.Create(proxyParams.Url);
            request2.Method = proxyParams.Type;
            request2.ContentType = "text/xml"; //proxyParams.ContentType;

            if (imageBytes != null)
            {
                proxyParams.Data = string.Format(proxyParams.Data, System.Convert.ToBase64String(imageBytes));
            }
            request2.ContentLength = proxyParams.ContentLength;

            if (proxyParams.Bytes != null)
            {
                using (Stream requestStream = request2.GetRequestStream())
                {
                    requestStream.Write(proxyParams.Bytes, 0, proxyParams.Bytes.Length);
                }
            }
            
            #region get response
            using (WebResponse response = request2.GetResponse())
            {
                Response.Clear();

                StreamReader reader = new StreamReader(response.GetResponseStream());
                string responseText = reader.ReadToEnd();
                
                byte[] contentBytes = Encoding.ASCII.GetBytes(responseText);
                int contentLength = contentBytes.Length;

                reader.Close();
                reader.Dispose();

                response.Close();

                for (var i = 0; i < response.Headers.Count; i++)
                {
                    if (response.Headers.GetKey(i).Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
                    {
                        Response.Headers.Add(response.Headers.GetKey(i), contentLength.ToString());
                    }
                    else
                    {
                        Response.Headers.Add(response.Headers.GetKey(i), response.Headers.Get(i));
                    }
                }

                Response.Write(responseText);
                Response.Flush();
            }
            #endregion
        }

        public FileContentResult RenderJavaScript(string url)
        {
            return File(NetworkFileHelper.GetNetworkFileBinaryContent(url), "text/javascript");
        }
    }
}
