namespace WebMarkupMin.Core
{
	using Configuration;
	using Loggers;
	using Minifiers;
	using Settings;

	/// <summary>
	/// Markup minification context
	/// </summary>
	public sealed class MarkupContext
	{
		/// <summary>
		/// WebMarkupMin context
		/// </summary>
		private readonly WebMarkupMinContext _wmmContext;


		/// <summary>
		/// Constructs instance of markup minification context
		/// </summary>
		/// <param name="wmmContext">WebMarkupMin context</param>
		internal MarkupContext(WebMarkupMinContext wmmContext)
		{
			_wmmContext = wmmContext;
		}


		/// <summary>
		/// Gets a HTML minification settings based on data from
		/// configuration files (App.config or Web.config)
		/// </summary>
		/// <returns>HTML minification settings</returns>
		public HtmlMinificationSettings GetHtmlMinificationSettings()
		{
			HtmlMinificationConfiguration htmlConfig = _wmmContext.GetCoreConfiguration().Html;

			var htmlSettings = new HtmlMinificationSettings();
			MapCommonHtmlSettings(htmlSettings, htmlConfig);
			htmlSettings.RemoveCdataSectionsFromScriptsAndStyles = htmlConfig.RemoveCdataSectionsFromScriptsAndStyles;
			htmlSettings.EmptyTagRenderMode = htmlConfig.EmptyTagRenderMode;
			htmlSettings.RemoveOptionalEndTags = htmlConfig.RemoveOptionalEndTags;
			htmlSettings.CollapseBooleanAttributes = htmlConfig.CollapseBooleanAttributes;
			htmlSettings.AttributeQuotesRemovalMode = htmlConfig.AttributeQuotesRemovalMode;
			htmlSettings.RemoveJsTypeAttributes = htmlConfig.RemoveJsTypeAttributes;
			htmlSettings.RemoveCssTypeAttributes = htmlConfig.RemoveCssTypeAttributes;

			return htmlSettings;
		}

		/// <summary>
		/// Creates a instance of HTML minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="settings">HTML minification settings</param>
		/// <param name="cssMinifier">CSS minifier</param>
		/// <param name="jsMinifier">JS minifier</param>
		/// <param name="logger">logger</param>
		/// <returns>HTML minifier</returns>
		public HtmlMinifier CreateHtmlMinifierInstance(HtmlMinificationSettings settings = null,
			ICssMinifier cssMinifier = null, IJsMinifier jsMinifier = null, ILogger logger = null)
		{
			HtmlMinificationSettings innerSettings = settings ?? GetHtmlMinificationSettings();
			ICssMinifier innerCssMinifier = cssMinifier ?? _wmmContext.Code.CreateDefaultCssMinifierInstance();
			IJsMinifier innerJsMinifier = jsMinifier ?? _wmmContext.Code.CreateDefaultJsMinifierInstance();
			ILogger innerLogger = logger ?? _wmmContext.GetDefaultLoggerInstance();

			var htmlMinifier = new HtmlMinifier(innerSettings, innerCssMinifier, innerJsMinifier, innerLogger);

			return htmlMinifier;
		}

		/// <summary>
		/// Gets a XHTML minification settings based on data from
		/// configuration files (App.config or Web.config)
		/// </summary>
		/// <returns>XHTML minification settings</returns>
		public XhtmlMinificationSettings GetXhtmlMinificationSettings()
		{
			XhtmlMinificationConfiguration xhtmlConfig = _wmmContext.GetCoreConfiguration().Xhtml;

			var xhtmlSettings = new XhtmlMinificationSettings();
			MapCommonHtmlSettings(xhtmlSettings, xhtmlConfig);
			xhtmlSettings.RenderEmptyTagsWithSpace = xhtmlConfig.RenderEmptyTagsWithSpace;


			return xhtmlSettings;
		}

		/// <summary>
		/// Creates a instance of XHTML minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="settings">XHTML minification settings</param>
		/// <param name="cssMinifier">CSS minifier</param>
		/// <param name="jsMinifier">JS minifier</param>
		/// <param name="logger">logger</param>
		/// <returns>XHTML minifier</returns>
		public XhtmlMinifier CreateXhtmlMinifierInstance(XhtmlMinificationSettings settings = null,
			ICssMinifier cssMinifier = null, IJsMinifier jsMinifier = null, ILogger logger = null)
		{
			XhtmlMinificationSettings innerSettings = settings ?? GetXhtmlMinificationSettings();
			ICssMinifier innerCssMinifier = cssMinifier ?? _wmmContext.Code.CreateDefaultCssMinifierInstance();
			IJsMinifier innerJsMinifier = jsMinifier ?? _wmmContext.Code.CreateDefaultJsMinifierInstance();
			ILogger innerLogger = logger ?? _wmmContext.GetDefaultLoggerInstance();

			var xhtmlMinifier = new XhtmlMinifier(innerSettings, innerCssMinifier, innerJsMinifier, innerLogger);

			return xhtmlMinifier;
		}

		/// <summary>
		/// Maps a common HTML settings
		/// </summary>
		/// <param name="commonSettings">Common settings of HTML minifier</param>
		/// <param name="commonConfig">Common configuration settings of HTML minifier</param>
		private static void MapCommonHtmlSettings(CommonHtmlMinificationSettingsBase commonSettings,
			CommonHtmlMinificationConfigurationBase commonConfig)
		{
			commonSettings.WhitespaceMinificationMode= commonConfig.WhitespaceMinificationMode;
			commonSettings.RemoveHtmlComments = commonConfig.RemoveHtmlComments;
			commonSettings.RemoveHtmlCommentsFromScriptsAndStyles = commonConfig.RemoveHtmlCommentsFromScriptsAndStyles;
			commonSettings.UseShortDoctype = commonConfig.UseShortDoctype;
			commonSettings.UseMetaCharsetTag = commonConfig.UseMetaCharsetTag;
			commonSettings.RemoveTagsWithoutContent = commonConfig.RemoveTagsWithoutContent;
			commonSettings.RemoveEmptyAttributes = commonConfig.RemoveEmptyAttributes;
			commonSettings.RemoveRedundantAttributes = commonConfig.RemoveRedundantAttributes;
			commonSettings.RemoveHttpProtocolFromAttributes = commonConfig.RemoveHttpProtocolFromAttributes;
			commonSettings.RemoveHttpsProtocolFromAttributes = commonConfig.RemoveHttpsProtocolFromAttributes;
			commonSettings.RemoveJsProtocolFromAttributes = commonConfig.RemoveJsProtocolFromAttributes;
			commonSettings.MinifyEmbeddedCssCode = commonConfig.MinifyEmbeddedCssCode;
			commonSettings.MinifyInlineCssCode = commonConfig.MinifyInlineCssCode;
			commonSettings.MinifyEmbeddedJsCode = commonConfig.MinifyEmbeddedJsCode;
			commonSettings.MinifyInlineJsCode = commonConfig.MinifyInlineJsCode;
			commonSettings.ProcessableScriptTypeList = commonConfig.ProcessableScriptTypeList;
			commonSettings.MinifyKnockoutBindingExpressions = commonConfig.MinifyKnockoutBindingExpressions;
			commonSettings.MinifyAngularBindingExpressions = commonConfig.MinifyAngularBindingExpressions;
			commonSettings.CustomAngularDirectiveList = commonConfig.CustomAngularDirectiveList;
		}

		/// <summary>
		/// Gets a XML minification settings based on data from
		/// configuration files (App.config or Web.config)
		/// </summary>
		/// <returns>XML minification settings</returns>
		public XmlMinificationSettings GetXmlMinificationSettings()
		{
			XmlMinificationConfiguration xmlConfig = _wmmContext.GetCoreConfiguration().Xml;
			var xmlSettings = new XmlMinificationSettings
			{
				MinifyWhitespace = xmlConfig.MinifyWhitespace,
				RemoveXmlComments = xmlConfig.RemoveXmlComments,
				RenderEmptyTagsWithSpace = xmlConfig.RenderEmptyTagsWithSpace,
				CollapseTagsWithoutContent = xmlConfig.CollapseTagsWithoutContent
			};

			return xmlSettings;
		}

		/// <summary>
		/// Creates a instance of XML minifier based on the settings
		/// that specified in configuration files (App.config or Web.config)
		/// </summary>
		/// <param name="settings">XML minification settings</param>
		/// <param name="logger">logger</param>
		/// <returns>XML minifier</returns>
		public XmlMinifier CreateXmlMinifierInstance(XmlMinificationSettings settings = null, ILogger logger = null)
		{
			XmlMinificationSettings innerSettings = settings ?? GetXmlMinificationSettings();
			ILogger innerLogger = logger ?? _wmmContext.GetDefaultLoggerInstance();

			var xmlMinifier = new XmlMinifier(innerSettings, innerLogger);

			return xmlMinifier;
		}
	}
}