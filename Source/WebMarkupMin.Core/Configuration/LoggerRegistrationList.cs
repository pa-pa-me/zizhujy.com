namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// List of registered loggers
	/// </summary>
	public sealed class LoggerRegistrationList : ConfigurationElementCollection
	{
		/// <summary>
		/// Creates new logger registration
		/// </summary>
		/// <returns>Logger registration</returns>
		protected override ConfigurationElement CreateNewElement()
		{
			return new LoggerRegistration();
		}

		/// <summary>
		/// Gets a key of the specified logger registration
		/// </summary>
		/// <param name="element">Logger registration</param>
		/// <returns>Key</returns>
		protected override object GetElementKey(ConfigurationElement element)
		{
			return ((LoggerRegistration)element).Name;
		}

		/// <summary>
		/// Gets logger registration by logger name
		/// </summary>
		/// <param name="name">Logger name</param>
		/// <returns>Logger registration</returns>
		public new LoggerRegistration this[string name]
		{
			get { return (LoggerRegistration)BaseGet(name); }
		}
	}
}