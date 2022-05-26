﻿/* This minifier based on the code of Experimental HTML Minifier
 * (http://kangax.github.com/html-minifier/) version 0.4.4.
 */

/* htmlminifier.js
 * May 14, 2012
 *
 * Copyright (c) 2010 Juriy "kangax" Zaytsev  (http://kangax.github.com)
 *
 * Licensed under the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

namespace WebMarkupMin.Core.Minifiers
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Text.RegularExpressions;

	using Constants;
	using Helpers;
	using Loggers;
	using Parsers;
	using Resources;
	using Settings;
	using Utilities;

	/// <summary>
	/// Generic HTML minifier
	/// </summary>
	internal sealed class GenericHtmlMinifier : IMarkupMinifier
	{
		const string HTTP_PROTOCOL = "http:";
		const string HTTPS_PROTOCOL = "https:";
		const string JS_PROTOCOL = "javascript:";

		const string JS_CONTENT_TYPE = "text/javascript";
		const string VBS_CONTENT_TYPE = "text/vbscript";
		const string CSS_CONTENT_TYPE = "text/css";

		#region Regular expressions
		private static readonly Regex _noindexCommentRegex = new Regex(@"^(?<closingSlash>/)?noindex$",
			RegexOptions.IgnoreCase);
		private static readonly Regex _metaContentTypeTagValueRegex =
			new Regex(@"^(?:[a-zA-Z0-9\-+./]+);\s*charset=(?<charset>[a-zA-Z0-9\-]+)$", RegexOptions.IgnoreCase);
		private static readonly Regex _html4AttributeValueNotRequireQuotesRegex = new Regex(@"^[a-zA-Z0-9-_.:]+$");
		private static readonly Regex _html5AttributeValueNotRequireQuotesRegex = new Regex(@"^[^\s=""'`<>]+$");
		private static readonly Regex _jsProtocolRegex = new Regex(@"^javascript:\s*", RegexOptions.IgnoreCase);
		private static readonly Regex _separatingCommaWithSpacesRegex = new Regex(@"\s*,\s*");
		private static readonly Regex _endingCommaWithSpacesRegex = new Regex(@"\s*,\s*$");

		private static readonly Regex _styleBeginHtmlCommentRegex = new Regex(@"^\s*<!--(?:[ \t\v]*\r?\n)?");
		private static readonly Regex _styleEndHtmlCommentRegex = new Regex(@"(?:\r?\n[ \t\v]*)?-->\s*$");

		private static readonly Regex _styleBeginCdataSectionRegex = new Regex(
			@"^\s*/\*\s*<!\[CDATA\[\s*\*/(?:[ \t\v]*\r?\n)?", RegexOptions.IgnoreCase);
		private static readonly Regex _styleEndCdataSectionRegex = new Regex(@"(?:\r?\n[ \t\v]*)?/\*\s*\]\]>\s*\*/\s*$");

		private static readonly Regex _styleBeginMaxCompatibleCdataSectionRegex = new Regex(
			@"^\s*<!--\s*/\*\s*--><!\[CDATA\[\s*/\*\s*><!--\s*\*/(?:[ \t\v]*\r?\n)?", RegexOptions.IgnoreCase);
		private static readonly Regex _styleEndMaxCompatibleCdataSectionRegex = new Regex(
			@"(?:\r?\n[ \t\v]*)?/\*\s*\]\]>\s*\*/\s*-->\s*$");

		private static readonly Regex _scriptBeginHtmlCommentRegex = new Regex(
			@"^\s*(?://[ \t\v]*)?<!--[ \t\v\S]*(?:\r?\n)?");
		private static readonly Regex _scriptEndHtmlCommentRegex = new Regex(@"(?:\r?\n)?[ \t\v\S]*-->\s*$");

		private static readonly Regex _scriptBeginCdataSectionRegex = new Regex(
			@"^\s*(?:(?://[ \t\v]*)?<!\[CDATA\[[ \t\v\S]*\r?\n|/\*\s*<!\[CDATA\[\s*\*/(?:[ \t\v]*\r?\n)?)",
			RegexOptions.IgnoreCase);
		private static readonly Regex _scriptEndCdataSectionRegex = new Regex(
			@"(?:\r?\n(?://[ \t\v\S]*)?\]\]>|(?:\r?\n[ \t\v]*)?/\*\s*\]\]>\s*\*/)\s*$");

		private static readonly Regex _scriptBeginMaxCompatibleCdataSectionRegex = new Regex(
			@"^\s*(?:<!--[ \t\v]*//[ \t\v]*--><!\[CDATA\[[ \t\v]*//[ \t\v]*><!--[ \t\v]*\r?\n" +
			@"|<!--\s*/\*\s*--><!\[CDATA\[\s*/\*\s*><!--\s*\*/(?:[ \t\v]*\r?\n)?)", RegexOptions.IgnoreCase);
		private static readonly Regex _scriptEndMaxCompatibleCdataSectionRegex = new Regex(
			@"(?:\r?\n[ \t\v]*//[ \t\v]*--><!\]\]>" +
			@"|(?:\r?\n[ \t\v]*)?/\*\s*\]\]>\s*\*/\s*-->)\s*$");

		private static readonly Regex _relExternalAttributeRegex = new Regex(@"^(?:alternate\s+)?external$",
			RegexOptions.IgnoreCase);
		#endregion

		#region Lists of tags and attributes
		private static readonly HashSet<string> _emptyAttributesForRemoval = new HashSet<string>
		{
			"class", "id", "name", "style", "title", "lang", "dir"
		};

		private static readonly HashSet<string> _tagsWithNotRemovableWhitespace = new HashSet<string>
		{
			"pre", "textarea"
		};

		private static readonly HashSet<string> _unremovableEmptyTags = new HashSet<string>
		{
			"textarea", "tr", "th", "td"
		};

		private static readonly HashSet<string> _unremovableEmptyTagAttributes = new HashSet<string>
		{
			"class", "id", "name", "role", "src"
		};

		private static readonly HashSet<string> _safeOptionalEndTags = new HashSet<string>
		{
			"html", "head", "body", "colgroup"
		};

		private static readonly HashSet<string> _tagsFollowingAfterParagraphOptionalEndTag = new HashSet<string>
		{
			"address", "article", "aside",
			"blockquote",
			"dir", "div", "dl",
			"fieldset", "footer", "form",
			"h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr",
			"main", "menu",
			"nav",
			"ol",
			"p", "pre",
			"section",
			"table",
			"ul"
		};
		#endregion

		/// <summary>
		/// List of JavaScript content types
		/// </summary>
		private static readonly HashSet<string> _jsContentTypes = new HashSet<string>
		{
			"text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript"
		};

		/// <summary>
		/// List of names of built-in Angular directives, that contain expressions
		/// </summary>
		private static readonly HashSet<string> _builtinAngularDirectivesWithExpressions = new HashSet<string>
		{
			"ngBind", "ngBindHtml", "ngBlur",
			"ngChange", "ngChecked", "ngClass", "ngClassEven", "ngClassOdd", "ngClick", "ngController", "ngCopy", "ngCut",
			"ngDblclick", "ngDisabled",
			"ngFocus",
			"ngHide",
			"ngIf", "ngInit",
			"ngKeydown", "ngKeypress", "ngKeyup",
			"ngModelOptions", "ngMousedown", "ngMouseenter", "ngMouseleave", "ngMousemove", "ngMouseover", "ngMouseup",
			"ngOpen",
			"ngPaste",
			"ngReadonly", "ngRepeat", "ngRepeatStart",
			"ngSelected", "ngShow", "ngStyle", "ngSubmit", "ngSwitch"
		};

		/// <summary>
		/// Generic HTML minification settings
		/// </summary>
		private readonly GenericHtmlMinificationSettings _settings;

		/// <summary>
		/// CSS minifier
		/// </summary>
		private readonly ICssMinifier _cssMinifier;

		/// <summary>
		/// JS minifier
		/// </summary>
		private readonly IJsMinifier _jsMinifier;

		/// <summary>
		/// Logger
		/// </summary>
		private readonly ILogger _logger;

		/// <summary>
		/// HTML parser
		/// </summary>
		private readonly HtmlParser _htmlParser;

		/// <summary>
		/// Inner HTML minifier
		/// </summary>
		private GenericHtmlMinifier _innerHtmlMinifier;

		/// <summary>
		/// Synchronizer of inner HTML minifier instance
		/// </summary>
		private readonly object _innerHtmlMinifierInstanceSynchronizer = new object();

		/// <summary>
		/// Inner XML minifier
		/// </summary>
		private XmlMinifier _innerXmlMinifier;

		/// <summary>
		/// Synchronizer of inner XML minifier instance
		/// </summary>
		private readonly object _innerXmlMinifierInstanceSynchronizer = new object();

		/// <summary>
		/// Inner Douglas Crockford's JS minifier
		/// </summary>
		private readonly Lazy<CrockfordJsMinifier> _innerCrockfordJsMinifier = new Lazy<CrockfordJsMinifier>();

		/// <summary>
		/// File context
		/// </summary>
		private string _fileContext;

		/// <summary>
		/// Text encoding
		/// </summary>
		private Encoding _encoding;

		/// <summary>
		/// Result of HTML minification
		/// </summary>
		private StringBuilder _result;

		/// <summary>
		/// HTML minification buffer
		/// </summary>
		private List<string> _buffer;

		private Queue<string> _tagsWithNotRemovableWhitespaceQueue;

		/// <summary>
		/// Current node type
		/// </summary>
		private HtmlNodeType _currentNodeType;

		/// <summary>
		/// Current tag
		/// </summary>
		private HtmlTag _currentTag;

		/// <summary>
		/// Current text
		/// </summary>
		private string _currentText;

		/// <summary>
		/// List of the errors
		/// </summary>
		private IList<MinificationErrorInfo> _errors;

		/// <summary>
		/// List of the warnings
		/// </summary>
		private IList<MinificationErrorInfo> _warnings;

		/// <summary>
		/// Synchronizer of minification
		/// </summary>
		private readonly object _minificationSynchronizer = new object();

		/// <summary>
		/// List of types of <code>script</code> tags, that are processed by minifier
		/// </summary>
		private readonly HashSet<string> _processableScriptTypes;

		/// <summary>
		/// List of names of Angular directives, that contain expressions
		/// </summary>
		private readonly HashSet<string> _angularDirectivesWithExpressions;


		/// <summary>
		/// Constructs instance of generic HTML minifier
		/// </summary>
		/// <param name="settings">Generic HTML minification settings</param>
		/// <param name="cssMinifier">CSS minifier</param>
		/// <param name="jsMinifier">JS minifier</param>
		/// <param name="logger">Logger</param>
		public GenericHtmlMinifier(GenericHtmlMinificationSettings settings = null,
			ICssMinifier cssMinifier = null, IJsMinifier jsMinifier = null, ILogger logger = null)
		{
			_settings = settings ?? new GenericHtmlMinificationSettings();
			_logger = logger ?? new NullLogger();
			_cssMinifier = cssMinifier ?? new KristensenCssMinifier();
			_jsMinifier = jsMinifier ?? new CrockfordJsMinifier();
			_htmlParser = new HtmlParser(new HtmlParsingHandlers
			{
				XmlDeclaration = XmlDeclarationHandler,
				Doctype = DoctypeHandler,
				Comment = CommentHandler,
				IfConditionalComment = IfConditionalCommentHandler,
				EndIfConditionalComment = EndIfConditionalCommentHandler,
				StartTag = StartTagHandler,
				EndTag = EndTagHandler,
				Text = TextHandler,
				TemplateTag = TemplateTagHandler
			});

			_processableScriptTypes = new HashSet<string>(_settings.ProcessableScriptTypeCollection);

			IList<string> customAngularDirectivesWithExpressions = _settings.CustomAngularDirectiveCollection.ToList();
			_angularDirectivesWithExpressions = (customAngularDirectivesWithExpressions.Count > 0) ?
				Utils.UnionHashSets(_builtinAngularDirectivesWithExpressions, customAngularDirectivesWithExpressions)
				:
				_builtinAngularDirectivesWithExpressions
				;
		}


		/// <summary>
		/// Gets a instance of inner HTML minifier
		/// </summary>
		/// <returns>Instance of inner HTML minifier</returns>
		private GenericHtmlMinifier GetInnerHtmlMinifierInstance()
		{
			lock (_innerHtmlMinifierInstanceSynchronizer)
			{
				if (_innerHtmlMinifier == null)
				{
					_innerHtmlMinifier = new GenericHtmlMinifier(_settings, new NullCssMinifier(), new NullJsMinifier(),
						new NullLogger());
				}

				return _innerHtmlMinifier;
			}
		}

		/// <summary>
		/// Gets a instance of inner XML minifier
		/// </summary>
		/// <returns>Instance of inner XML minifier</returns>
		private XmlMinifier GetInnerXmlMinifierInstance()
		{
			lock (_innerXmlMinifierInstanceSynchronizer)
			{
				if (_innerXmlMinifier == null)
				{
					_innerXmlMinifier = new XmlMinifier(new XmlMinificationSettings
					{
						MinifyWhitespace = (_settings.WhitespaceMinificationMode != WhitespaceMinificationMode.None),
						RemoveXmlComments = _settings.RemoveHtmlComments,
						RenderEmptyTagsWithSpace = (_settings.EmptyTagRenderMode != HtmlEmptyTagRenderMode.Slash)
					});
				}

				return _innerXmlMinifier;
			}
		}

		/// <summary>
		/// Gets a instance of inner Douglas Crockford's JS minifier
		/// </summary>
		/// <returns>Instance of inner Douglas Crockford's JS minifier</returns>
		private CrockfordJsMinifier GetInnerCrockfordJsMinifierInstance()
		{
			return _innerCrockfordJsMinifier.Value;
		}

		/// <summary>
		/// Minify HTML content
		/// </summary>
		/// <param name="content">HTML content</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content)
		{
			return Minify(content, string.Empty, Encoding.Default, false);
		}

		/// <summary>
		/// Minify HTML content
		/// </summary>
		/// <param name="content">HTML content</param>
		/// <param name="fileContext">File context</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, string fileContext)
		{
			return Minify(content, fileContext, Encoding.Default, false);
		}

		/// <summary>
		/// Minify HTML content
		/// </summary>
		/// <param name="content">HTML content</param>
		/// <param name="encoding">Text encoding</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, Encoding encoding)
		{
			return Minify(content, string.Empty, encoding, false);
		}

		/// <summary>
		/// Minify HTML content
		/// </summary>
		/// <param name="content">HTML content</param>
		/// <param name="generateStatistics">Flag for whether to allow generate minification statistics</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, bool generateStatistics)
		{
			return Minify(content, string.Empty, Encoding.Default, generateStatistics);
		}

		/// <summary>
		/// Minify HTML content
		/// </summary>
		/// <param name="content">HTML content</param>
		/// <param name="fileContext">File context</param>
		/// <param name="encoding">Text encoding</param>
		/// <param name="generateStatistics">Flag for whether to allow generate minification statistics</param>
		/// <returns>Minification result</returns>
		public MarkupMinificationResult Minify(string content, string fileContext, Encoding encoding,
			bool generateStatistics)
		{
			MinificationStatistics statistics = null;
			string minifiedContent = string.Empty;
			var errors = new List<MinificationErrorInfo>();
			var warnings = new List<MinificationErrorInfo>();

			lock (_minificationSynchronizer)
			{
				_fileContext = fileContext;
				_encoding = encoding;

				try
				{
					if (generateStatistics)
					{
						statistics = new MinificationStatistics(_encoding);
						statistics.Init(content);
					}

					_result = new StringBuilder(content.Length);
					_buffer = new List<string>();
					_errors = new List<MinificationErrorInfo>();
					_warnings = new List<MinificationErrorInfo>();
					_tagsWithNotRemovableWhitespaceQueue = new Queue<string>();
					_currentNodeType = HtmlNodeType.Unknown;
					_currentTag = null;
					_currentText = string.Empty;

					_htmlParser.Parse(content);

					FlushBuffer();

					if (_errors.Count == 0)
					{
						minifiedContent = _result.ToString();

						if (generateStatistics)
						{
							statistics.End(minifiedContent);
						}
					}
				}
				catch (HtmlParsingException e)
				{
					WriteError(ErrorCategoryCode.HtmlParsingError, e.Message, _fileContext,
						e.LineNumber, e.ColumnNumber, e.SourceFragment);
				}
				finally
				{
					_result.Clear();
					_buffer.Clear();
					_tagsWithNotRemovableWhitespaceQueue.Clear();
					_currentTag = null;

					if (_errors.Count == 0)
					{
						_logger.Info(ErrorCategoryCode.HtmlMinificationSuccess,
							string.Format(Strings.SuccesMessage_MarkupMinificationComplete, "HTML"),
							_fileContext, statistics);
					}

					errors.AddRange(_errors);
					warnings.AddRange(_warnings);

					_errors.Clear();
					_warnings.Clear();
					_fileContext = null;
					_encoding = null;
				}
			}

			return new MarkupMinificationResult(minifiedContent, errors, warnings, statistics);
		}

		#region Handlers
		/// <summary>
		/// XML declaration handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="xmlDeclaration">XML declaration</param>
		private void XmlDeclarationHandler(MarkupParsingContext context, string xmlDeclaration)
		{
			_currentNodeType = HtmlNodeType.XmlDeclaration;

			WhitespaceMinificationMode whitespaceMinificationMode = _settings.WhitespaceMinificationMode;
			if (whitespaceMinificationMode != WhitespaceMinificationMode.None)
			{
				// Processing of whitespace, that followed before the document type declaration
				TrimEndLastBufferItem();
			}

			if (_settings.UseXhtmlSyntax)
			{
				XmlMinifier innerXmlMinifier = GetInnerXmlMinifierInstance();
				MarkupMinificationResult minificationResult = innerXmlMinifier.Minify(xmlDeclaration);

				if (minificationResult.Errors.Count == 0)
				{
					_buffer.Add(minificationResult.MinifiedContent);
				}
				else
				{
					string sourceCode = context.SourceCode;
					var documentCoordinates = context.NodeCoordinates;

					foreach (MinificationErrorInfo error in minificationResult.Errors)
					{
						var xmlNodeCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
						var absoluteNodeCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
							documentCoordinates, xmlNodeCoordinates);

						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteNodeCoordinates);
						string message = Strings.ErrorMessage_XmlDeclarationMinificationFailed;

						WriteError(ErrorCategoryCode.HtmlMinificationError, message, _fileContext,
							absoluteNodeCoordinates.LineNumber, absoluteNodeCoordinates.ColumnNumber, sourceFragment);
					}
				}
			}
			else
			{
				string sourceCode = context.SourceCode;
				SourceCodeNodeCoordinates xmlDeclarationCoordinates = context.NodeCoordinates;

				WriteWarning(ErrorCategoryCode.HtmlMinificationWarning,
					Strings.WarningMessage_XmlDeclarationNotAllowed, _fileContext,
					xmlDeclarationCoordinates.LineNumber, xmlDeclarationCoordinates.ColumnNumber,
					SourceCodeNavigator.GetSourceFragment(sourceCode, xmlDeclarationCoordinates));
			}
		}

		/// <summary>
		/// Document type declaration handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="doctype">Document type declaration</param>
		private void DoctypeHandler(MarkupParsingContext context, string doctype)
		{
			_currentNodeType = HtmlNodeType.Doctype;

			WhitespaceMinificationMode whitespaceMinificationMode = _settings.WhitespaceMinificationMode;
			if (whitespaceMinificationMode != WhitespaceMinificationMode.None)
			{
				// Processing of whitespace, that followed before the document type declaration
				TrimEndLastBufferItem();
			}

			_buffer.Add(_settings.UseShortDoctype ? "<!DOCTYPE html>" : Utils.CollapseWhitespace(doctype));
		}

		/// <summary>
		/// Comments handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="commentText">Comment text</param>
		private void CommentHandler(MarkupParsingContext context, string commentText)
		{
			_currentNodeType = HtmlNodeType.Comment;

			const int beginCommentLength = 4;
			string processedCommentText = string.Empty;

			if (_noindexCommentRegex.IsMatch(commentText))
			{
				// Processing of noindex comment
				Match noindexCommentMatch = _noindexCommentRegex.Match(commentText);
				processedCommentText = noindexCommentMatch.Groups["closingSlash"].Length > 0 ? "/noindex" : "noindex";
			}
			else if (KnockoutHelpers.IsEndContainerlessComment(commentText))
			{
				// Processing of end Knockout containerless comment
				processedCommentText = "/ko";
			}
			else if (KnockoutHelpers.IsBeginContainerlessComment(commentText))
			{
				// Processing of start Knockout containerless comment
				string koExpression = string.Empty;

				KnockoutHelpers.ParseBeginContainerlessComment(commentText,
					(localContext, expression) =>
					{
						SourceCodeNodeCoordinates expressionCoordinates = localContext.NodeCoordinates;
						expressionCoordinates.ColumnNumber += beginCommentLength;

						koExpression = ProcessKnockoutBindingExpression(context, expressionCoordinates, expression);
					}
				);

				processedCommentText = "ko " + koExpression;
			}
			else if (AngularHelpers.IsCommentDirective(commentText))
			{
				// Processing of Angular comment directive
				string ngOriginalDirectiveName = string.Empty;
				string ngNormalizedDirectiveName = string.Empty;
				string ngExpression = string.Empty;

				AngularHelpers.ParseCommentDirective(commentText,
					(localContext, originalDirectiveName, normalizedDirectiveName) =>
					{
						ngOriginalDirectiveName = originalDirectiveName;
						ngNormalizedDirectiveName = normalizedDirectiveName;
					},
					(localContext, expression) =>
					{
						SourceCodeNodeCoordinates expressionCoordinates = localContext.NodeCoordinates;
						expressionCoordinates.ColumnNumber += beginCommentLength;

						ngExpression = ProcessAngularBindingExpression(context, SourceCodeNodeCoordinates.Empty,
							expressionCoordinates, ngNormalizedDirectiveName, expression);
					}
				);

				processedCommentText = "directive:" + ngOriginalDirectiveName + " " + ngExpression;
			}
			else
			{
				if (!_settings.RemoveHtmlComments)
				{
					processedCommentText = commentText;
				}
			}

			if (processedCommentText.Length > 0)
			{
				_buffer.Add("<!--");
				_buffer.Add(processedCommentText);
				_buffer.Add("-->");
			}
		}

		/// <summary>
		/// If conditional comments handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="htmlConditionalComment">Conditional comment</param>
		private void IfConditionalCommentHandler(MarkupParsingContext context,
			HtmlConditionalComment htmlConditionalComment)
		{
			_currentNodeType = HtmlNodeType.IfConditionalComment;
			HtmlConditionalCommentType htmlConditionalCommentType = htmlConditionalComment.Type;

			string startPart;
			string endPart;

			switch (htmlConditionalCommentType)
			{
				case HtmlConditionalCommentType.Hidden:
					startPart = "<!--[if ";
					endPart = "]>";

					break;
				case HtmlConditionalCommentType.RevealedValidating:
					startPart = "<!--[if ";
					endPart = "]><!-->";

					break;
				case HtmlConditionalCommentType.RevealedValidatingSimplified:
					startPart = "<!--[if ";
					endPart = "]>-->";

					break;
				case HtmlConditionalCommentType.Revealed:
					startPart = "<![if ";
					endPart = "]>";

					break;
				default:
					throw new NotSupportedException();
			}

			_buffer.Add(startPart);
			_buffer.Add(htmlConditionalComment.Expression);
			_buffer.Add(endPart);
		}

		/// <summary>
		/// End If conditional comments handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="type">End If conditional comment type</param>
		private void EndIfConditionalCommentHandler(MarkupParsingContext context, HtmlConditionalCommentType type)
		{
			_currentNodeType = HtmlNodeType.EndIfConditionalComment;

			string endIfComment;

			switch (type)
			{
				case HtmlConditionalCommentType.Hidden:
					endIfComment = "<![endif]-->";
					break;
				case HtmlConditionalCommentType.RevealedValidating:
				case HtmlConditionalCommentType.RevealedValidatingSimplified:
					endIfComment = "<!--<![endif]-->";
					break;
				case HtmlConditionalCommentType.Revealed:
					endIfComment = "<![endif]>";
					break;
				default:
					throw new NotSupportedException();
			}

			_buffer.Add(endIfComment);
		}

		/// <summary>
		/// Start tags handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="tag">HTML tag</param>
		private void StartTagHandler(MarkupParsingContext context, HtmlTag tag)
		{
			HtmlNodeType previousNodeType = _currentNodeType;
			string previousTagName = string.Empty;
			if (_currentTag != null)
			{
				previousTagName = _currentTag.Name;
			}

			if (_settings.UseMetaCharsetTag && IsMetaContentTypeTag(tag.Name, tag.Attributes))
			{
				tag = UpgradeToMetaCharsetTag(tag);
			}

			_currentNodeType = HtmlNodeType.StartTag;
			_currentTag = tag;
			_currentText = string.Empty;

			string tagName = tag.Name;
			IList<HtmlAttribute> attributes = tag.Attributes;
			HtmlTagFlags tagFlags = tag.Flags;

			// Set whitespace flags for nested tags (for example <span> within a <pre>)
			WhitespaceMinificationMode whitespaceMinificationMode = _settings.WhitespaceMinificationMode;
			if (whitespaceMinificationMode != WhitespaceMinificationMode.None)
			{
				if (_tagsWithNotRemovableWhitespaceQueue.Count == 0)
				{
					// Processing of whitespace, that followed before the start tag
					bool allowTrimEnd = false;
					if (tagFlags.Invisible || tagFlags.NonIndependent)
					{
						allowTrimEnd = true;
					}
					else
					{
						if (whitespaceMinificationMode == WhitespaceMinificationMode.Medium
							|| whitespaceMinificationMode == WhitespaceMinificationMode.Aggressive)
						{
							allowTrimEnd = tagFlags.Block;
						}
					}

					if (allowTrimEnd)
					{
						TrimEndLastBufferItem();
					}
				}

				if (!CanMinifyWhitespace(tagName))
				{
					_tagsWithNotRemovableWhitespaceQueue.Enqueue(tagName);
				}
			}

			if (_settings.RemoveOptionalEndTags
				&& previousNodeType != HtmlNodeType.StartTag
				&& !IsSafeOptionalEndTag(previousTagName))
			{
				if (CanRemoveOptionalEndTagByNextTagName(previousTagName, tagName))
				{
					RemoveLastEndTagFromBuffer(previousTagName);
				}

				FlushBuffer();
			}

			_buffer.Add("<");
			_buffer.Add(tagName);

			int attributeCount = attributes.Count;

			for (int attributeIndex = 0; attributeIndex < attributeCount; attributeIndex++)
			{
				_buffer.Add(BuildAttributeString(context, tag, attributes[attributeIndex]));
			}

			if (tagFlags.Empty)
			{
				if (_settings.EmptyTagRenderMode == HtmlEmptyTagRenderMode.Slash)
				{
					_buffer.Add("/");
				}
				else if (_settings.EmptyTagRenderMode == HtmlEmptyTagRenderMode.SpaceAndSlash)
				{
					_buffer.Add(" /");
				}
			}
			_buffer.Add(">");
		}

		/// <summary>
		/// Start tags handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="tag">HTML tag</param>
		private void EndTagHandler(MarkupParsingContext context, HtmlTag tag)
		{
			HtmlNodeType previousNodeType = _currentNodeType;
			string previousTagName;
			IList<HtmlAttribute> previousTagAttributes;
			if (_currentTag != null)
			{
				previousTagName = _currentTag.Name;
				previousTagAttributes = _currentTag.Attributes;
			}
			else
			{
				previousTagName = string.Empty;
				previousTagAttributes = new List<HtmlAttribute>();
			}
			string previousText = _currentText;

			_currentNodeType = HtmlNodeType.EndTag;
			_currentTag = tag;
			_currentText = string.Empty;

			string tagName = tag.Name;
			HtmlTagFlags tagFlags = tag.Flags;

			WhitespaceMinificationMode whitespaceMinificationMode = _settings.WhitespaceMinificationMode;
			if (whitespaceMinificationMode != WhitespaceMinificationMode.None)
			{
				if (_tagsWithNotRemovableWhitespaceQueue.Count == 0 && !tagFlags.EmbeddedCode)
				{
					// Processing of whitespace, that followed before the end tag
					bool allowTrimEnd = false;
					if (tagFlags.Invisible)
					{
						allowTrimEnd = true;
					}
					else
					{
						if (whitespaceMinificationMode == WhitespaceMinificationMode.Medium)
						{
							allowTrimEnd = tagFlags.Block;
						}
						else if (whitespaceMinificationMode == WhitespaceMinificationMode.Aggressive)
						{
							allowTrimEnd = (tagFlags.Block || tagFlags.Inline || tagFlags.InlineBlock);
						}
					}

					if (allowTrimEnd)
					{
						TrimEndLastBufferItem();
					}
				}

				// Check if current tag is in a whitespace queue
				if (_tagsWithNotRemovableWhitespaceQueue.Count > 0 && tagName == _tagsWithNotRemovableWhitespaceQueue.Last())
				{
					_tagsWithNotRemovableWhitespaceQueue.Dequeue();
				}
			}

			if (_settings.RemoveOptionalEndTags
				&& (previousNodeType == HtmlNodeType.EndTag
					|| (previousTagName != tagName && string.IsNullOrWhiteSpace(previousText)))
				&& !IsSafeOptionalEndTag(previousTagName))
			{

				if (CanRemoveOptionalTagByParentTagName(previousTagName, tagName))
				{
					RemoveLastEndTagFromBuffer(previousTagName);
				}
			}

			bool isElementEmpty = (string.IsNullOrWhiteSpace(previousText) && previousTagName == tagName
				&& previousNodeType != HtmlNodeType.EndTag);
			if (_settings.RemoveTagsWithoutContent && isElementEmpty
				&& CanRemoveTagWithoutContent(previousTagName, previousTagAttributes))
			{
				// Remove last "element" from buffer, return
				if (RemoveLastStartTagFromBuffer(tagName))
				{
					FlushBuffer();
					return;
				}
			}

			if (_settings.RemoveOptionalEndTags && tagFlags.OptionalEndTag && IsSafeOptionalEndTag(tagName))
			{
				// Leave only start tag in buffer
				FlushBuffer();
				return;
			}

			// Add end tag to buffer
			_buffer.Add("</");
			_buffer.Add(tagName);
			_buffer.Add(">");
		}

		/// <summary>
		/// Text handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="text">Text</param>
		private void TextHandler(MarkupParsingContext context, string text)
		{
			HtmlNodeType nodeType = _currentNodeType;
			string tagName;
			HtmlTagFlags tagFlags;
			IList<HtmlAttribute> attributes;
			if (_currentTag != null)
			{
				tagName = _currentTag.Name;
				tagFlags = _currentTag.Flags;
				attributes = _currentTag.Attributes;
			}
			else
			{
				tagName = string.Empty;
				tagFlags = new HtmlTagFlags();
				attributes = new List<HtmlAttribute>();
			}

			WhitespaceMinificationMode whitespaceMinificationMode = _settings.WhitespaceMinificationMode;

			if (nodeType == HtmlNodeType.StartTag && tagFlags.EmbeddedCode)
			{
				switch (tagName)
				{
					case "script":
					case "style":
						string contentType = attributes
							.Where(a => a.Name == "type")
							.Select(a => a.Value)
							.FirstOrDefault()
							;

						if (tagName == "script")
						{
							if (string.IsNullOrWhiteSpace(contentType))
							{
								string language = attributes
									.Where(a => a.Name == "language")
									.Select(a => a.Value)
									.FirstOrDefault()
									;

								if (!string.IsNullOrWhiteSpace(language) 
									&& language.Trim().ToLowerInvariant() == "vbscript")
								{
									contentType = VBS_CONTENT_TYPE;
								}
							}

							text = ProcessEmbeddedScriptContent(context, text, contentType);
						}
						else if (tagName == "style")
						{
							text = ProcessEmbeddedStyleContent(context, text, contentType);
						}

						break;
					case "svg":
						text = ProcessEmbeddedSvgContent(context, text);
						break;
					case "math":
						text = ProcessEmbeddedMathMlContent(context, text);
						break;
				}
			}
			else
			{
				if (whitespaceMinificationMode != WhitespaceMinificationMode.None)
				{
					if (_tagsWithNotRemovableWhitespaceQueue.Count == 0)
					{
						if (context.Position == 0)
						{
							// Processing of starting whitespace
							text = text.TrimStart();
						}
						else if ((context.Position + text.Length) == context.Length)
						{
							// Processing of ending whitespace
							text = text.TrimEnd();
						}
						else if (nodeType == HtmlNodeType.StartTag)
						{
							// Processing of whitespace, that followed after the start tag
							bool allowTrimStart = false;
							if (tagFlags.Invisible || (tagFlags.NonIndependent && tagFlags.Empty))
							{
								allowTrimStart = true;
							}
							else
							{
								if (whitespaceMinificationMode == WhitespaceMinificationMode.Medium)
								{
									allowTrimStart = tagFlags.Block;
								}
								else if (whitespaceMinificationMode == WhitespaceMinificationMode.Aggressive)
								{
									allowTrimStart = (tagFlags.Block
										|| ((tagFlags.Inline || tagFlags.InlineBlock) && !tagFlags.Empty));
								}
							}

							if (allowTrimStart)
							{
								text = text.TrimStart();
							}
						}
						else if (nodeType == HtmlNodeType.EndTag)
						{
							// Processing of whitespace, that followed after the end tag
							bool allowTrimStart = false;
							if (tagFlags.Invisible || tagFlags.NonIndependent)
							{
								allowTrimStart = true;
							}
							else
							{
								if (whitespaceMinificationMode == WhitespaceMinificationMode.Medium
									|| whitespaceMinificationMode == WhitespaceMinificationMode.Aggressive)
								{
									allowTrimStart = tagFlags.Block;
								}
							}

							if (allowTrimStart)
							{
								text = text.TrimStart();
							}
						}
						else if (nodeType == HtmlNodeType.Doctype || nodeType == HtmlNodeType.XmlDeclaration)
						{
							// Processing of whitespace, that followed after the document type declaration
							// or XML declaration
							text = text.TrimStart();
						}

						if (text.Length > 0)
						{
							text = Utils.CollapseWhitespace(text);
						}
					}
					else if (nodeType == HtmlNodeType.StartTag && tagName == "textarea"
						&& string.IsNullOrWhiteSpace(text))
					{
						text = string.Empty;
					}
				}
			}

			_currentNodeType = HtmlNodeType.Text;
			_currentText = text;

			if (text.Length > 0)
			{
				_buffer.Add(text);
			}
		}

		/// <summary>
		/// Template tags handler
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="expression">Expression</param>
		/// <param name="startDelimiter">Start delimiter</param>
		/// <param name="endDelimiter">End delimiter</param>
		private void TemplateTagHandler(MarkupParsingContext context, string expression, string startDelimiter,
			string endDelimiter)
		{
			_currentNodeType = HtmlNodeType.TemplateTag;

			string processedExpression = expression;
			if (startDelimiter == "{{" && endDelimiter == "}}")
			{
				processedExpression = ProcessAngularBindingExpression(context, expression);
			}

			_buffer.Add(startDelimiter);
			_buffer.Add(processedExpression);
			_buffer.Add(endDelimiter);
		}
		#endregion

		#region Buffer helpers
		/// <summary>
		/// Flush a HTML minification buffer
		/// </summary>
		private void FlushBuffer()
		{
			int bufferItemCount = _buffer.Count;

			if (bufferItemCount > 0)
			{
				for (int bufferItemIndex = 0; bufferItemIndex < bufferItemCount; bufferItemIndex++)
				{
					string bufferItem = _buffer[bufferItemIndex];

					if (bufferItem.Length > 0)
					{
						_result.Append(bufferItem);
					}
				}

				_buffer.Clear();
			}
		}

		/// <summary>
		/// Removes all ending spaces in the last item of the HTML minification buffer
		/// </summary>
		private void TrimEndLastBufferItem()
		{
			int bufferItemCount = _buffer.Count;
			if (bufferItemCount > 0)
			{
				for (int bufferItemIndex = bufferItemCount - 1; bufferItemIndex >= 0; bufferItemIndex--)
				{
					string bufferItem = _buffer[bufferItemIndex];

					if (string.IsNullOrWhiteSpace(bufferItem))
					{
						_buffer.RemoveAt(bufferItemIndex);
					}
					else
					{
						_buffer[bufferItemIndex] = bufferItem.TrimEnd();
						break;
					}
				}
			}
		}

		/// <summary>
		/// Removes a last end tag from the HTML minification buffer
		/// </summary>
		/// <param name="endTagName">End tag name</param>
		private void RemoveLastEndTagFromBuffer(string endTagName)
		{
			int bufferItemCount = _buffer.Count;
			if (bufferItemCount == 0)
			{
				return;
			}

			int lastEndTagBeginAngleBracketIndex = _buffer.LastIndexOf("</");

			if (lastEndTagBeginAngleBracketIndex != -1)
			{
				string lastEndTagName = _buffer[lastEndTagBeginAngleBracketIndex + 1];
				if (lastEndTagName == endTagName)
				{
					int lastEndTagEndAngleBracketIndex = _buffer.IndexOf(">", lastEndTagBeginAngleBracketIndex);
					if (lastEndTagEndAngleBracketIndex != -1)
					{
						int lastBufferItemIndex = bufferItemCount - 1;
						bool noMoreContent = true;
						if (lastEndTagEndAngleBracketIndex != lastBufferItemIndex)
						{
							for (int bufferItemIndex = lastEndTagEndAngleBracketIndex + 1;
								bufferItemIndex < bufferItemCount;
								bufferItemIndex++)
							{
								if (!string.IsNullOrWhiteSpace(_buffer[bufferItemIndex]))
								{
									noMoreContent = false;
									break;
								}
							}
						}

						if (noMoreContent)
						{
							int endTagLength = lastEndTagEndAngleBracketIndex - lastEndTagBeginAngleBracketIndex + 1;
							_buffer.RemoveRange(lastEndTagBeginAngleBracketIndex, endTagLength);
						}
					}
				}
			}
		}

		/// <summary>
		/// Removes a last start tag name from the HTML minification buffer
		/// </summary>
		/// <param name="startTagName">Start tag name</param>
		/// <returns>Result of removing (true - has removed; false - has not removed)</returns>
		private bool RemoveLastStartTagFromBuffer(string startTagName)
		{
			int bufferItemCount = _buffer.Count;
			if (bufferItemCount == 0)
			{
				return false;
			}

			bool isEndTagRemoved = false;
			int lastStartTagBeginAngleBracketIndex = _buffer.LastIndexOf("<");

			if (lastStartTagBeginAngleBracketIndex != -1)
			{
				string lastTagName = _buffer[lastStartTagBeginAngleBracketIndex + 1];
				if (lastTagName == startTagName)
				{
					int lastStartTagEndAngleBracketIndex = _buffer.IndexOf(">", lastStartTagBeginAngleBracketIndex);
					if (lastStartTagEndAngleBracketIndex != -1)
					{
						int lastBufferItemIndex = bufferItemCount - 1;
						bool noMoreContent = true;
						if (lastStartTagEndAngleBracketIndex != lastBufferItemIndex)
						{
							for (int bufferItemIndex = lastStartTagEndAngleBracketIndex + 1;
								 bufferItemIndex < bufferItemCount;
								 bufferItemIndex++)
							{
								if (!string.IsNullOrWhiteSpace(_buffer[bufferItemIndex]))
								{
									noMoreContent = false;
									break;
								}
							}
						}

						if (noMoreContent)
						{
							_buffer.RemoveRange(lastStartTagBeginAngleBracketIndex,
								bufferItemCount - lastStartTagBeginAngleBracketIndex);

							isEndTagRemoved = true;
						}
					}
				}
			}

			return isEndTagRemoved;
		}
		#endregion

		/// <summary>
		/// Builds a string representation of the attribute
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attribute">HTML attribute</param>
		/// <param name="tag">HTML tag</param>
		/// <returns>String representation of the attribute</returns>
		private string BuildAttributeString(MarkupParsingContext context, HtmlTag tag, HtmlAttribute attribute)
		{
			string tagName = tag.Name;
			HtmlTagFlags tagFlags = tag.Flags;
			IList<HtmlAttribute> attributes = tag.Attributes;

			string attributeString;
			string attributeName = attribute.Name;
			string attributeValue = attribute.Value;
			bool attributeHasValue = attribute.HasValue;
			HtmlAttributeType attributeType = attribute.Type;
			bool useHtmlSyntax = !_settings.UseXhtmlSyntax;

			if (useHtmlSyntax && IsXmlAttribute(attributeName))
			{
				string sourceCode = context.SourceCode;
				SourceCodeNodeCoordinates attributeCoordinates = attribute.NameCoordinates;

				WriteWarning(ErrorCategoryCode.HtmlMinificationWarning,
					string.Format(Strings.WarningMessage_XmlBasedAttributeNotAllowed, attributeName), _fileContext,
					attributeCoordinates.LineNumber, attributeCoordinates.ColumnNumber,
					SourceCodeNavigator.GetSourceFragment(sourceCode, attributeCoordinates));
			}

			if ((_settings.RemoveRedundantAttributes && IsAttributeRedundant(tagName, attributeName, attributeValue, attributes))
				|| (_settings.RemoveJsTypeAttributes && IsJavaScriptTypeAttribute(tagName, attributeName, attributeValue))
				|| (_settings.RemoveCssTypeAttributes && IsCssTypeAttribute(tagName, attributeName, attributeValue, attributes))
				|| (useHtmlSyntax && CanRemoveXmlAttribute(tagName, attributeName)))
			{
				attributeString = string.Empty;
				return attributeString;
			}

			bool isCustomBooleanAttribute = (!attributeHasValue && attributeType == HtmlAttributeType.Text);
			if (isCustomBooleanAttribute && useHtmlSyntax)
			{
				attributeString = " " + attributeName;
				return attributeString;
			}

			if (attributeType == HtmlAttributeType.Boolean)
			{
				if (_settings.CollapseBooleanAttributes)
				{
					attributeString = " " + attributeName;
					return attributeString;
				}

				attributeValue = attributeName;
			}
			else if (isCustomBooleanAttribute)
			{
				attributeValue = string.Empty;
			}
			else
			{
				attributeValue = CleanAttributeValue(context, tag, attribute);

				if (_settings.RemoveEmptyAttributes
					&& CanRemoveEmptyAttribute(tagName, attributeName, attributeValue, attributeType))
				{
					attributeString = string.Empty;
					return attributeString;
				}
			}

			bool addQuotes = !CanRemoveAttributeQuotes(tagFlags, attributeValue, _settings.AttributeQuotesRemovalMode);
			attributeString = InnerBuildAttributeString(attributeName, attributeValue, addQuotes);

			return attributeString;
		}

		private static string InnerBuildAttributeString(string attributeName, string attributeValue, bool addQuotes)
		{
			string attributeString;
			string encodedAttributeValue = HtmlAttribute.HtmlAttributeEncode(attributeValue, HtmlAttributeQuotesType.Double);

			if (addQuotes)
			{
				attributeString = string.Concat(" ", attributeName, "=", "\"", encodedAttributeValue, "\"");
			}
			else
			{
				attributeString = string.Concat(" ", attributeName, "=", encodedAttributeValue);
			}

			return attributeString;
		}

		/// <summary>
		/// Determines whether the list of attributes contains the specified attribute
		/// </summary>
		/// <param name="attributes">List of attributes</param>
		/// <param name="attributeName">Attribute name</param>
		/// <returns>Result of check (true - contains; false - not contains)</returns>
		private static bool ContainsAttribute(IEnumerable<HtmlAttribute> attributes, string attributeName)
		{
			bool result = (attributes.Count(a => a.Name == attributeName) > 0);

			return result;
		}

		/// <summary>
		/// Determines whether a list of attributes contains the <code>rel</code> attribute with
		/// value, that equals to "external" or "alternate external"
		/// </summary>
		/// <param name="attributes">List of attributes</param>
		/// <returns>Result of check (true - contains; false - does not contain)</returns>
		private static bool ContainsRelExternalAttribute(IEnumerable<HtmlAttribute> attributes)
		{
			bool containsRelExternalAttribute = attributes.Count(a => a.Name == "rel"
				 && _relExternalAttributeRegex.IsMatch(a.Value)) > 0;

			return containsRelExternalAttribute;
		}

		/// <summary>
		/// Checks whether it is possible to remove the attribute quotes
		/// </summary>
		/// <param name="tagFlags">HTML tag flags</param>
		/// <param name="attributeValue">Attribute value</param>
		/// <param name="attributeQuotesRemovalMode">Removal mode of HTML attribute quotes</param>
		/// <returns>Result of check (true - can remove; false - cannot remove)</returns>
		private static bool CanRemoveAttributeQuotes(HtmlTagFlags tagFlags, string attributeValue,
			HtmlAttributeQuotesRemovalMode attributeQuotesRemovalMode)
		{
			bool result = false;

			if (!tagFlags.Xml && attributeQuotesRemovalMode != HtmlAttributeQuotesRemovalMode.KeepQuotes)
			{
				if (!attributeValue.EndsWith("/"))
				{
					if (attributeQuotesRemovalMode == HtmlAttributeQuotesRemovalMode.Html4)
					{
						result = _html4AttributeValueNotRequireQuotesRegex.IsMatch(attributeValue);
					}
					else if (attributeQuotesRemovalMode == HtmlAttributeQuotesRemovalMode.Html5)
					{
						result = _html5AttributeValueNotRequireQuotesRegex.IsMatch(attributeValue);
					}
				}
			}

			return result;
		}

		/// <summary>
		/// Checks whether the attribute is redundant
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributeName">Attribute name</param>
		/// <param name="attributeValue">Attribute value</param>
		/// <param name="attributes">List of attributes</param>
		/// <returns>Result of check (true - is redundant; false - is not redundant)</returns>
		private static bool IsAttributeRedundant(string tagName, string attributeName,
			string attributeValue, IList<HtmlAttribute> attributes)
		{
			string processedAttributeValue = attributeValue.Trim();

			return (
				(tagName == "script" 
					&& ((attributeName == "language" && processedAttributeValue.IgnoreCaseEquals("javascript"))
					|| (attributeName == "charset" && !ContainsAttribute(attributes, "src"))))
				|| (tagName == "link" && attributeName == "charset" && attributes.Count(
					a => a.Name == "rel" && a.Value.Trim().IgnoreCaseEquals("stylesheet")) > 0)
				|| (tagName == "form" && attributeName == "method" && processedAttributeValue.IgnoreCaseEquals("get"))
				|| (tagName == "input" && attributeName == "type" && processedAttributeValue.IgnoreCaseEquals("text"))
				|| (tagName == "a" && attributeName == "name" && attributes.Count(
					a => a.Name == "id" && a.Value == attributeValue) > 0)
				|| (tagName == "area" && attributeName == "shape" && processedAttributeValue.IgnoreCaseEquals("rect"))
			);
		}

		/// <summary>
		/// Checks whether attribute is the attribute <svgContent>type</svgContent> of
		/// tag <svgContent>script</svgContent>, that containing JavaScript svgContent
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributeName">Attribute name</param>
		/// <param name="attributeValue">Attribute value</param>
		/// <returns>Result of check</returns>
		private static bool IsJavaScriptTypeAttribute(string tagName, string attributeName, string attributeValue)
		{
			return (tagName == "script" && attributeName == "type" && attributeValue.Trim().IgnoreCaseEquals(JS_CONTENT_TYPE));
		}

		/// <summary>
		/// Checks whether attribute is the attribute <svgContent>type</svgContent> of tag <svgContent>link</svgContent>
		/// or <svgContent>style</svgContent>, that containing CSS svgContent
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributeName">Attribute name</param>
		/// <param name="attributeValue">Attribute value</param>
		/// <param name="attributes">List of attributes</param>
		/// <returns>Result of check</returns>
		private static bool IsCssTypeAttribute(string tagName, string attributeName, string attributeValue,
			IEnumerable<HtmlAttribute> attributes)
		{
			bool isCssTypeAttribute = false;

			if (tagName == "link" || tagName == "style")
			{
				string processedAttributeValue = attributeValue.Trim();

				if (attributeName == "type" && processedAttributeValue.IgnoreCaseEquals(CSS_CONTENT_TYPE))
				{
					if (tagName == "link")
					{
						isCssTypeAttribute = (attributes.Count(a => a.Name == "rel"
							&& a.Value.Trim().IgnoreCaseEquals("stylesheet")) > 0);
					}
					else if (tagName == "style")
					{
						isCssTypeAttribute = true;
					}
				}
			}

			return isCssTypeAttribute;
		}

		/// <summary>
		/// Checks whether the attribute is XML-based
		/// </summary>
		/// <param name="attributeName">Attribute name</param>
		/// <returns>Result of check (true - XML-based; false - not XML-based)</returns>
		private static bool IsXmlAttribute(string attributeName)
		{
			bool isXmlAttribute = (attributeName.StartsWith("xml:", StringComparison.Ordinal)
				|| attributeName.StartsWith("xmlns:", StringComparison.Ordinal));

			return isXmlAttribute;
		}

		/// <summary>
		/// Cleans a attribute value
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="tag">HTML tag</param>
		/// <param name="attribute">HTML attribute</param>
		/// <returns>Processed attribute value</returns>
		private string CleanAttributeValue(MarkupParsingContext context, HtmlTag tag, HtmlAttribute attribute)
		{
			string attributeValue = attribute.Value;
			if (attributeValue.Length == 0)
			{
				return attributeValue;
			}

			string result = attributeValue;
			string tagName = tag.Name;
			IList<HtmlAttribute> attributes = tag.Attributes;
			string attributeName = attribute.Name;
			HtmlAttributeType attributeType = attribute.Type;

			if (attributeType != HtmlAttributeType.Event && MustacheStyleTagHelpers.ContainsMustacheStyleTag(result))
			{
				// Processing of Angular Mustache-style tags
				var attributeValueBuilder = new StringBuilder();

				MustacheStyleTagHelpers.ParseMarkup(result,
					(localContext, expression, startDelimiter, endDelimiter) =>
					{
						string processedExpression = expression;
						if (startDelimiter == "{{" && endDelimiter == "}}")
						{
							processedExpression = ProcessAngularBindingExpression(context, attribute.ValueCoordinates,
								localContext.NodeCoordinates, expression);
						}

						attributeValueBuilder.Append(startDelimiter);
						attributeValueBuilder.Append(processedExpression);
						attributeValueBuilder.Append(endDelimiter);
					},
					(localContext, textValue) =>
					{
						string processedTextValue = textValue;
						if (attributeType == HtmlAttributeType.ClassName)
						{
							processedTextValue = Utils.CollapseWhitespace(textValue);
						}

						attributeValueBuilder.Append(processedTextValue);
					}
				);

				result = attributeValueBuilder.ToString();
				attributeValueBuilder.Clear();

				switch (attributeType)
				{
					case HtmlAttributeType.Uri:
					case HtmlAttributeType.Numeric:
					case HtmlAttributeType.ClassName:
						result = result.Trim();
						break;
					case HtmlAttributeType.Style:
						result = result.Trim();
						result = Utils.RemoveEndingSemicolon(result);
						break;
					default:
						string elementDirectiveName = AngularHelpers.NormalizeDirectiveName(tagName);
						if (elementDirectiveName == "ngPluralize" && attributeName == "when")
						{
							result = ProcessAngularBindingExpression(context, attribute.ValueCoordinates, result);
						}

						break;
				}
			}
			else
			{
				switch (attributeType)
				{
					case HtmlAttributeType.Uri:
						result = result.Trim();

						if (result.StartsWith(HTTP_PROTOCOL, StringComparison.OrdinalIgnoreCase))
						{
							if (_settings.RemoveHttpProtocolFromAttributes && !ContainsRelExternalAttribute(attributes))
							{
								int httpProtocolLength = HTTP_PROTOCOL.Length;
								result = result.Substring(httpProtocolLength);
							}
						}
						else if (result.StartsWith(HTTPS_PROTOCOL, StringComparison.OrdinalIgnoreCase))
						{
							if (_settings.RemoveHttpsProtocolFromAttributes && !ContainsRelExternalAttribute(attributes))
							{
								int httpsProtocolLength = HTTPS_PROTOCOL.Length;
								result = result.Substring(httpsProtocolLength);
							}
						}
						else if (result == "href" && result.StartsWith(JS_PROTOCOL, StringComparison.OrdinalIgnoreCase))
						{
							result = ProcessInlineScriptContent(context, attribute);
						}

						break;
					case HtmlAttributeType.Numeric:
						result = result.Trim();
						break;
					case HtmlAttributeType.ClassName:
						if (AngularHelpers.IsClassDirective(result))
						{
							// Processing of Angular class directives
							string ngOriginalDirectiveName = string.Empty;
							string ngNormalizedDirectiveName = string.Empty;
							string ngExpression;
							var ngDirectives = new Dictionary<string, string>();

							AngularHelpers.ParseClassDirective(result,
								(localContext, originalDirectiveName, normalizedDirectiveName) =>
								{
									ngOriginalDirectiveName = originalDirectiveName;
									ngNormalizedDirectiveName = normalizedDirectiveName;
									ngExpression = null;

									ngDirectives.Add(ngOriginalDirectiveName, ngExpression);
								},
								(localContext, expression) =>
								{
									ngExpression = ProcessAngularBindingExpression(context,
										attribute.ValueCoordinates, localContext.NodeCoordinates,
										ngNormalizedDirectiveName, expression);

									ngDirectives[ngOriginalDirectiveName] = ngExpression;
								},
								localContext =>
								{
									if (ngDirectives[ngOriginalDirectiveName] == null)
									{
										ngDirectives[ngOriginalDirectiveName] = string.Empty;
									}
								}
							);

							int directiveCount = ngDirectives.Count;
							if (directiveCount > 0)
							{
								var directiveBuilder = new StringBuilder();
								int directiveIndex = 0;
								int lastDirectiveIndex = directiveCount - 1;
								string previousExpression = null;

								foreach (var directive in ngDirectives)
								{
									string directiveName = directive.Key;
									string expression = directive.Value;

									if (directiveIndex > 0 && (expression == null || previousExpression == null))
									{
										directiveBuilder.Append(" ");
									}

									directiveBuilder.Append(directiveName);
									if (!string.IsNullOrWhiteSpace(expression))
									{
										directiveBuilder.AppendFormat(":{0}", expression);
									}

									if (directiveIndex < lastDirectiveIndex && expression != null)
									{
										directiveBuilder.Append(";");
									}

									previousExpression = expression;
									directiveIndex++;
								}

								result = directiveBuilder.ToString();
								directiveBuilder.Clear();
							}
							else
							{
								result = string.Empty;
							}
						}
						else
						{
							result = result.Trim();
							result = Utils.CollapseWhitespace(result);
						}

						break;
					case HtmlAttributeType.Style:
						result = ProcessInlineStyleContent(context, attribute);
						break;
					case HtmlAttributeType.Event:
						result = ProcessInlineScriptContent(context, attribute);
						break;
					default:
						if (attributeName == "data-bind")
						{
							result = ProcessKnockoutBindingExpression(context, attribute);
						}
						else if (tagName == "meta" && attributeName == "content"
						         && attributes.Count(a => a.Name == "name" && a.Value.Trim().IgnoreCaseEquals("keywords")) > 0)
						{
							result = result.Trim();
							result = Utils.CollapseWhitespace(result);
							result = _separatingCommaWithSpacesRegex.Replace(result, ",");
							result = _endingCommaWithSpacesRegex.Replace(result, string.Empty);
						}
						else
						{
							string elementDirectiveName = AngularHelpers.NormalizeDirectiveName(tagName);
							if (elementDirectiveName == "ngPluralize"
							    && (attributeName == "count" || attributeName == "when"))
							{
								result = ProcessAngularBindingExpression(context, attribute.ValueCoordinates, result);
							}
							else
							{
								string attributeDirectiveName = AngularHelpers.NormalizeDirectiveName(attributeName);
								if (!string.IsNullOrEmpty(attributeDirectiveName))
								{
									result = ProcessAngularBindingExpression(context, attribute.ValueCoordinates,
										attributeDirectiveName, result);
								}
							}
						}

						break;
				}
			}

			return result;
		}

		/// <summary>
		/// Checks whether remove an the attribute, that has empty value
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributeName">Attribute name</param>
		/// <param name="attributeValue">Attribute value</param>
		/// <param name="attributeType">Attribute type</param>
		/// <returns>Result of check (true - can be removed; false - can not be removed)</returns>
		private static bool CanRemoveEmptyAttribute(string tagName, string attributeName, string attributeValue,
			HtmlAttributeType attributeType)
		{
			bool result = false;
			bool isZeroLengthString = (attributeValue.Length == 0);

			if (isZeroLengthString || string.IsNullOrWhiteSpace(attributeValue))
			{
				if (tagName == "input" && attributeName == "value")
				{
					result = isZeroLengthString;
				}
				else if (attributeType == HtmlAttributeType.Event
					|| (tagName == "form" && attributeName == "action")
					|| _emptyAttributesForRemoval.Contains(attributeName))
				{
					result = true;
				}
			}

			return result;
		}

		/// <summary>
		/// Checks whether remove an the XML-based attribute
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributeName">Attribute name</param>
		/// <returns>Result of check (true - can be removed; false - can not be removed)</returns>
		private static bool CanRemoveXmlAttribute(string tagName, string attributeName)
		{
			return (attributeName == "xmlns" && (tagName == "html" || tagName == "svg" || tagName == "math"));
		}

		/// <summary>
		/// Checks whether the tag is a META content-type tag
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributes">List of attributes</param>
		/// <returns>Result of check (true - is META content-type tag; false - is not META content-type tag)</returns>
		private static bool IsMetaContentTypeTag(string tagName, IEnumerable<HtmlAttribute> attributes)
		{
			return (tagName == "meta" && attributes.Count(
				a => a.Name == "http-equiv" && a.Value.Trim().IgnoreCaseEquals("content-type")) > 0);
		}

		/// <summary>
		/// Upgrades a META content-type tag to the META charset tag
		/// </summary>
		/// <param name="tag">META content-type tag</param>
		/// <returns>META charset tag</returns>
		private HtmlTag UpgradeToMetaCharsetTag(HtmlTag tag)
		{
			HtmlTag upgradedTag = tag;

			HtmlAttribute contentAttribute = tag.Attributes.SingleOrDefault(a => a.Name == "content");
			if (contentAttribute != null)
			{
				string content = contentAttribute.Value.Trim();
				if (content.Length > 0)
				{
					Match contentMatch = _metaContentTypeTagValueRegex.Match(content);
					if (contentMatch.Success)
					{
						string charset = contentMatch.Groups["charset"].Value;
						upgradedTag = new HtmlTag(tag.Name,
							new List<HtmlAttribute> {new HtmlAttribute("charset", charset, HtmlAttributeType.Text)},
							tag.Flags);
					}
				}
			}

			return upgradedTag;
		}

		/// <summary>
		/// Checks whether the optional end tag is safe
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <returns>Result of check (true - is safe; false - is unsafe)</returns>
		private static bool IsSafeOptionalEndTag(string tagName)
		{
			return _safeOptionalEndTags.Contains(tagName);
		}

		/// <summary>
		/// Checks whether remove an the optional end tag
		/// </summary>
		/// <param name="optionalEndTagName">Optional end tag name</param>
		/// <param name="nextTagName">Next tag name</param>
		/// <returns>Result of check (true - can be removed; false - can not be removed)</returns>
		private static bool CanRemoveOptionalEndTagByNextTagName(string optionalEndTagName, string nextTagName)
		{
			bool canRemove;

			switch (optionalEndTagName)
			{
				case "p":
					canRemove = _tagsFollowingAfterParagraphOptionalEndTag.Contains(nextTagName);
					break;
				case "li":
					canRemove = (nextTagName == "li");
					break;
				case "thead":
				case "tbody":
					canRemove = (nextTagName == "tbody" || nextTagName == "tfoot");
					break;
				case "tfoot":
					canRemove = (nextTagName == "tbody");
					break;
				case "tr":
					canRemove = (nextTagName == "tr");
					break;
				case "td":
				case "th":
					canRemove = (nextTagName == "td" || nextTagName == "th");
					break;
				case "option":
					canRemove = (nextTagName == "option" || nextTagName == "optgroup");
					break;
				case "optgroup":
					canRemove = (nextTagName == "optgroup");
					break;
				case "dt":
				case "dd":
					canRemove = (nextTagName == "dt" || nextTagName == "dd");
					break;
				case "rt":
				case "rp":
					canRemove = (nextTagName == "rt" || nextTagName == "rp");
					break;
				default:
					canRemove = false;
					break;
			}

			return canRemove;
		}

		/// <summary>
		/// Checks whether remove an the optional end tag
		/// </summary>
		/// <param name="optionalEndTagName">Optional end tag name</param>
		/// <param name="parentTagName">Parent tag name</param>
		/// <returns>Result of check (true - can be removed; false - can not be removed)</returns>
		private static bool CanRemoveOptionalTagByParentTagName(string optionalEndTagName, string parentTagName)
		{
			bool canRemove;

			switch (optionalEndTagName)
			{
				case "p":
					canRemove = (parentTagName != "a");
					break;
				case "li":
					canRemove = (parentTagName == "ul" || parentTagName == "ol" || parentTagName == "menu");
					break;
				case "tbody":
				case "tfoot":
					canRemove = (parentTagName == "table");
					break;
				case "tr":
					canRemove = (parentTagName == "table" || parentTagName == "thead"
						|| parentTagName == "tbody" || parentTagName == "tfoot");
					break;
				case "td":
				case "th":
					canRemove = (parentTagName == "tr");
					break;
				case "option":
					canRemove = (parentTagName == "select" || parentTagName == "optgroup"
						|| parentTagName == "datalist");
					break;
				case "optgroup":
					canRemove = (parentTagName == "select");
					break;
				case "dt":
				case "dd":
					canRemove = (parentTagName == "dl");
					break;
				case "rt":
				case "rp":
					canRemove = (parentTagName == "ruby");
					break;
				default:
					canRemove = false;
					break;
			}

			return canRemove;
		}

		/// <summary>
		/// Checks whether remove an the tag, that has empty content
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <param name="attributes">List of attributes</param>
		/// <returns>Result of check (true - can be removed; false - can not be removed)</returns>
		private static bool CanRemoveTagWithoutContent(string tagName, IEnumerable<HtmlAttribute> attributes)
		{
			return !(_unremovableEmptyTags.Contains(tagName)
				|| attributes.Count(a => a.Name.StartsWith("data-") || a.Name.StartsWith("ng-")
					|| (_unremovableEmptyTagAttributes.Contains(a.Name) && !string.IsNullOrWhiteSpace(a.Value))) > 0);
		}

		/// <summary>
		/// Checks whether to minify whitespaces in text content of tag
		/// </summary>
		/// <param name="tagName">Tag name</param>
		/// <returns>Result of check (true - can minify whitespaces; false - can not minify whitespaces)</returns>
		private static bool CanMinifyWhitespace(string tagName)
		{
			return !_tagsWithNotRemovableWhitespace.Contains(tagName);
		}

		/// <summary>
		/// Processes a embedded script content
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="content">Embedded script content</param>
		/// <param name="contentType">Content type (MIME type) of the script</param>
		/// <returns>Processed embedded script content</returns>
		private string ProcessEmbeddedScriptContent(MarkupParsingContext context, string content, string contentType)
		{
			string processedScriptContent = content;
			string processedContentType = (!string.IsNullOrWhiteSpace(contentType)) ?
				contentType.Trim().ToLowerInvariant() : JS_CONTENT_TYPE;
			bool isJavaScript = _jsContentTypes.Contains(processedContentType);
			bool isVbScript = (processedContentType == VBS_CONTENT_TYPE);

			bool minifyWhitespace = (_settings.WhitespaceMinificationMode != WhitespaceMinificationMode.None);

			if (isJavaScript || isVbScript)
			{
				bool removeHtmlComments = _settings.RemoveHtmlCommentsFromScriptsAndStyles;
				bool removeCdataSections = _settings.RemoveCdataSectionsFromScriptsAndStyles;

				string startPart = string.Empty;
				string endPart = string.Empty;
				string newLine = Environment.NewLine;
				string code = content;
				string beforeCodeContent = string.Empty;

				if (isJavaScript)
				{
					// Processing of JavaScript code
					if (_scriptBeginCdataSectionRegex.IsMatch(content))
					{
						beforeCodeContent = _scriptBeginCdataSectionRegex.Match(content).Value;

						if (!removeCdataSections)
						{
							startPart = "//<![CDATA[";
							endPart = "//]]>";
						}

						code = _scriptBeginCdataSectionRegex.Replace(content, string.Empty);
						code = _scriptEndCdataSectionRegex.Replace(code, string.Empty);
					}
					else if (_scriptBeginMaxCompatibleCdataSectionRegex.IsMatch(content))
					{
						beforeCodeContent = _scriptBeginMaxCompatibleCdataSectionRegex.Match(content).Value;

						if (!removeCdataSections)
						{
							startPart = "<!--//--><![CDATA[//><!--";
							endPart = "//--><!]]>";
						}

						code = _scriptBeginMaxCompatibleCdataSectionRegex.Replace(content, string.Empty);
						code = _scriptEndMaxCompatibleCdataSectionRegex.Replace(code, string.Empty);
					}
					else if (_scriptBeginHtmlCommentRegex.IsMatch(content))
					{
						beforeCodeContent = _scriptBeginHtmlCommentRegex.Match(content).Value;

						if (!removeHtmlComments)
						{
							startPart = "<!--";
							endPart = "//-->";
						}

						code = _scriptBeginHtmlCommentRegex.Replace(content, string.Empty);
						code = _scriptEndHtmlCommentRegex.Replace(code, string.Empty);
					}

					if (_settings.MinifyEmbeddedJsCode)
					{
						CodeMinificationResult minificationResult = _jsMinifier.Minify(code, false);
						if (minificationResult.Errors.Count == 0)
						{
							code = minificationResult.MinifiedContent ?? string.Empty;
						}

						if (minificationResult.Errors.Count > 0 || minificationResult.Warnings.Count > 0)
						{
							string sourceCode = context.SourceCode;
							var documentCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
								context.NodeCoordinates, beforeCodeContent);

							foreach (MinificationErrorInfo error in minificationResult.Errors)
							{
								var relativeErrorCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
								var absoluteErrorCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
									documentCoordinates, relativeErrorCoordinates);
								string sourceFragment = SourceCodeNavigator.GetSourceFragment(
									sourceCode, absoluteErrorCoordinates);
								string message = error.Message.Trim();

								WriteError(ErrorCategoryCode.JsMinificationError, message, _fileContext,
									absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
							}

							foreach (MinificationErrorInfo warning in minificationResult.Warnings)
							{
								var relativeErrorCoordinates = new SourceCodeNodeCoordinates(warning.LineNumber, warning.ColumnNumber);
								var absoluteErrorCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
									documentCoordinates, relativeErrorCoordinates);
								string sourceFragment = SourceCodeNavigator.GetSourceFragment(
									sourceCode, absoluteErrorCoordinates);
								string message = warning.Message.Trim();

								WriteWarning(ErrorCategoryCode.JsMinificationWarning, message, _fileContext,
									absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
							}
						}
					}
				}
				else
				{
					// Processing of VBScript code
					if (_scriptBeginCdataSectionRegex.IsMatch(content))
					{
						if (!removeCdataSections)
						{
							startPart = "<![CDATA[";
							endPart = "]]>";
						}

						code = _scriptBeginCdataSectionRegex.Replace(content, string.Empty);
						code = _scriptEndCdataSectionRegex.Replace(code, string.Empty);
					}
					else if (_scriptBeginHtmlCommentRegex.IsMatch(content))
					{
						if (!removeHtmlComments)
						{
							startPart = "<!--";
							endPart = "-->";
						}

						code = _scriptBeginHtmlCommentRegex.Replace(content, string.Empty);
						code = _scriptEndHtmlCommentRegex.Replace(code, string.Empty);
					}
				}

				if (minifyWhitespace && code.Length > 0)
				{
					code = code.Trim();
				}

				if (startPart.Length > 0 || endPart.Length > 0)
				{
					processedScriptContent = string.Concat(startPart, newLine, code, newLine, endPart);
				}
				else
				{
					processedScriptContent = code;
				}
			}
			else if (_processableScriptTypes.Contains(processedContentType))
			{
				// Processing of JavaScript template
				GenericHtmlMinifier innerHtmlMinifier = GetInnerHtmlMinifierInstance();
				MarkupMinificationResult minificationResult = innerHtmlMinifier.Minify(processedScriptContent, false);

				if (minificationResult.Errors.Count == 0)
				{
					processedScriptContent = minificationResult.MinifiedContent ?? string.Empty;
				}

				if (minificationResult.Errors.Count > 0 || minificationResult.Warnings.Count > 0)
				{
					string sourceCode = context.SourceCode;
					var documentCoordinates = context.NodeCoordinates;

					foreach (MinificationErrorInfo error in minificationResult.Errors)
					{
						var relativeErrorCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
						var absoluteErrorCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
							documentCoordinates, relativeErrorCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteErrorCoordinates);
						string message = error.Message.Trim();

						WriteError(ErrorCategoryCode.JsTemplateMinificationError, message, _fileContext,
							absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
					}

					foreach (MinificationErrorInfo warning in minificationResult.Warnings)
					{
						var relativeErrorCoordinates = new SourceCodeNodeCoordinates(warning.LineNumber, warning.ColumnNumber);
						var absoluteErrorCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
							documentCoordinates, relativeErrorCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteErrorCoordinates);
						string message = warning.Message.Trim();

						WriteWarning(ErrorCategoryCode.JsTemplateMinificationWarning, message, _fileContext,
							absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
					}
				}

				if (minifyWhitespace && processedScriptContent.Length > 0)
				{
					processedScriptContent = processedScriptContent.Trim();
				}
			}

			return processedScriptContent;
		}

		/// <summary>
		/// Processes a embedded style content
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="content">Embedded style content</param>
		/// <param name="contentType">Content type (MIME type) of the style</param>
		/// <returns>Processed embedded style content</returns>
		private string ProcessEmbeddedStyleContent(MarkupParsingContext context, string content, string contentType)
		{
			string processedContentType = (!string.IsNullOrWhiteSpace(contentType)) ?
				contentType.Trim().ToLowerInvariant() : CSS_CONTENT_TYPE;
			bool minifyWhitespace = (_settings.WhitespaceMinificationMode != WhitespaceMinificationMode.None);
			bool removeHtmlComments = _settings.RemoveHtmlCommentsFromScriptsAndStyles;
			bool removeCdataSections = _settings.RemoveCdataSectionsFromScriptsAndStyles;

			string startPart = string.Empty;
			string endPart = string.Empty;
			string code;
			string beforeCodeContent = string.Empty;

			if (_styleBeginCdataSectionRegex.IsMatch(content))
			{
				beforeCodeContent = _styleBeginCdataSectionRegex.Match(content).Value;

				if (!removeCdataSections)
				{
					startPart = "/*<![CDATA[*/";
					endPart = "/*]]>*/";
				}

				code = _styleBeginCdataSectionRegex.Replace(content, string.Empty);
				code = _styleEndCdataSectionRegex.Replace(code, string.Empty);
			}
			else if (_styleBeginMaxCompatibleCdataSectionRegex.IsMatch(content))
			{
				beforeCodeContent = _styleBeginMaxCompatibleCdataSectionRegex.Match(content).Value;

				if (!removeCdataSections)
				{
					startPart = "<!--/*--><![CDATA[/*><!--*/";
					endPart = "/*]]>*/-->";
				}

				code = _styleBeginMaxCompatibleCdataSectionRegex.Replace(content, string.Empty);
				code = _styleEndMaxCompatibleCdataSectionRegex.Replace(code, string.Empty);
			}
			else if (_styleBeginHtmlCommentRegex.IsMatch(content))
			{
				beforeCodeContent = _styleBeginHtmlCommentRegex.Match(content).Value;

				if (!removeHtmlComments)
				{
					startPart = "<!--";
					endPart = "-->";
				}

				code = _styleBeginHtmlCommentRegex.Replace(content, string.Empty);
				code = _styleEndHtmlCommentRegex.Replace(code, string.Empty);
			}
			else
			{
				code = content;
			}

			if (processedContentType == CSS_CONTENT_TYPE && _settings.MinifyEmbeddedCssCode)
			{
				CodeMinificationResult minificationResult = _cssMinifier.Minify(code, false);
				if (minificationResult.Errors.Count == 0)
				{
					code = minificationResult.MinifiedContent ?? string.Empty;
				}

				if (minificationResult.Errors.Count > 0 || minificationResult.Warnings.Count > 0)
				{
					string sourceCode = context.SourceCode;
					var documentNodeCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
						context.NodeCoordinates, beforeCodeContent);

					foreach (MinificationErrorInfo error in minificationResult.Errors)
					{
						var embeddedContentNodeCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
						var absoluteNodeCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
							documentNodeCoordinates, embeddedContentNodeCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteNodeCoordinates);
						string message = error.Message.Trim();

						WriteError(ErrorCategoryCode.CssMinificationError, message, _fileContext,
							absoluteNodeCoordinates.LineNumber, absoluteNodeCoordinates.ColumnNumber, sourceFragment);
					}

					foreach (MinificationErrorInfo warning in minificationResult.Warnings)
					{
						var embeddedContentNodeCoordinates = new SourceCodeNodeCoordinates(warning.LineNumber, warning.ColumnNumber);
						var absoluteNodeCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
							documentNodeCoordinates, embeddedContentNodeCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteNodeCoordinates);
						string message = warning.Message.Trim();

						WriteWarning(ErrorCategoryCode.CssMinificationWarning, message, _fileContext,
							absoluteNodeCoordinates.LineNumber, absoluteNodeCoordinates.ColumnNumber, sourceFragment);
					}
				}
			}

			if (minifyWhitespace && code.Length > 0)
			{
				code = code.Trim();
			}

			string processedStyleContent;
			if (startPart.Length > 0 || endPart.Length > 0)
			{
				processedStyleContent = string.Concat(startPart, code, endPart);
			}
			else
			{
				processedStyleContent = code;
			}

			return processedStyleContent;
		}

		/// <summary>
		/// Processes a inline script content
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attribute">Attribute</param>
		/// <returns>Processed inline script content</returns>
		private string ProcessInlineScriptContent(MarkupParsingContext context, HtmlAttribute attribute)
		{
			string scriptContent = attribute.Value;
			bool forHrefAttribute = (attribute.Name == "href");

			string result = scriptContent;

			if (_settings.MinifyInlineJsCode && _jsMinifier.IsInlineCodeMinificationSupported)
			{
				bool isJavascriptProtocolRemoved = false;
				if (scriptContent.StartsWith(JS_PROTOCOL, StringComparison.OrdinalIgnoreCase))
				{
					result = _jsProtocolRegex.Replace(result, string.Empty);
					isJavascriptProtocolRemoved = true;
				}

				CodeMinificationResult minificationResult = _jsMinifier.Minify(result, true);
				if (minificationResult.Errors.Count == 0)
				{
					result = minificationResult.MinifiedContent ?? string.Empty;
				}

				if (minificationResult.Errors.Count > 0 || minificationResult.Warnings.Count > 0)
				{
					string sourceCode = context.SourceCode;
					SourceCodeNodeCoordinates tagCoordinates = context.NodeCoordinates;
					SourceCodeNodeCoordinates attributeCoordinates = attribute.ValueCoordinates;

					foreach (MinificationErrorInfo error in minificationResult.Errors)
					{
						var relativeErrorCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
						SourceCodeNodeCoordinates absoluteErrorCoordinates = CalculateAbsoluteInlineCodeErrorCoordinates(
							tagCoordinates, attributeCoordinates, relativeErrorCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteErrorCoordinates);
						string message = error.Message.Trim();

						WriteError(ErrorCategoryCode.JsMinificationError, message, _fileContext,
						           absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
					}

					foreach (MinificationErrorInfo warning in minificationResult.Warnings)
					{
						var relativeErrorCoordinates = new SourceCodeNodeCoordinates(warning.LineNumber, warning.ColumnNumber);
						SourceCodeNodeCoordinates absoluteErrorCoordinates = CalculateAbsoluteInlineCodeErrorCoordinates(
							tagCoordinates, attributeCoordinates, relativeErrorCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteErrorCoordinates);
						string message = warning.Message.Trim();

						WriteWarning(ErrorCategoryCode.JsMinificationWarning, message, _fileContext,
						             absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
					}
				}

				if (isJavascriptProtocolRemoved
					&& (forHrefAttribute || !_settings.RemoveJsProtocolFromAttributes))
				{
					result = JS_PROTOCOL + result;
				}
			}
			else
			{
				result = result.Trim();

				if (!forHrefAttribute && _settings.RemoveJsProtocolFromAttributes)
				{
					result = _jsProtocolRegex.Replace(result, string.Empty);
				}
			}

			result = Utils.RemoveEndingSemicolon(result);

			return result;
		}

		/// <summary>
		/// Processes a inline style content
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attribute">Attribute</param>
		/// <returns>Processed inline style content</returns>
		private string ProcessInlineStyleContent(MarkupParsingContext context, HtmlAttribute attribute)
		{
			string styleContent = attribute.Value;

			string result = styleContent;
			if (_settings.MinifyInlineCssCode && _cssMinifier.IsInlineCodeMinificationSupported)
			{
				CodeMinificationResult minificationResult = _cssMinifier.Minify(result, true);
				if (minificationResult.Errors.Count == 0)
				{
					result = minificationResult.MinifiedContent ?? string.Empty;
				}

				if (minificationResult.Errors.Count > 0 || minificationResult.Warnings.Count > 0)
				{
					string sourceCode = context.SourceCode;
					SourceCodeNodeCoordinates tagCoordinates = context.NodeCoordinates;
					SourceCodeNodeCoordinates attributeCoordinates = attribute.ValueCoordinates;

					foreach (MinificationErrorInfo error in minificationResult.Errors)
					{
						var relativeErrorCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
						SourceCodeNodeCoordinates absoluteErrorCoordinates = CalculateAbsoluteInlineCodeErrorCoordinates(
							tagCoordinates, attributeCoordinates, relativeErrorCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteErrorCoordinates);
						string message = error.Message.Trim();

						WriteError(ErrorCategoryCode.CssMinificationError, message, _fileContext,
							absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
					}

					foreach (MinificationErrorInfo warning in minificationResult.Warnings)
					{
						var relativeErrorCoordinates = new SourceCodeNodeCoordinates(warning.LineNumber, warning.ColumnNumber);
						SourceCodeNodeCoordinates absoluteErrorCoordinates = CalculateAbsoluteInlineCodeErrorCoordinates(
							tagCoordinates, attributeCoordinates, relativeErrorCoordinates);
						string sourceFragment = SourceCodeNavigator.GetSourceFragment(
							sourceCode, absoluteErrorCoordinates);
						string message = warning.Message.Trim();

						WriteWarning(ErrorCategoryCode.CssMinificationWarning, message, _fileContext,
							absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber, sourceFragment);
					}
				}
			}
			else
			{
				result = result.Trim();
			}

			result = Utils.RemoveEndingSemicolon(result);

			return result;
		}

		/// <summary>
		/// Processes a embedded SVG content
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="svgContent">Embedded SVG content</param>
		/// <returns>Processed embedded SVG content</returns>
		private string ProcessEmbeddedSvgContent(MarkupParsingContext context, string svgContent)
		{
			string result = string.Empty;

			XmlMinifier innerXmlMinifier = GetInnerXmlMinifierInstance();
			MarkupMinificationResult minificationResult = innerXmlMinifier.Minify(svgContent);

			if (minificationResult.Errors.Count == 0)
			{
				result = minificationResult.MinifiedContent ?? string.Empty;
			}
			else
			{
				string sourceCode = context.SourceCode;
				var documentCoordinates = context.NodeCoordinates;

				foreach (MinificationErrorInfo error in minificationResult.Errors)
				{
					var xmlNodeCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
					var absoluteNodeCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
						documentCoordinates, xmlNodeCoordinates);

					string sourceFragment = SourceCodeNavigator.GetSourceFragment(
						sourceCode, absoluteNodeCoordinates);
					string message = string.Format(Strings.ErrorMessage_MarkupMinificationFailed,
						"SVG", error.Message);

					WriteError(ErrorCategoryCode.HtmlMinificationError, message, _fileContext,
						absoluteNodeCoordinates.LineNumber, absoluteNodeCoordinates.ColumnNumber, sourceFragment);
				}
			}

			return result;
		}

		/// <summary>
		/// Processes a embedded MathML content
		/// </summary>
		/// <param name="context">Embedded MathML content</param>
		/// <param name="mathMlContent">Processed embedded MathML content</param>
		private string ProcessEmbeddedMathMlContent(MarkupParsingContext context, string mathMlContent)
		{
			string result = string.Empty;

			XmlMinifier innerXmlMinifier = GetInnerXmlMinifierInstance();
			MarkupMinificationResult minificationResult = innerXmlMinifier.Minify(mathMlContent);

			if (minificationResult.Errors.Count == 0)
			{
				result = minificationResult.MinifiedContent ?? string.Empty;
			}
			else
			{
				string sourceCode = context.SourceCode;
				var documentCoordinates = context.NodeCoordinates;

				foreach (MinificationErrorInfo error in minificationResult.Errors)
				{
					var xmlNodeCoordinates = new SourceCodeNodeCoordinates(error.LineNumber, error.ColumnNumber);
					var absoluteNodeCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
						documentCoordinates, xmlNodeCoordinates);

					string sourceFragment = SourceCodeNavigator.GetSourceFragment(
						sourceCode, absoluteNodeCoordinates);
					string message = string.Format(Strings.ErrorMessage_MarkupMinificationFailed,
						"MathML", error.Message);

					WriteError(ErrorCategoryCode.HtmlMinificationError, message, _fileContext,
						absoluteNodeCoordinates.LineNumber, absoluteNodeCoordinates.ColumnNumber, sourceFragment);
				}
			}

			return result;
		}

		#region Knockout helpers
		/// <summary>
		/// Processes a Knockout binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attribute">Attribute</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessKnockoutBindingExpression(MarkupParsingContext context, HtmlAttribute attribute)
		{
			return ProcessKnockoutBindingExpression(context, attribute.ValueCoordinates, SourceCodeNodeCoordinates.Empty,
				attribute.Value);
		}

		/// <summary>
		/// Processes a Knockout binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="expressionCoordinates">Coordinates of expression</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessKnockoutBindingExpression(MarkupParsingContext context,
			SourceCodeNodeCoordinates expressionCoordinates, string expression)
		{
			return ProcessKnockoutBindingExpression(context, SourceCodeNodeCoordinates.Empty, expressionCoordinates,
				expression);
		}

		/// <summary>
		/// Processes a Knockout binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attributeCoordinates">Coordinates of attribute value</param>
		/// <param name="expressionCoordinates">Coordinates of expression</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessKnockoutBindingExpression(MarkupParsingContext context,
			SourceCodeNodeCoordinates attributeCoordinates, SourceCodeNodeCoordinates expressionCoordinates,
			string expression)
		{
			if (string.IsNullOrWhiteSpace(expression))
			{
				return string.Empty;
			}

			string result = expression;
			if (_settings.MinifyKnockoutBindingExpressions)
			{
				CrockfordJsMinifier innerCrockfordJsMinifier = GetInnerCrockfordJsMinifierInstance();
				CodeMinificationResult minificationResult = innerCrockfordJsMinifier.Minify(
					JsonHelpers.WrapStringInCurlyBraces(result), true);
				IList<MinificationErrorInfo> errors = minificationResult.Errors;

				if (errors.Count == 0)
				{
					result = minificationResult.MinifiedContent ?? string.Empty;
				}
				else
				{
					SourceCodeNodeCoordinates absoluteErrorCoordinates = CalculateAbsoluteInlineCodeErrorCoordinates(
						context.NodeCoordinates, attributeCoordinates, expressionCoordinates);
					string sourceFragment = SourceCodeNavigator.GetSourceFragment(
						context.SourceCode, absoluteErrorCoordinates);
					string errorMessage = errors[0].Message;

					WriteError(ErrorCategoryCode.JsTemplateMinificationError,
						string.Format(Strings.ErrorMessage_BindingExpressionMinificationFailed,
							"Knockout", errorMessage.TrimEnd('.')),
						_fileContext,
						absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber,
						sourceFragment);
				}

				result = JsonHelpers.UnwrapStringInCurlyBraces(result);
			}

			return result;
		}
		#endregion

		#region Angular helpers
		/// <summary>
		/// Processes a Angular binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessAngularBindingExpression(MarkupParsingContext context, string expression)
		{
			return ProcessAngularBindingExpression(context, SourceCodeNodeCoordinates.Empty, expression);
		}

		/// <summary>
		/// Processes a Angular binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attributeCoordinates">Coordinates of attribute value</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessAngularBindingExpression(MarkupParsingContext context,
			SourceCodeNodeCoordinates attributeCoordinates, string expression)
		{
			return ProcessAngularBindingExpression(context, attributeCoordinates, SourceCodeNodeCoordinates.Empty,
				expression);
		}

		/// <summary>
		/// Processes a Angular binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attributeCoordinates">Coordinates of attribute value</param>
		/// <param name="expressionCoordinates">Coordinates of expression</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessAngularBindingExpression(MarkupParsingContext context,
			SourceCodeNodeCoordinates attributeCoordinates, SourceCodeNodeCoordinates expressionCoordinates,
			string expression)
		{
			return ProcessAngularBindingExpression(context, attributeCoordinates, expressionCoordinates,
				string.Empty, expression);
		}

		/// <summary>
		/// Processes a Angular binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attributeCoordinates">Coordinates of attribute value</param>
		/// <param name="directiveName">Directive name</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessAngularBindingExpression(MarkupParsingContext context,
			SourceCodeNodeCoordinates attributeCoordinates, string directiveName, string expression)
		{
			return ProcessAngularBindingExpression(context, attributeCoordinates, SourceCodeNodeCoordinates.Empty,
				directiveName, expression);
		}

		/// <summary>
		/// Processes a Angular binding expressions
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="attributeCoordinates">Coordinates of attribute value</param>
		/// <param name="expressionCoordinates">Coordinates of expression</param>
		/// <param name="directiveName">Directive name</param>
		/// <param name="expression">Binding expression</param>
		/// <returns>Processed binding expression</returns>
		private string ProcessAngularBindingExpression(MarkupParsingContext context,
			SourceCodeNodeCoordinates attributeCoordinates, SourceCodeNodeCoordinates expressionCoordinates,
			string directiveName, string expression)
		{
			if (string.IsNullOrEmpty(expression))
			{
				return string.Empty;
			}

			string result = expression;
			if (_settings.MinifyAngularBindingExpressions
				&& (string.IsNullOrEmpty(directiveName) || _angularDirectivesWithExpressions.Contains(directiveName)))
			{
				CrockfordJsMinifier innerCrockfordJsMinifier = GetInnerCrockfordJsMinifierInstance();
				CodeMinificationResult minificationResult = innerCrockfordJsMinifier.Minify(result, true);
				IList<MinificationErrorInfo> errors = minificationResult.Errors;

				if (errors.Count == 0)
				{
					result = minificationResult.MinifiedContent ?? string.Empty;
				}
				else
				{
					SourceCodeNodeCoordinates absoluteErrorCoordinates = CalculateAbsoluteInlineCodeErrorCoordinates(
						context.NodeCoordinates, attributeCoordinates, expressionCoordinates);
					string sourceFragment = SourceCodeNavigator.GetSourceFragment(
						context.SourceCode, absoluteErrorCoordinates);
					string errorMessage = errors[0].Message;

					WriteError(ErrorCategoryCode.JsTemplateMinificationError,
						string.Format(Strings.ErrorMessage_BindingExpressionMinificationFailed,
							"Angular", errorMessage.TrimEnd('.')),
						_fileContext,
						absoluteErrorCoordinates.LineNumber, absoluteErrorCoordinates.ColumnNumber,
						sourceFragment);
				}

				result = Utils.RemoveEndingSemicolon(result);
			}

			return result;
		}
		#endregion

		private static SourceCodeNodeCoordinates CalculateAbsoluteInlineCodeErrorCoordinates(
			SourceCodeNodeCoordinates tagCoordinates, SourceCodeNodeCoordinates attributeCoordinates,
			SourceCodeNodeCoordinates relativeErrorCoordinates)
		{
			SourceCodeNodeCoordinates absoluteErrorCoordinates;
			if (!attributeCoordinates.IsEmpty)
			{
				absoluteErrorCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
					attributeCoordinates, relativeErrorCoordinates);
			}
			else
			{
				absoluteErrorCoordinates = SourceCodeNavigator.CalculateAbsoluteNodeCoordinates(
					tagCoordinates, relativeErrorCoordinates);
			}

			return absoluteErrorCoordinates;
		}

		/// <summary>
		/// Writes a information about the error
		/// </summary>
		/// <param name="category">Error category</param>
		/// <param name="message">Error message</param>
		/// <param name="filePath">File path</param>
		/// <param name="lineNumber">Line number on which the error occurred</param>
		/// <param name="columnNumber">Column number on which the error occurred</param>
		/// <param name="sourceFragment">Fragment of source svgContent</param>
		private void WriteError(string category, string message, string filePath, int lineNumber, int columnNumber,
			string sourceFragment)
		{
			_errors.Add(new MinificationErrorInfo(category, message, lineNumber, columnNumber, sourceFragment));
			_logger.Error(category, message, filePath, lineNumber, columnNumber, sourceFragment);
		}

		/// <summary>
		/// Writes a information about the warning
		/// </summary>
		/// <param name="category">Warning category</param>
		/// <param name="message">Warning message</param>
		/// <param name="filePath">File path</param>
		/// <param name="lineNumber">Line number on which the warning occurred</param>
		/// <param name="columnNumber">Column number on which the warning occurred</param>
		/// <param name="sourceFragment">Fragment of source svgContent</param>
		private void WriteWarning(string category, string message, string filePath, int lineNumber, int columnNumber,
			string sourceFragment)
		{
			_warnings.Add(new MinificationErrorInfo(category, message, lineNumber, columnNumber, sourceFragment));
			_logger.Warn(category, message, filePath, lineNumber, columnNumber, sourceFragment);
		}
	}
}