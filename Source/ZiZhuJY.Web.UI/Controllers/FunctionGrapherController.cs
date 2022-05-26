using System.Web.Mvc;
using WebMarkupMin.Mvc.ActionFilters;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class FunctionGrapherController : Controller
    {
        //
        // GET: /FunctionGrapher/
//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult Index(string functions)
        {
            if (string.IsNullOrEmpty(functions) || string.IsNullOrWhiteSpace(functions))
            {
                return View("FunCanvasWrapper");
            }
            else
            {
                return RedirectToAction("Index", "FunctionGraffiti", new {functions = functions});
            }
        }

//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult Old()
        {
            return RedirectToAction("Index", "FunctionGraffiti");
        }

//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult FunCanvas()
        {
            // Make the view add a <!DOCTYPE html> markup:
            ViewBag.Standalone = true;

            return View();
        }

//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult Canvas()
        {
            ViewBag.Standalone = true;

            return View();
        }
    }
}
