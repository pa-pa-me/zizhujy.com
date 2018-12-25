namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Configuration settings of XML minification
	/// </summary>
	public sealed class XmlMinificationConfiguration : ConfigurationElement
	{
		/// <summary>
		/// Gets or sets a flag for whether to minify whitespace
		/// </summary>
		[ConfigurationProperty("minifyWhitespace", DefaultValue = true)]
		public bool MinifyWhitespace
		{
			get { return (bool)this["minifyWhitespace"]; }
			set { this["minifyWhitespace"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove all XML comments
		/// </summary>
		[ConfigurationProperty("removeXmlComments", DefaultValue = true)]
		public bool RemoveXmlComments
		{
			get { return (bool)this["removeXmlComments"]; }
			set { this["removeXmlComments"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to allow the inserting space
		/// before slash in empty tag
		/// </summary>
		[ConfigurationProperty("renderEmptyTagsWithSpace", DefaultValue = false)]
		public bool RenderEmptyTagsWithSpace
		{
			get { return (bool)this["renderEmptyTagsWithSpace"]; }
			set { this["renderEmptyTagsWithSpace"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to collapse tags without content
		/// </summary>
		[ConfigurationProperty("collapseTagsWithoutContent", DefaultValue = false)]
		public bool CollapseTagsWithoutContent
		{
			get { return (bool)this["collapseTagsWithoutContent"]; }
			set { this["collapseTagsWithoutContent"] = value; }
		}
	}
}