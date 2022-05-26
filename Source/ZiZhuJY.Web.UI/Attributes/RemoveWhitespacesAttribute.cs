using System;
using System.Web.Mvc;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class RemoveWhitespacesAttribute : ActionFilterAttribute 
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var response = filterContext.HttpContext.Response;

            if (string.Equals(response.ContentType, "text/html", StringComparison.InvariantCultureIgnoreCase) && response.Filter != null)
            {
                if (!(response.Filter is System.IO.Compression.GZipStream)
                    && !(response.Filter is System.IO.Compression.DeflateStream)
                    && !(response.Filter is HtmlWhitespaceRemovingHelper))
                {
                    response.Filter = new HtmlWhitespaceRemovingHelper(response.Filter);
                }
            }

            //base.OnActionExecuted(filterContext);
        }

        //public override void OnActionExecuting(ActionExecutingContext filterContext)
        //{
        //    ZiZhuJY.Helpers.Log.Info("Removing whitespaces");

        //    var response = filterContext.HttpContext.Response;

        //    if (string.Equals(response.ContentType, "text/html", StringComparison.InvariantCultureIgnoreCase) && response.Filter != null)
        //    {
        //        response.Filter = new HtmlWhitespaceRemovingHelper(response.Filter);
        //    }

        //    ZiZhuJY.Helpers.Log.Info("Removed whitespaces");
        //}
    }
}