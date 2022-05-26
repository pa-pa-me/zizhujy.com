namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	using Constants;

	/// <summary>
	/// Configuration settings of CSS minification
	/// </summary>
	public sealed class CssMinificationConfiguration : CodeMinificationConfigurationBase
	{
		/// <summary>
		/// Gets or sets a name of default minifier
		/// </summary>
		[ConfigurationProperty("defaultMinifier", DefaultValue = MinifierName.KristensenCssMinifier)]
		public override string DefaultMinifier
		{
			get { return (string)this["defaultMinifier"]; }
			set { this["defaultMinifier"] = value; }
		}
	}
}