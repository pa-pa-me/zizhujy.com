namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Configuration settings of XHTML minification
	/// </summary>
	public sealed class XhtmlMinificationConfiguration : CommonHtmlMinificationConfigurationBase
	{
		/// <summary>
		/// Gets or sets a flag for whether to use short DOCTYPE
		/// </summary>
		[ConfigurationProperty("useShortDoctype", DefaultValue = false)]
		public override bool UseShortDoctype
		{
			get { return (bool)this["useShortDoctype"]; }
			set { this["useShortDoctype"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to use META charset tag
		/// </summary>
		[ConfigurationProperty("useMetaCharsetTag", DefaultValue = false)]
		public override bool UseMetaCharsetTag
		{
			get { return (bool)this["useMetaCharsetTag"]; }
			set { this["useMetaCharsetTag"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to allow the inserting space
		/// before slash in empty tag
		/// </summary>
		[ConfigurationProperty("renderEmptyTagsWithSpace", DefaultValue = true)]
		public bool RenderEmptyTagsWithSpace
		{
			get { return (bool)this["renderEmptyTagsWithSpace"]; }
			set { this["renderEmptyTagsWithSpace"] = value; }
		}
	}
}