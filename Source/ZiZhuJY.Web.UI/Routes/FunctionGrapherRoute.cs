using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace ZiZhuJY.Web.UI.Routes
{
    public class FunctionGrapherRoute : Route
    {
        public FunctionGrapherRoute(string url, IRouteHandler routeHandler)
            : base(url, routeHandler)
        {

        }

        public override RouteData GetRouteData(HttpContextBase httpContext)
        {
            var rd = base.GetRouteData(httpContext);

            if (rd != null && !rd.Values.Any())
            {
                rd.Values["controller"] = "FunctionGrapher";
                rd.Values["action"] = "Index";
            }

            return rd;
        }
    }
}