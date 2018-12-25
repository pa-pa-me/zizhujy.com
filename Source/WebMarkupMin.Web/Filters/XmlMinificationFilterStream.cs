namespace WebMarkupMin.Web.Filters
{
	using System.IO;
	using System.Text;

	using Core.Minifiers;

	/// <summary>
	/// XML minification response filter
	/// </summary>
	public sealed class XmlMinificationFilterStream : MarkupMinificationFilterStreamBase<XmlMinifier>
	{
		/// <summary>
		/// Constructs instance of XML minification response filter
		/// </summary>
		/// <param name="stream">Content stream</param>
		/// <param name="minifier">XML minifier</param>
		public XmlMinificationFilterStream(Stream stream, XmlMinifier minifier)
			: base(stream, minifier)
		{ }

		/// <summary>
		/// Constructs instance of XML minification response filter
		/// </summary>
		/// <param name="stream">Content stream</param>
		/// <param name="minifier">XML minifier</param>
		/// <param name="currentUrl">Current URL</param>
		/// <param name="encoding">Text encoding</param>
		public XmlMinificationFilterStream(Stream stream, XmlMinifier minifier, string currentUrl, Encoding encoding)
			: base(stream, minifier, currentUrl, encoding)
		{ }
	}
}