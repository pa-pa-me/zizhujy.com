using System;
using System.IO.Compression;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ZiZhuJY.Web.UI
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" });

            //routes.Add(new FunctionGrapherRoute(string.Empty, new MvcRouteHandler()));

            routes.MapRoute(
                "Localization", // 路由名称
                "{culture}/{controller}/{action}/{id}", // 带有参数的 URL
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }, // 参数默认值
                new { culture = @"\w{2}(?:-\w{2})?" }
            );

            routes.MapRoute(
                "Default", // 路由名称
                "{controller}/{action}/{id}", // 带有参数的 URL
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // 参数默认值
            );

        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // Remove any special filtering especially GZip filtering
            // Better solution is in the Application_PreSendRequestHeaders()
            //Response.Filter = null;

            //ZiZhuJY.Helpers.Log.StartTraceListners("zizhujy");
            //Exception ex = Server.GetLastError();

            //ZiZhuJY.Helpers.Log.Error(ZiZhuJY.Helpers.ExceptionHelper.CentralProcess(ex));

            //Server.ClearError();
        }

        protected void Application_PreSendRequestHeaders()
        {
            if (HttpContext.Current != null)
            {
                // ensure that if GZip/Deflate Encoding is applied that headers are set
                // also works when error occurs if filters are still active
                HttpResponse response = HttpContext.Current.Response;
                if (response.Filter is GZipStream && response.Headers["Content-encoding"] != "gzip")
                    response.AppendHeader("Content-encoding", "gzip");
                else if (response.Filter is DeflateStream && response.Headers["Content-encoding"] != "deflate")
                    response.AppendHeader("Content-encoding", "deflate");
            }
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        
        protected void Application_BeginRequest(object source, EventArgs e)
        {
        }
    }

}