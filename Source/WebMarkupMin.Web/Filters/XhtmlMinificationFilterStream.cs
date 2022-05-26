namespace WebMarkupMin.Web.Filters
{
	using System.IO;
	using System.Text;

	using Core.Minifiers;

	/// <summary>
	/// XHTML minification response filter
	/// </summary>
	public sealed class XhtmlMinificationFilterStream : MarkupMinificationFilterStreamBase<XhtmlMinifier>
	{
		/// <summary>
		/// Constructs instance of XHTML minification response filter
		/// </summary>
		/// <param name="stream">Content stream</param>
		/// <param name="minifier">XHTML minifier</param>
		public XhtmlMinificationFilterStream(Stream stream, XhtmlMinifier minifier)
			: base(stream, minifier)
		{ }

		/// <summary>
		/// Constructs instance of XHTML minification response filter
		/// </summary>
		/// <param name="stream">Content stream</param>
		/// <param name="minifier">XHTML minifier</param>
		/// <param name="currentUrl">Current URL</param>
		/// <param name="encoding">Text encoding</param>
		public XhtmlMinificationFilterStream(Stream stream, XhtmlMinifier minifier, string currentUrl, Encoding encoding)
			: base(stream, minifier, currentUrl, encoding)
		{ }
	}
}