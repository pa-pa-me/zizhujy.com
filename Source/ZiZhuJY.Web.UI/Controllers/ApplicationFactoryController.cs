using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    [CompressContent(Order = 9999)]
    [RemoveWhitespaces(Order = -1)]
    public class ApplicationFactoryController : Controller
    {
        //
        // GET: /ApplicationFactory/

        public ActionResult Index()
        {
            return View();
        }

    }
}
