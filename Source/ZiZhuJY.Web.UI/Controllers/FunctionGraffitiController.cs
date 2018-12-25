using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class FunctionGraffitiController : Controller
    {
        //
        // GET: /FunctionGraffiti/

        public ActionResult Index(string functions, double? minOfx, double? maxOfx, double? minOfy, double? maxOfy, double? minOft, double? maxOft, int? points, bool? autoYrange)
        {
            if (string.IsNullOrWhiteSpace(functions) || string.IsNullOrEmpty(functions))
            {
                return RedirectToAction("Index", "FunctionGrapher");
            }
            else
            {
                ViewBag.Functions = functions;
                ViewBag.MinOfx = minOfx;
                ViewBag.MaxOfx = maxOfx;
                ViewBag.MinOfy = minOfy;
                ViewBag.MaxOfy = maxOfy;
                ViewBag.MinOft = minOft;
                ViewBag.MaxOft = maxOft;
                ViewBag.Points = points;
                ViewBag.AutoYrange = autoYrange;

                return View();
            }
        }

        public ActionResult FunctionGraffiti()
        {
            return View();
        }
    }
}
