using System.Web.Mvc;
using WebMarkupMin.Mvc.ActionFilters;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class PureController : Controller
    {
        //
        // GET: /Pure/

        [MinifyHtml]
//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult Index()
        {
            return View();
        }

    }
}
