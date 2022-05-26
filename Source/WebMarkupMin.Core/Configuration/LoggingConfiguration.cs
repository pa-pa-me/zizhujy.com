namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	using Constants;

	/// <summary>
	/// Configuration settings of logging
	/// </summary>
	public sealed class LoggingConfiguration : ConfigurationElement
	{
		/// <summary>
		/// Gets or sets a name of default logger
		/// </summary>
		[ConfigurationProperty("defaultLogger", DefaultValue = LoggerName.ThrowExceptionLogger)]
		public string DefaultLogger
		{
			get { return (string)this["defaultLogger"]; }
			set { this["defaultLogger"] = value; }
		}

		/// <summary>
		/// Gets a list of registered loggers
		/// </summary>
		[ConfigurationProperty("loggers", IsRequired = true)]
		public LoggerRegistrationList Loggers
		{
			get { return (LoggerRegistrationList)this["loggers"]; }
		}
	}
}