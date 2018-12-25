using System.Web.Mvc;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Web.UI.Controllers
{
    public class JsLibsController : Controller
    {
        //
        // GET: /JsLibs/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SeamlessCanvasCapture(string example = null)
        {
            if (example == null)
            {
                return View();
            }
            else
            {
                return View("~/Views/JsLibs/SeamlessCanvasCapture/{0}.cshtml".FormatWith(example));
            }
        }

        public ActionResult FlotComments(string example = null)
        {
            if (example == null)
            {
                return View();
            }
            else
            {
                return View("~/Views/JsLibs/FlotComments/{0}.cshtml".FormatWith(example));
            }
        }

        public ActionResult NavigationControl(string example = null)
        {
            if (example == null)
            {
                return View();
            }
            else
            {
                return View("~/Views/JsLibs/NavigationControl/{0}.cshtml".FormatWith(example));
            }
        }
    }
}
