using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class PDFConverterController : Controller
    {
        //
        // GET: /PDFConverter/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FetchPDF(string url)
        {
            return RedirectToAction("ViewPDF", "PDF", new { url = url });
        }
    }
}
