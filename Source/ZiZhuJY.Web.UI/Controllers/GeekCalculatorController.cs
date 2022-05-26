using System.Web.Mvc;
using WebMarkupMin.Mvc.ActionFilters;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class GeekCalculatorController : Controller
    {
        //
        // GET: /GeekCalculator/

        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
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
