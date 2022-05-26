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
	/// Represents an attribute that is used to XML minification of action result
	/// </summary>
	public sealed class MinifyXmlAttribute : MinifyMarkupBase
	{
		/// <summary>
		/// Processes a response content
		/// </summary>
		/// <param name="context">HTTP context</param>
		/// <param name="controllerName">Controller name</param>
		/// <param name="actionName">Action name</param>
		/// <exception cref="WebMarkupMin.Web.InvalidContentTypeException">Content type is not XML-based.</exception>
		protected override void ProcessContent(HttpContextBase context, string controllerName, string actionName)
		{
			HttpRequestBase request = context.Request;
			HttpResponseBase response = context.Response;
			Encoding encoding = response.ContentEncoding;
			string contentType = response.ContentType;

			if (!ContentTypeHelper.IsXmlBasedContentType(contentType) && contentType != ContentType.Xhtml)
			{
				throw new InvalidContentTypeException(
					string.Format(Strings.ErrorMessage_InvalidContentType,
						"MinifyXmlAttribute", controllerName, actionName));
			}

			if (response.StatusCode == 200)
			{
				var xmlMinifier = WebMarkupMinContext.Current.Markup.CreateXmlMinifierInstance();
				response.Filter = new XmlMinificationFilterStream(response.Filter, xmlMinifier,
					request.RawUrl, encoding);

				if (WebMarkupMinContext.Current.IsCopyrightHttpHeadersEnabled())
				{
					CopyrightHelper.AddXmlMinificationPoweredByHttpHeader(response);
				}
			}
		}
	}
}