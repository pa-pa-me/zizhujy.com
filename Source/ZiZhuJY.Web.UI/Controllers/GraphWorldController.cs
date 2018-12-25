using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class GraphWorldController : Controller
    {
        //
        // GET: /GraphWorld/

        public ActionResult Index()
        {
            return View();
        }
    }
}
