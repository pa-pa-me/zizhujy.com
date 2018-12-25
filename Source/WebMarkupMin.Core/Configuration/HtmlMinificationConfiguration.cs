namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Configuration settings of HTML minification
	/// </summary>
	public sealed class HtmlMinificationConfiguration : CommonHtmlMinificationConfigurationBase
	{
		/// <summary>
		/// Gets or sets a flag for whether to remove CDATA sections from scripts and styles
		/// </summary>
		[ConfigurationProperty("removeCdataSectionsFromScriptsAndStyles", DefaultValue = true)]
		public bool RemoveCdataSectionsFromScriptsAndStyles
		{
			get { return (bool)this["removeCdataSectionsFromScriptsAndStyles"]; }
			set { this["removeCdataSectionsFromScriptsAndStyles"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to use short DOCTYPE
		/// </summary>
		[ConfigurationProperty("useShortDoctype", DefaultValue = true)]
		public override bool UseShortDoctype
		{
			get { return (bool)this["useShortDoctype"]; }
			set { this["useShortDoctype"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to use META charset tag
		/// </summary>
		[ConfigurationProperty("useMetaCharsetTag", DefaultValue = true)]
		public override bool UseMetaCharsetTag
		{
			get { return (bool)this["useMetaCharsetTag"]; }
			set { this["useMetaCharsetTag"] = value; }
		}

		/// <summary>
		/// Gets or sets a render mode of HTML empty tag
		/// </summary>
		[ConfigurationProperty("emptyTagRenderMode", DefaultValue = HtmlEmptyTagRenderMode.NoSlash)]
		public HtmlEmptyTagRenderMode EmptyTagRenderMode
		{
			get { return (HtmlEmptyTagRenderMode) this["emptyTagRenderMode"]; }
			set { this["emptyTagRenderMode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove optional end tags
		/// </summary>
		[ConfigurationProperty("removeOptionalEndTags", DefaultValue = true)]
		public bool RemoveOptionalEndTags
		{
			get { return (bool)this["removeOptionalEndTags"]; }
			set { this["removeOptionalEndTags"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove values from boolean attributes
		/// </summary>
		[ConfigurationProperty("collapseBooleanAttributes", DefaultValue = true)]
		public bool CollapseBooleanAttributes
		{
			get { return (bool)this["collapseBooleanAttributes"]; }
			set { this["collapseBooleanAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a removal mode of HTML attribute quotes
		/// </summary>
		[ConfigurationProperty("attributeQuotesRemovalMode", DefaultValue = HtmlAttributeQuotesRemovalMode.Html5)]
		public HtmlAttributeQuotesRemovalMode AttributeQuotesRemovalMode
		{
			get { return (HtmlAttributeQuotesRemovalMode)this["attributeQuotesRemovalMode"]; }
			set { this["attributeQuotesRemovalMode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove <code>type="text/javascript"</code> from <code>script</code> tags
		/// </summary>
		[ConfigurationProperty("removeJsTypeAttributes", DefaultValue = true)]
		public bool RemoveJsTypeAttributes
		{
			get { return (bool)this["removeJsTypeAttributes"]; }
			set { this["removeJsTypeAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove <code>type="text/css"</code> from
		/// <code>style</code> and <code>link</code> tags
		/// </summary>
		[ConfigurationProperty("removeCssTypeAttributes", DefaultValue = true)]
		public bool RemoveCssTypeAttributes
		{
			get { return (bool) this["removeCssTypeAttributes"]; }
			set { this["removeCssTypeAttributes"] = value; }
		}
	}
}