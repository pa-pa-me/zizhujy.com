namespace WebMarkupMin.Web
{
	using System;
	using System.Configuration;
	using System.Web;

	using Core;
	using Configuration;

	/// <summary>
	/// WebMarkupMin context extensions
	/// </summary>
	public static class WebMarkupMinContextExtensions
	{
		/// <summary>
		/// Configuration settings of web extensions
		/// </summary>
		private static readonly Lazy<WebExtensionsConfiguration> _webExtensionsConfig =
			new Lazy<WebExtensionsConfiguration>(() =>
				(WebExtensionsConfiguration)ConfigurationManager.GetSection("webMarkupMin/webExtensions"));


		/// <summary>
		/// Checks whether the markup minification is enabled
		/// </summary>
		/// <param name="context">WebMarkupMin context</param>
		/// <returns>Result of check (true - minification is enabled; false - minification is disabled)</returns>
		public static bool IsMinificationEnabled(this WebMarkupMinContext context)
		{
			bool isMinificationEnabled = false;

			if (_webExtensionsConfig.Value.EnableMinification)
			{
				isMinificationEnabled = !HttpContext.Current.IsDebuggingEnabled
					|| !_webExtensionsConfig.Value.DisableMinificationInDebugMode;
			}

			return isMinificationEnabled;
		}

		/// <summary>
		/// Checks whether the GZIP/Deflate compression is enabled
		/// </summary>
		/// <param name="context">WebMarkupMin context</param>
		/// <returns>Result of check (true - compression is enabled; false - compression is disabled)</returns>
		public static bool IsCompressionEnabled(this WebMarkupMinContext context)
		{
			bool isCompressionEnabled = false;

			if (_webExtensionsConfig.Value.EnableCompression)
			{
				isCompressionEnabled = !HttpContext.Current.IsDebuggingEnabled
					|| !_webExtensionsConfig.Value.DisableCompressionInDebugMode;
			}

			return isCompressionEnabled;
		}

		/// <summary>
		/// Checks whether the response size is not exceeded the limit
		/// </summary>
		/// <param name="context">HTTP context</param>
		/// <param name="responseSize">Response size in bytes</param>
		/// <returns>Result of check (true - size is allowable; false - size is not allowable)</returns>
		public static bool CheckResponseSize(this WebMarkupMinContext context, long responseSize)
		{
			bool isAllowableResponseSize = (responseSize <= _webExtensionsConfig.Value.MaxResponseSize);

			return isAllowableResponseSize;
		}

		/// <summary>
		/// Checks whether the adding of WebMarkupMin copyright HTTP headers in the response is enabled
		/// </summary>
		/// <param name="context">WebMarkupMin context</param>
		/// <returns>Result of check (true - is enabled; false - is disabled)</returns>
		public static bool IsCopyrightHttpHeadersEnabled(this WebMarkupMinContext context)
		{
			bool isCopyrightHttpHeadersEnabled = !_webExtensionsConfig.Value.DisableCopyrightHttpHeaders;

			return isCopyrightHttpHeadersEnabled;
		}
	}
}