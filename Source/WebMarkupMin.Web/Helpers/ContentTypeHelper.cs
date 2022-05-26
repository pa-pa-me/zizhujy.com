namespace WebMarkupMin.Web.Helpers
{
	using System.Linq;
	using System.Text.RegularExpressions;

	using Constants;

	/// <summary>
	/// Content type helper
	/// </summary>
	public static class ContentTypeHelper
	{
		/// <summary>
		/// XML-based content type list
		/// </summary>
		private static readonly string[] _xmlBasedContentTypes = new[]
		{
			ContentType.Xml, ContentType.DeprecatedXml, ContentType.Dtd, ContentType.Xslt,
			ContentType.Rss, ContentType.Atom, ContentType.RdfXml,
			ContentType.Soap, ContentType.Wsdl,
			ContentType.Svg, ContentType.MathMl, ContentType.VoiceXml, ContentType.Srgs
		};

		/// <summary>
		/// JavaScript-based content type list
		/// </summary>
		private static readonly string[] _jsBasedContentTypes = new[]
		{
			ContentType.Js, ContentType.NonStandardJs, ContentType.DeprecatedJs,
			ContentType.EcmaScript, ContentType.Json
		};

		/// <summary>
		/// Text content type prefix regular expression
		/// </summary>
		private static readonly Regex _textContentTypePrefixRegex = new Regex(@"^text/[a-zA-Z0-9-_.:+]+$");


		/// <summary>
		/// Checks whether the content type is based on XML
		/// </summary>
		/// <param name="contentType">Content type</param>
		/// <returns>Result of check (true - based on XML; false - not based on XML)</returns>
		public static bool IsXmlBasedContentType(string contentType)
		{
			string contentTypeInLowercase = contentType.ToLowerInvariant();

			return _xmlBasedContentTypes.Contains(contentTypeInLowercase);
		}

		/// <summary>
		/// Checks whether the content type is based on JavaScript
		/// </summary>
		/// <param name="contentType">Content type</param>
		/// <returns>Result of check (true - based on JS; false - not based on JS)</returns>
		public static bool IsJsBasedContentType(string contentType)
		{
			string contentTypeInLowercase = contentType.ToLowerInvariant();

			return _jsBasedContentTypes.Contains(contentTypeInLowercase);
		}

		/// <summary>
		/// Checks whether the content type is based on text
		/// </summary>
		/// <param name="contentType">Content type</param>
		/// <returns>Result of check (true - based on text; false - not based on text)</returns>
		public static bool IsTextBasedContentType(string contentType)
		{
			string contentTypeInLowercase = contentType.ToLowerInvariant();

			return (_textContentTypePrefixRegex.IsMatch(contentTypeInLowercase)
				|| contentTypeInLowercase == ContentType.Xhtml
				|| _jsBasedContentTypes.Contains(contentTypeInLowercase)
				|| _xmlBasedContentTypes.Contains(contentTypeInLowercase))
				;
		}
	}
}