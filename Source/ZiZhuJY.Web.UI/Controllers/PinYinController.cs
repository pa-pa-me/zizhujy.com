using System.Web.Mvc;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class PinYinController : Controller
    {
        //
        // GET: /PinYin/

        public ActionResult Index(string chn)
        {
            ViewBag.Chn = chn;

            return View();
        }

    }
}
