namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Class registration
	/// </summary>
	public abstract class ClassRegistrationBase : ConfigurationElement
	{
		/// <summary>
		/// Gets a name
		/// </summary>
		[ConfigurationProperty("name", IsKey = true, IsRequired = true)]
		public string Name
		{
			get { return (string)this["name"]; }
		}

		/// <summary>
		/// Gets a display name
		/// </summary>
		[ConfigurationProperty("displayName", IsRequired = true)]
		public string DisplayName
		{
			get { return (string)this["displayName"]; }
		}

		/// <summary>
		/// Gets a .NET-type name
		/// </summary>
		[ConfigurationProperty("type", IsRequired = true)]
		public string Type
		{
			get { return (string)this["type"]; }
		}
	}
}