namespace WebMarkupMin.Web.Helpers
{
	using System.Web;

	/// <summary>
	/// Copyright helper
	/// </summary>
	public static class CopyrightHelper
	{
		const string HTML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME = "X-HTML-Minification-Powered-By";
		const string XHTML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME = "X-XHTML-Minification-Powered-By";
		const string XML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME = "X-XML-Minification-Powered-By";

		const string MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE = "WebMarkupMin";


		/// <summary>
		/// Adds a HTTP header "X-HTML-Minification-Powered-By" in the response
		/// </summary>
		/// <param name="response">HTTP response</param>
		public static void AddHtmlMinificationPoweredByHttpHeader(HttpResponse response)
		{
			response.Headers[HTML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME]
				= MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE;
		}

		/// <summary>
		/// Adds a HTTP header "X-HTML-Minification-Powered-By" in the response
		/// </summary>
		/// <param name="response">HTTP response base</param>
		public static void AddHtmlMinificationPoweredByHttpHeader(HttpResponseBase response)
		{
			response.Headers[HTML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME]
				= MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE;
		}

		/// <summary>
		/// Adds a HTTP header "X-XHTML-Minification-Powered-By" in the response
		/// </summary>
		/// <param name="response">HTTP response</param>
		public static void AddXhtmlMinificationPoweredByHttpHeader(HttpResponse response)
		{
			response.Headers[XHTML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME]
				= MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE;
		}

		/// <summary>
		/// Adds a HTTP header "X-XHTML-Minification-Powered-By" in the response
		/// </summary>
		/// <param name="response">HTTP response base</param>
		public static void AddXhtmlMinificationPoweredByHttpHeader(HttpResponseBase response)
		{
			response.Headers[XHTML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME]
				= MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE;
		}

		/// <summary>
		/// Adds a HTTP header "X-XML-Minification-Powered-By" in the response
		/// </summary>
		/// <param name="response">HTTP response</param>
		public static void AddXmlMinificationPoweredByHttpHeader(HttpResponse response)
		{
			response.Headers[XML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME]
				= MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE;
		}

		/// <summary>
		/// Adds a HTTP header "X-XML-Minification-Powered-By" in the response
		/// </summary>
		/// <param name="response">HTTP response base</param>
		public static void AddXmlMinificationPoweredByHttpHeader(HttpResponseBase response)
		{
			response.Headers[XML_MINIFICATION_POWERED_BY_HTTP_HEADER_NAME]
				= MARKUP_MINIFICATION_POWERED_BY_HTTP_HEADER_VALUE;
		}
	}
}
