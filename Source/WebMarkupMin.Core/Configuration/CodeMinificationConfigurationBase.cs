namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Configuration settings of code minification
	/// </summary>
	public abstract class CodeMinificationConfigurationBase : ConfigurationElement
	{
		/// <summary>
		/// Gets a name of default code minifier
		/// </summary>
		public abstract string DefaultMinifier
		{
			get;
			set;
		}

		/// <summary>
		/// Gets a list of registered code minifiers
		/// </summary>
		[ConfigurationProperty("minifiers", IsRequired = true)]
		public CodeMinifierRegistrationList Minifiers
		{
			get { return (CodeMinifierRegistrationList)this["minifiers"]; }
		}
	}
}