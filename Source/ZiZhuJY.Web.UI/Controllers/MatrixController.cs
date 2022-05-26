using System.Web.Mvc;
using ZiZhuJY.Web.UI.Attributes;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    [CompressContent(Order = 9999)]
    [RemoveWhitespaces(Order = -1)]
    public class MatrixController : Controller
    {
        //
        // GET: /Matrix/

        public ActionResult Index()
        {
            return View();
        }

    }
}
