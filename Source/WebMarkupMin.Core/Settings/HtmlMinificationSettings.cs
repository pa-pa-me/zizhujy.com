﻿namespace WebMarkupMin.Core.Settings
{
	/// <summary>
	/// HTML minification settings
	/// </summary>
	public sealed class HtmlMinificationSettings : AdvancedHtmlMinificationSettingsBase
	{
		/// <summary>
		/// Constructs instance of HTML minification settings
		/// </summary>
		public HtmlMinificationSettings()
			: this(false)
		{ }

		/// <summary>
		/// Constructs instance of HTML minification settings
		/// </summary>
		/// <param name="useEmptyMinificationSettings">Initiates the creation of
		/// empty HTML minification settings</param>
		public HtmlMinificationSettings(bool useEmptyMinificationSettings)
			: base(useEmptyMinificationSettings)
		{
			if (!useEmptyMinificationSettings)
			{
				RemoveCdataSectionsFromScriptsAndStyles = true;
				UseShortDoctype = true;
				UseMetaCharsetTag = true;
				EmptyTagRenderMode = HtmlEmptyTagRenderMode.NoSlash;
				RemoveOptionalEndTags = true;
				CollapseBooleanAttributes = true;
				AttributeQuotesRemovalMode = HtmlAttributeQuotesRemovalMode.Html5;
				RemoveJsTypeAttributes = true;
				RemoveCssTypeAttributes = true;
			}
			else
			{
				RemoveCdataSectionsFromScriptsAndStyles = false;
				UseShortDoctype = false;
				UseMetaCharsetTag = false;
				EmptyTagRenderMode = HtmlEmptyTagRenderMode.NoSlash;
				RemoveOptionalEndTags = false;
				CollapseBooleanAttributes = false;
				AttributeQuotesRemovalMode = HtmlAttributeQuotesRemovalMode.KeepQuotes;
				RemoveJsTypeAttributes = false;
				RemoveCssTypeAttributes = false;
			}
		}
	}
}