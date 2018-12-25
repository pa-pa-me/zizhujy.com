namespace WebMarkupMin.Web.HttpModules
{
	using System.Text;
	using System.Web;

	using Core;
	using Constants;
	using Filters;
	using Helpers;

	/// <summary>
	/// HTTP module for XHTML minification
	/// </summary>
	public sealed class XhtmlMinificationModule : MarkupMinificationModuleBase
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
				&& (contentType == ContentType.Html || contentType == ContentType.Xhtml)
				&& context.CurrentHandler != null)
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