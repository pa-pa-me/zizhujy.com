﻿namespace WebMarkupMin.Core.Minifiers
{
	using System.Text;

	using Loggers;
	using Settings;

	/// <summary>
	/// XHTML minifier
	/// </summary>
	public sealed class XhtmlMinifier : IMarkupMinifier
	{
		/// <summary>
		/// Generic HTML minifier
		/// </summary>
		private readonly GenericHtmlMinifier _genericHtmlMinifier;


		/// <summary>
		/// Constructs instance of XHTML minifier
		/// </summary>
		/// <param name="cssMinifier">CSS minifier</param>
		/// <param name="jsMinifier">JS minifier</param>
		/// <param name="settings">XHTML minification settings</param>
		/// <param name="logger">Logger</param>
		public XhtmlMinifier(XhtmlMinificationSettings settings = null, ICssMinifier cssMinifier = null,
			IJsMinifier jsMinifier = null, ILogger logger = null)
		{
			settings = settings ?? new XhtmlMinificationSettings();

			_genericHtmlMinifier = new GenericHtmlMinifier(
				new GenericHtmlMinificationSettings
				{
					WhitespaceMinificationMode = settings.WhitespaceMinificationMode,
					RemoveHtmlComments = settings.RemoveHtmlComments,
					RemoveHtmlCommentsFromScriptsAndStyles = settings.RemoveHtmlCommentsFromScriptsAndStyles,
					RemoveCdataSectionsFromScriptsAndStyles = false,
					UseShortDoctype = settings.UseShortDoctype,
					UseMetaCharsetTag = settings.UseMetaCharsetTag,
					EmptyTagRenderMode = settings.RenderEmptyTagsWithSpace ?
						HtmlEmptyTagRenderMode.SpaceAndSlash : HtmlEmptyTagRenderMode.Slash,
					RemoveOptionalEndTags = false,
					RemoveTagsWithoutContent = settings.RemoveTagsWithoutContent,
					CollapseBooleanAttributes = false,
					RemoveEmptyAttributes = settings.RemoveEmptyAttributes,
					AttributeQuotesRemovalMode = HtmlAttributeQuotesRemovalMode.KeepQuotes,
					RemoveRedundantAttributes = settings.RemoveRedundantAttributes,
					RemoveJsTypeAttributes = false,
					RemoveCssTypeAttributes = false,
					RemoveHttpProtocolFromAttributes = settings.RemoveHttpProtocolFromAttributes,
					RemoveHttpsProtocolFromAttributes = settings.RemoveHttpsProtocolFromAttributes,
					RemoveJsProtocolFromAttributes = settings.RemoveJsProtocolFromAttributes,
					MinifyEmbeddedCssCode = settings.MinifyEmbeddedCssCode,
					MinifyInlineCssCode = settings.MinifyInlineCssCode,
					MinifyEmbeddedJsCode = settings.MinifyEmbeddedJsCode,
					MinifyInlineJsCode = settings.MinifyInlineJsCode,
					ProcessableScriptTypeList = settings.ProcessableScriptTypeList,
					MinifyKnockoutBindingExpressions = settings.MinifyKnockoutBindingExpressions,
					MinifyAngularBindingExpressions = settings.MinifyAngularBindingExpressions,
					CustomAngularDirectiveList = settings.CustomAngularDirectiveList,
					UseXhtmlSyntax = true
				},
				cssMinifier,
				jsMinifier,
				logger
			);
		}


		/// <summary>
		/// Minify XHTML content
		/// </summary>
		/// <param name="content">XHTML content</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content)
		{
			return _genericHtmlMinifier.Minify(content);
		}

		/// <summary>
		/// Minify XHTML content
		/// </summary>
		/// <param name="content">XHTML content</param>
		/// <param name="fileContext">File context</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, string fileContext)
		{
			return _genericHtmlMinifier.Minify(content, fileContext);
		}

		/// <summary>
		/// Minify XHTML content
		/// </summary>
		/// <param name="content">XHTML content</param>
		/// <param name="encoding">Text encoding</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, Encoding encoding)
		{
			return _genericHtmlMinifier.Minify(content, encoding);
		}

		/// <summary>
		/// Minify XHTML content
		/// </summary>
		/// <param name="content">XHTML content</param>
		/// <param name="generateStatistics">Flag for whether to allow generate minification statistics</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, bool generateStatistics)
		{
			return _genericHtmlMinifier.Minify(content, generateStatistics);
		}

		/// <summary>
		/// Minify XHTML content
		/// </summary>
		/// <param name="content">XHTML content</param>
		/// <param name="fileContext">File context</param>
		/// <param name="encoding">Text encoding</param>
		/// <param name="generateStatistics">Flag for whether to allow generate minification statistics</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, string fileContext, Encoding encoding,
			bool generateStatistics)
		{
			return _genericHtmlMinifier.Minify(content, fileContext, encoding, generateStatistics);
		}
	}
}