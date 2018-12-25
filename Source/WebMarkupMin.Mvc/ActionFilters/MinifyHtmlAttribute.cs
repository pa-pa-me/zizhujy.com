namespace WebMarkupMin.Mvc.ActionFilters
{
	using System.Text;
	using System.Web;

	using Core;
	using Resources;
	using Web;
	using Web.Constants;
	using Web.Filters;
	using Web.Helpers;

	/// <summary>
	/// Represents an attribute that is used to HTML minification of action result
	/// </summary>
	public sealed class MinifyHtmlAttribute : MinifyMarkupBase
	{
		/// <summary>
		/// Processes a response content
		/// </summary>
		/// <param name="context">HTTP context</param>
		/// <param name="controllerName">Controller name</param>
		/// <param name="actionName">Action name</param>
		/// <exception cref="InvalidContentTypeException">Content type is not equals to 'text/html'.</exception>
		protected override void ProcessContent(HttpContextBase context, string controllerName, string actionName)
		{
			HttpRequestBase request = context.Request;
			HttpResponseBase response = context.Response;
			Encoding encoding = response.ContentEncoding;
			string contentType = response.ContentType;

			if (contentType != ContentType.Html)
			{
				throw new InvalidContentTypeException(
					string.Format(Strings.ErrorMessage_InvalidContentType,
						"MinifyHtmlAttribute", controllerName, actionName));
			}

			if (response.StatusCode == 200)
			{
				var htmlMinifier = WebMarkupMinContext.Current.Markup.CreateHtmlMinifierInstance();
				response.Filter = new HtmlMinificationFilterStream(response.Filter, htmlMinifier,
					request.RawUrl, encoding);

				if (WebMarkupMinContext.Current.IsCopyrightHttpHeadersEnabled())
				{
					CopyrightHelper.AddHtmlMinificationPoweredByHttpHeader(response);
				}
			}
		}
	}
}