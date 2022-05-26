namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// List of registered code minifiers
	/// </summary>
	public sealed class CodeMinifierRegistrationList : ConfigurationElementCollection
	{
		/// <summary>
		/// Creates new minifier registration
		/// </summary>
		/// <returns>Minifier registration</returns>
		protected override ConfigurationElement CreateNewElement()
		{
			return new CodeMinifierRegistration();
		}

		/// <summary>
		/// Gets a key of the specified minifier registration
		/// </summary>
		/// <param name="element">Minifier registration</param>
		/// <returns>Key</returns>
		protected override object GetElementKey(ConfigurationElement element)
		{
			return ((CodeMinifierRegistration)element).Name;
		}

		/// <summary>
		/// Gets minifier registration by minifier name
		/// </summary>
		/// <param name="name">Minifier name</param>
		/// <returns>Minifier registration</returns>
		public new CodeMinifierRegistration this[string name]
		{
			get { return (CodeMinifierRegistration)BaseGet(name); }
		}
	}
}