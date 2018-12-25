namespace WebMarkupMin.Web.HttpModules
{
	using System.Text;
	using System.Web;

	using Core;
	using Filters;
	using Helpers;

	/// <summary>
	/// HTTP module for XML minification
	/// </summary>
	public sealed class XmlMinificationModule : MarkupMinificationModuleBase
	{
		/// <summary>
		/// Processes a response content
		/// </summary>
		/// <param name="context">HTTP response</param>
		protected override void ProcessContent(HttpContext context)
		{
			HttpRequest request = context.Request;
			HttpResponse response = context.Response;
			Encoding encoding = response.ContentEncoding;
			string contentType = response.ContentType;

			if (request.HttpMethod == "GET" && response.StatusCode == 200
				&& ContentTypeHelper.IsXmlBasedContentType(contentType)
				&& context.CurrentHandler != null)
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