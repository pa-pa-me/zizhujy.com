using System.Web.Mvc;
using WebMarkupMin.Mvc.ActionFilters;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class PlotterController : Controller
    {
        //
        // GET: /Plotter/
//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile="Cache30Days")]
        [ETag]
        public ActionResult Index()
        {
            return View("Plotter");
        }
    }
}
