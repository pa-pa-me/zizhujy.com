namespace WebMarkupMin.Mvc.ActionFilters
{
	using System;
	using System.Web;
	using System.Web.Mvc;
	using System.Web.Routing;

	using Core;
	using Web;

	/// <summary>
	/// Base class of attribute that is used to markup minification of action result
	/// </summary>
	[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
	public abstract class MinifyMarkupBase : ActionFilterAttribute
	{
		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			if (!WebMarkupMinContext.Current.IsMinificationEnabled())
			{
				return;
			}

			RouteData routeData = filterContext.Controller.ControllerContext.RouteData;
			string controllerName = routeData.GetRequiredString("controller");
			string actionName = routeData.GetRequiredString("action");


			ProcessContent(filterContext.HttpContext, controllerName, actionName);
		}

		/// <summary>
		/// Processes a response content
		/// </summary>
		/// <param name="context">HTTP context</param>
		/// <param name="controllerName">Controller name</param>
		/// <param name="actionName">Action name</param>
		protected abstract void ProcessContent(HttpContextBase context, string controllerName, string actionName);
	}
}