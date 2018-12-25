using System.Web.Mvc;
using ZiZhuJY.Web.Controllers;
using ZiZhuJY.Web.UI.Attributes;
using ZiZhuJY.Web.UI.Helpers;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    public class AlongTheRiverDuringQingMingFestivalController : CommonControllerBase
    {
        //
        // GET: /AlongTheRiverAtQingMingFestival/

        public ActionResult Index()
        {
            return View();
        }
    }
}
