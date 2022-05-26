namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Configuration settings of core
	/// </summary>
	public sealed class CoreConfiguration : ConfigurationSection
	{
		/// <summary>
		/// Gets a configuration settings of HTML minification
		/// </summary>
		[ConfigurationProperty("html")]
		public HtmlMinificationConfiguration Html
		{
			get { return this["html"] as HtmlMinificationConfiguration; }
		}

		/// <summary>
		/// Gets a configuration settings of XHTML minification
		/// </summary>
		[ConfigurationProperty("xhtml")]
		public XhtmlMinificationConfiguration Xhtml
		{
			get { return this["xhtml"] as XhtmlMinificationConfiguration; }
		}

		/// <summary>
		/// Gets a configuration settings of XML minification
		/// </summary>
		[ConfigurationProperty("xml")]
		public XmlMinificationConfiguration Xml
		{
			get { return this["xml"] as XmlMinificationConfiguration; }
		}

		/// <summary>
		/// Gets a configuration settings of CSS minification
		/// </summary>
		[ConfigurationProperty("css")]
		public CssMinificationConfiguration Css
		{
			get { return this["css"] as CssMinificationConfiguration; }
		}

		/// <summary>
		/// Gets a configuration settings of JS minification
		/// </summary>
		[ConfigurationProperty("js")]
		public JsMinificationConfiguration Js
		{
			get { return this["js"] as JsMinificationConfiguration; }
		}

		/// <summary>
		/// Gets a configuration settings of logging
		/// </summary>
		[ConfigurationProperty("logging")]
		public LoggingConfiguration Logging
		{
			get { return this["logging"] as LoggingConfiguration; }
		}
	}
}