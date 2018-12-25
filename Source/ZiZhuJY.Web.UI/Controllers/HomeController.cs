using System.Web.Mvc;
using WebMarkupMin.Mvc.ActionFilters;
using ZiZhuJY.Common.Extensions;
using ZiZhuJY.Core;
using ZiZhuJY.Web.Controllers;
using ZiZhuJY.Web.UI.Attributes;
using ZiZhuJY.Web.UI.Models;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class HomeController : CommonControllerBase
    {
//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult Index(string fns = null)
        {
            if (fns == null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index", "FunctionGrapher");
            }
        }

//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult AnnualRing(int? lunarYear)
        {
            AnnualRingModel model = null;
            if (lunarYear.HasValue)
            {
                model = AnnualRingModel.FromLunarYear(lunarYear.Value);

                if (model.Zodiac != ZodiacYears.Horse)
                {
                    return UnderConstruction();
                }
            }
            else
            {
                return UnderConstruction();
            }

            return View("{0}Year".FormatWith(model.Zodiac.ToString()), model);
        }

//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult About()
        {
            return View();
        }

//        [WebMarkupMin.Mvc.ActionFilters.CompressContent]
        [MinifyHtml]
        [OutputCache(CacheProfile = "Cache30Days")]
        [ETag]
        public ActionResult Resume(bool? print)
        {
            ViewBag.Layout = "~/Views/Shared/_SimpleLayout.cshtml";
            ViewBag.PrintView = false;

            if (print != null && print == true)
            {
                ViewBag.Layout = "~/Views/Shared/_PrintLayout.cshtml";
                ViewBag.PrintView = true;
            }

            return View();
        }
    }
}
