using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.ServiceModel.Syndication;
using System.Web.Mvc;
using System.Xml;
using ZiZhuJY.Web.UI.Models;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class BlogImporterController : Controller
    {
        //
        // GET: /BlogImporter/

        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /BlogImporter/

        [HttpPost]
        public ActionResult Index(string url)
        {
            // Send request
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";

            // Get response
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();

            // Read Feed
            XmlReader xmlReader = XmlReader.Create(response.GetResponseStream());
            Rss20FeedFormatter ff = new Rss20FeedFormatter();
            ff.ReadFrom(xmlReader);

            List<SyndicationItem> items = ff.Feed.Items.ToList();
            List<BESyndicationItem> beItems = new List<BESyndicationItem>();
            for (int i = 0; i < items.Count; i++)
            {
                beItems.Add(new BESyndicationItem(items[i]));
            }

            xmlReader.Close();

            response.GetResponseStream().Close();
            response.Close();

            return View("RssTree", beItems);
        }

        //public ActionResult Index(string url)
        //{
        //    // Send request
        //    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        //    request.Method = "GET";
            
        //    // Get response
        //    HttpWebResponse response = (HttpWebResponse)request.GetResponse();

        //    Stream stream = new MemoryStream();  //response.GetResponseStream();
            
        //    byte[] buffer = new byte[1024];
        //    int i = 0;
        //    while ((i = response.GetResponseStream().Read(buffer, 0, 1024)) > 0)
        //    {
        //        stream.Write(buffer, 0, i);
        //        stream.Flush();
        //    }


        //    //XmlReader xmlReader = XmlReader.Create(stream);            

        //    //// Read Feed

        //    //Rss20FeedFormatter ff = new Rss20FeedFormatter();
        //    //ff.ReadFrom(xmlReader);

        //    //List<SyndicationItem> items = ff.Feed.Items.ToList();

        //    //ViewBag.ItemCount = items.Count;

        //    // Read raw response
            
        //    StreamReader reader = new StreamReader(stream, true);

        //    string responseText = reader.ReadToEnd();
        //    reader.Close();

        //    ViewBag.RawResponse = responseText;

        //    stream.Close();
        //    response.Close();

        //    //WebRequest request = WebRequest.Create(url);
            
        //    //WebResponse response = request.GetResponse();

        //    //Stream st = response.GetResponseStream();
        //    //byte[] bytes = new byte[100000];
        //    //string rawResponse = "";
        //    //int i = st.Read(bytes, 0, bytes.Length);
        //    //while (i > 0)
        //    //{
        //    //    rawResponse += Encoding.UTF8.GetString(bytes, 0, i);
        //    //    i = st.Read(bytes, 0, bytes.Length);
        //    //}

        //    //ViewBag.RawResponse = rawResponse;

        //    return View();
        //}

    }
}
