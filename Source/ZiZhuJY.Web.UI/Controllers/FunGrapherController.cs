using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class FunGrapherController : Controller
    {
        //
        // GET: /FunGrapher/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Test()
        {
            return View();
        }
    }
}
