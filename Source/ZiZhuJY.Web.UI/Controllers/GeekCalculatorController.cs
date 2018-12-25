using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class GeekCalculatorController : Controller
    {
        //
        // GET: /GeekCalculator/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TestParser()
        {
            return View();
        }
    }
}
