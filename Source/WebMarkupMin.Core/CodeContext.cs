namespace WebMarkupMin.Core
{
	using System.Collections.Generic;
	using System.Configuration;

	using Configuration;
	using Minifiers;
	using Resources;
	using Utilities;

	/// <summary>
	/// Code minification context
	/// </summary>
	public sealed class CodeContext
	{
		/// <summary>
		/// WebMarkupMin context
		/// </summary>
		private readonly WebMarkupMinContext _wmmContext;

		/// <summary>
		/// Registry of CSS minifiers
		/// </summary>
		private Dictionary<string, CodeMinifierInfo> _cssMinifierRegistry;

		/// <summary>
		/// Synchronizer of CSS minifiers registry
		/// </summary>
		private readonly object _cssMinifierRegistrySynchronizer = new object();

		/// <summary>
		/// Registry of JS minifiers
		/// </summary>
		private Dictionary<string, CodeMinifierInfo> _jsMinifierRegistry;

		/// <summary>
		/// Synchronizer of JS minifiers registry
		/// </summary>
		private readonly object _jsMinifierRegistrySynchronizer = new object();


		/// <summary>
		/// Constructs instance of code minification context
		/// </summary>
		/// <param name="wmmContext">WebMarkupMin context</param>
		internal CodeContext(WebMarkupMinContext wmmContext)
		{
			_wmmContext = wmmContext;
		}


		/// <summary>
		/// Gets a registry of CSS minifiers
		/// </summary>
		/// <returns>Registry of CSS minifiers</returns>
		public Dictionary<string, CodeMinifierInfo> GetCssMinifierRegistry()
		{
			lock (_cssMinifierRegistrySynchronizer)
			{
				if (_cssMinifierRegistry == null)
				{
					CodeMinifierRegistrationList cssMinifierRegistrationList =
						_wmmContext.GetCoreConfiguration().Css.Minifiers;
					_cssMinifierRegistry = new Dictionary<string, CodeMinifierInfo>();

					foreach (CodeMinifierRegistration cssMinifierRegistration in cssMinifierRegistrationList)
					{
						_cssMinifierRegistry.Add(cssMinifierRegistration.Name,
							new CodeMinifierInfo(
								cssMinifierRegistration.Name,
								cssMinifierRegistration.DisplayName,
								cssMinifierRegistration.Type));
					}
				}
			}

			return _cssMinifierRegistry;
		}

		/// <summary>
		/// Creates a instance of CSS minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="name">CSS minifier name</param>
		/// <param name="loadSettingsFromConfigurationFile">Flag for whether to allow
		/// loading minifier settings from configuration file</param>
		/// <returns>CSS minifier</returns>
		public ICssMinifier CreateCssMinifierInstance(string name,
			bool loadSettingsFromConfigurationFile = true)
		{
			ICssMinifier cssMinifier;
			Dictionary<string, CodeMinifierInfo> cssMinifierRegistry = GetCssMinifierRegistry();

			if (cssMinifierRegistry.ContainsKey(name))
			{
				CodeMinifierInfo cssMinifierInfo = cssMinifierRegistry[name];

				cssMinifier = Utils.CreateInstanceByFullTypeName<ICssMinifier>(cssMinifierInfo.Type);
				if (loadSettingsFromConfigurationFile)
				{
					cssMinifier.LoadSettingsFromConfigurationFile();
				}
			}
			else
			{
				throw new CodeMinifierNotFoundException(
					string.Format(Strings.Configuration_CodeMinifierNotRegistered, "CSS", name));
			}

			return cssMinifier;
		}

		/// <summary>
		/// Creates a instance of default CSS minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="loadSettingsFromConfigurationFile">Flag for whether to allow
		/// loading minifier settings from configuration file</param>
		/// <returns>CSS minifier</returns>
		public ICssMinifier CreateDefaultCssMinifierInstance(bool loadSettingsFromConfigurationFile = true)
		{
			string defaultCssMinifierName = _wmmContext.GetCoreConfiguration().Css.DefaultMinifier;
			if (string.IsNullOrWhiteSpace(defaultCssMinifierName))
			{
				throw new ConfigurationErrorsException(
					string.Format(Strings.Configuration_DefaultCodeMinifierNotSpecified, "CSS"));
			}

			ICssMinifier cssMinifier = CreateCssMinifierInstance(defaultCssMinifierName,
				loadSettingsFromConfigurationFile);

			return cssMinifier;
		}

		/// <summary>
		/// Gets a registry of JS minifiers
		/// </summary>
		/// <returns>Registry of JS minifiers</returns>
		public Dictionary<string, CodeMinifierInfo> GetJsMinifierRegistry()
		{
			lock (_jsMinifierRegistrySynchronizer)
			{
				if (_jsMinifierRegistry == null)
				{
					CodeMinifierRegistrationList jsMinifierRegistrationList =
						_wmmContext.GetCoreConfiguration().Js.Minifiers;
					_jsMinifierRegistry = new Dictionary<string, CodeMinifierInfo>();

					foreach (CodeMinifierRegistration jsMinifierRegistration in jsMinifierRegistrationList)
					{
						_jsMinifierRegistry.Add(jsMinifierRegistration.Name,
							new CodeMinifierInfo(
								jsMinifierRegistration.Name,
								jsMinifierRegistration.DisplayName,
								jsMinifierRegistration.Type));
					}
				}
			}

			return _jsMinifierRegistry;
		}

		/// <summary>
		/// Creates a instance of JS minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="name">JS minifier name</param>
		/// <param name="loadSettingsFromConfigurationFile">Flag for whether to allow
		/// loading minifier settings from configuration file</param>
		/// <returns>JS minifier</returns>
		public IJsMinifier CreateJsMinifierInstance(string name,
			bool loadSettingsFromConfigurationFile = true)
		{
			IJsMinifier jsMinifier;
			Dictionary<string, CodeMinifierInfo> jsMinifierRegisty = GetJsMinifierRegistry();

			if (jsMinifierRegisty.ContainsKey(name))
			{
				CodeMinifierInfo jsMinifierInfo = jsMinifierRegisty[name];

				jsMinifier = Utils.CreateInstanceByFullTypeName<IJsMinifier>(jsMinifierInfo.Type);
				if (loadSettingsFromConfigurationFile)
				{
					jsMinifier.LoadSettingsFromConfigurationFile();
				}
			}
			else
			{
				throw new CodeMinifierNotFoundException(
					string.Format(Strings.Configuration_CodeMinifierNotRegistered, "JS", name));
			}

			return jsMinifier;
		}

		/// <summary>
		/// Creates a instance of default JS minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="loadSettingsFromConfigurationFile">Flag for whether to allow
		/// loading minifier settings from configuration file</param>
		/// <returns>JS minifier</returns>
		public IJsMinifier CreateDefaultJsMinifierInstance(bool loadSettingsFromConfigurationFile = true)
		{
			string defaultJsMinifierName = _wmmContext.GetCoreConfiguration().Js.DefaultMinifier;
			if (string.IsNullOrWhiteSpace(defaultJsMinifierName))
			{
				throw new ConfigurationErrorsException(
					string.Format(Strings.Configuration_DefaultCodeMinifierNotSpecified, "JS"));
			}

			IJsMinifier jsMinifier = CreateJsMinifierInstance(defaultJsMinifierName,
				loadSettingsFromConfigurationFile);

			return jsMinifier;
		}
	}
}