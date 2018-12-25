namespace WebMarkupMin.Web.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Configuration settings of web extensions
	/// </summary>
	public sealed class WebExtensionsConfiguration : ConfigurationSection
	{
		/// <summary>
		/// Gets or sets a flag for whether to enable markup minification
		/// </summary>
		[ConfigurationProperty("enableMinification", DefaultValue = true)]
		public bool EnableMinification
		{
			get { return (bool)this["enableMinification"]; }
			set { this["enableMinification"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to disable markup minification during debugging
		/// </summary>
		[ConfigurationProperty("disableMinificationInDebugMode", DefaultValue = true)]
		public bool DisableMinificationInDebugMode
		{
			get { return (bool) this["disableMinificationInDebugMode"]; }
			set { this["disableMinificationInDebugMode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to enable GZIP/Deflate compression of content
		/// </summary>
		[ConfigurationProperty("enableCompression", DefaultValue = true)]
		public bool EnableCompression
		{
			get { return (bool)this["enableCompression"]; }
			set { this["enableCompression"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to disable GZIP/Deflate compression
		/// of content during debugging
		/// </summary>
		[ConfigurationProperty("disableCompressionInDebugMode", DefaultValue = true)]
		public bool DisableCompressionInDebugMode
		{
			get { return (bool)this["disableCompressionInDebugMode"]; }
			set { this["disableCompressionInDebugMode"] = value; }
		}

		/// <summary>
		/// Gets or sets a maximum size of the response (in bytes), in excess of which
		/// disables the minification of markup
		/// </summary>
		[ConfigurationProperty("maxResponseSize", DefaultValue = 100000)]
		[IntegerValidator(MinValue = 1000, MaxValue = 5000000, ExcludeRange = false)]
		public int MaxResponseSize
		{
			get { return (int)this["maxResponseSize"]; }
			set { this["maxResponseSize"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to disable the WebMarkupMin copyright HTTP headers
		/// (e.g. <code>"X-HTML-Minification-Powered-By: WebMarkupMin"</code>)
		/// </summary>
		[ConfigurationProperty("disableCopyrightHttpHeaders", DefaultValue = false)]
		public bool DisableCopyrightHttpHeaders
		{
			get { return (bool)this["disableCopyrightHttpHeaders"]; }
			set { this["disableCopyrightHttpHeaders"] = value; }
		}
	}
}