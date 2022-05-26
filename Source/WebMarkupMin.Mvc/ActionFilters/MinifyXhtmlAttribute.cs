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
	/// Represents an attribute that is used to XHTML minification of action result
	/// </summary>
	public sealed class MinifyXhtmlAttribute : MinifyMarkupBase
	{
		/// <summary>
		/// Processes a response content
		/// </summary>
		/// <param name="context">HTTP context</param>
		/// <param name="controllerName">Controller name</param>
		/// <param name="actionName">Action name</param>
		/// <exception cref="InvalidContentTypeException">Content type is not equals to 'text/html' or 'application/xhtml+xml'.</exception>
		protected override void ProcessContent(HttpContextBase context, string controllerName, string actionName)
		{
			HttpRequestBase request = context.Request;
			HttpResponseBase response = context.Response;
			Encoding encoding = response.ContentEncoding;
			string contentType = response.ContentType;

			if (contentType != ContentType.Html && contentType != ContentType.Xhtml)
			{
				throw new InvalidContentTypeException(
					string.Format(Strings.ErrorMessage_InvalidContentType,
						"MinifyXhtmlAttribute", controllerName, actionName));
			}

			if (response.StatusCode == 200)
			{
				var xhtmlMinifier = WebMarkupMinContext.Current.Markup.CreateXhtmlMinifierInstance();
				response.Filter = new XhtmlMinificationFilterStream(response.Filter, xhtmlMinifier,
					request.RawUrl, encoding);

				if (WebMarkupMinContext.Current.IsCopyrightHttpHeadersEnabled())
				{
					CopyrightHelper.AddXhtmlMinificationPoweredByHttpHeader(response);
				}
			}
		}
	}
}