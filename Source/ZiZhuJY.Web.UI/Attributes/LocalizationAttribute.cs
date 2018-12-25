using System;
using System.Globalization;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class LocalizationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.RouteData.Values["culture"] != null &&
                !string.IsNullOrWhiteSpace(filterContext.RouteData.Values["culture"].ToString()))
            {
                // 从路由数据 (url) 里设置语言
                var cultureSetting = filterContext.RouteData.Values["culture"].ToString();
                Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture(cultureSetting);
            }
            else
            {
                // 从 cookie 里读取语言设置
                var cookie = filterContext.HttpContext.Request.Cookies["_culture"];
                string cultureSetting;
                if (cookie != null)
                {
                    // 根据 cookie 设置语言
                    cultureSetting = cookie.Value;
                    Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture(cultureSetting);
                }
                else
                {
                    // 如果读取 cookie 失败则设置默认语言
                    // 下面这行有重大的Bug！如果Request中的UserLanguanges不带任何元素，则会抛出异常！
                    // 难怪搜索引擎爬我的网站时，总是说500服务器内部错误！
                    // 感谢Google Webmaster工具让我找到Bug的原因！
                    if (filterContext.HttpContext.Request.UserLanguages != null && filterContext.HttpContext.Request.UserLanguages.Length > 0)
                    {
                        cultureSetting = filterContext.HttpContext.Request.UserLanguages[0];
                    }
                    else
                    {
                        cultureSetting = "zh-CN";
                    }
                    Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture(cultureSetting);
                }
                // 把语言值设置到路由值里
                filterContext.RouteData.Values["culture"] = cultureSetting;
            }

            // 把设置保存进 cookie

            var cookieToCreate = new HttpCookie("_culture", Thread.CurrentThread.CurrentUICulture.Name)
            {
                Expires = DateTime.Now.AddYears(1)
            };

            if (filterContext.HttpContext.Request.Url != null)
            {
                cookieToCreate.Domain = filterContext.HttpContext.Request.Url.Host;
            }

            filterContext.HttpContext.Response.SetCookie(cookieToCreate);

            base.OnActionExecuting(filterContext);
        }
    }
}
