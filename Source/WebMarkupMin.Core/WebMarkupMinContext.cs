namespace WebMarkupMin.Core
{
	using System;
	using System.Collections.Generic;
	using System.Configuration;

	using Configuration;
	using Loggers;
	using Resources;
	using Utilities;

	/// <summary>
	/// WebMarkupMin context
	/// </summary>
	public sealed class WebMarkupMinContext
	{
		/// <summary>
		/// Instance of WebMarkupMin context
		/// </summary>
		private static readonly Lazy<WebMarkupMinContext> _instance =
			new Lazy<WebMarkupMinContext>(() => new WebMarkupMinContext());

		/// <summary>
		/// Configuration settings of core
		/// </summary>
		private readonly Lazy<CoreConfiguration> _coreConfig =
			new Lazy<CoreConfiguration>(() =>
				(CoreConfiguration)ConfigurationManager.GetSection("webMarkupMin/core"));

		/// <summary>
		/// Markup minification context
		/// </summary>
		private readonly MarkupContext _markupContext;

		/// <summary>
		/// Code minification context
		/// </summary>
		private readonly CodeContext _codeContext;

		/// <summary>
		/// Pool of loggers
		/// </summary>
		private readonly Dictionary<string, ILogger> _loggersPool = new Dictionary<string, ILogger>();

		/// <summary>
		/// Synchronizer of loggers pool
		/// </summary>
		private readonly object _loggersPoolSynchronizer = new object();

		/// <summary>
		/// Gets instance of WebMarkupMin context
		/// </summary>
		public static WebMarkupMinContext Current
		{
			get { return _instance.Value; }
		}

		/// <summary>
		/// Gets a markup minification context
		/// </summary>
		public MarkupContext Markup
		{
			get { return _markupContext; }
		}

		/// <summary>
		/// Gets a code minification context
		/// </summary>
		public CodeContext Code
		{
			get { return _codeContext; }
		}


		/// <summary>
		/// Private constructor for implementation Singleton pattern
		/// </summary>
		private WebMarkupMinContext()
		{
			_markupContext = new MarkupContext(this);
			_codeContext = new CodeContext(this);
		}


		/// <summary>
		/// Gets a core configuration settings
		/// </summary>
		/// <returns>Configuration settings of core</returns>
		internal CoreConfiguration GetCoreConfiguration()
		{
			return _coreConfig.Value;
		}

		/// <summary>
		/// Creates a instance of logger
		/// </summary>
		/// <param name="name">Logger name</param>
		/// <returns>Logger</returns>
		public ILogger CreateLoggerInstance(string name)
		{
			ILogger logger;
			LoggerRegistrationList loggerRegistrationList = _coreConfig.Value.Logging.Loggers;
			LoggerRegistration loggerRegistration = loggerRegistrationList[name];

			if (loggerRegistration != null)
			{
				logger = Utils.CreateInstanceByFullTypeName<ILogger>(loggerRegistration.Type);
			}
			else
			{
				throw new LoggerNotFoundException(
					string.Format(Strings.Configuration_LoggerNotRegistered, name));
			}

			return logger;
		}

		/// <summary>
		/// Creates a instance of default logger based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <returns>Logger</returns>
		public ILogger CreateDefaultLoggerInstance()
		{
			string defaultLoggerName = _coreConfig.Value.Logging.DefaultLogger;
			if (string.IsNullOrWhiteSpace(defaultLoggerName))
			{
				throw new ConfigurationErrorsException(Strings.Configuration_DefaultLoggerNotSpecified);
			}

			ILogger logger = CreateLoggerInstance(defaultLoggerName);

			return logger;
		}

		/// <summary>
		/// Gets a instance of logger
		/// </summary>
		/// <param name="name">Logger name</param>
		/// <returns>Logger</returns>
		public ILogger GetLoggerInstance(string name)
		{
			ILogger logger;

			lock (_loggersPoolSynchronizer)
			{
				if (_loggersPool.ContainsKey(name))
				{
					logger = _loggersPool[name];
				}
				else
				{
					logger = CreateLoggerInstance(name);
					_loggersPool.Add(name, logger);
				}
			}

			return logger;
		}

		/// <summary>
		/// Gets a instance of default logger based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <returns>Logger</returns>
		public ILogger GetDefaultLoggerInstance()
		{
			string defaultLoggerName = _coreConfig.Value.Logging.DefaultLogger;
			if (string.IsNullOrWhiteSpace(defaultLoggerName))
			{
				throw new ConfigurationErrorsException(Strings.Configuration_DefaultLoggerNotSpecified);
			}

			ILogger logger = GetLoggerInstance(defaultLoggerName);

			return logger;
		}
	}
}