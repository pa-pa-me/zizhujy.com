namespace WebMarkupMin.Web.HttpModules
{
	using System.Text;
	using System.Web;

	using Core;
	using Constants;
	using Filters;
	using Helpers;

	/// <summary>
	/// HTTP module for HTML minification
	/// </summary>
	public sealed class HtmlMinificationModule : MarkupMinificationModuleBase
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
				&& contentType == ContentType.Html
				&& context.CurrentHandler != null)
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