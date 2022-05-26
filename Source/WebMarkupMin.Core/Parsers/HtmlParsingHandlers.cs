﻿namespace WebMarkupMin.Core.Parsers
{
	/// <summary>
	/// HTML parsing handlers
	/// </summary>
	internal sealed class HtmlParsingHandlers
	{
		/// <summary>
		/// XML declaration
		/// </summary>
		public XmlDeclarationDelegate XmlDeclaration
		{
			get;
			set;
		}

		/// <summary>
		/// Document type declaration handler
		/// </summary>
		public DoctypeDelegate Doctype
		{
			get;
			set;
		}

		/// <summary>
		/// Comments handler
		/// </summary>
		public CommentDelegate Comment
		{
			get;
			set;
		}

		/// <summary>
		/// If conditional comments handler
		/// </summary>
		public IfConditionalCommentDelegate IfConditionalComment
		{
			get;
			set;
		}

		/// <summary>
		/// End If conditional comments handler
		/// </summary>
		public EndIfConditionalCommentDelegate EndIfConditionalComment
		{
			get;
			set;
		}

		/// <summary>
		/// Start tags handler
		/// </summary>
		public StartTagDelegate StartTag
		{
			get;
			set;
		}

		/// <summary>
		/// End tags handler
		/// </summary>
		public EndTagDelegate EndTag
		{
			get;
			set;
		}

		/// <summary>
		/// Text handler
		/// </summary>
		public TextDelegate Text
		{
			get;
			set;
		}

		/// <summary>
		/// Template tags handler
		/// </summary>
		public TemplateTagDelegate TemplateTag
		{
			get;
			set;
		}


		/// <summary>
		/// XML declaration delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="xmlDeclaration">XML declaration</param>
		public delegate void XmlDeclarationDelegate(MarkupParsingContext context, string xmlDeclaration);

		/// <summary>
		/// Document type declaration delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="doctype">Document type declaration</param>
		public delegate void DoctypeDelegate(MarkupParsingContext context, string doctype);

		/// <summary>
		/// Comments delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="comment">Comment text</param>
		public delegate void CommentDelegate(MarkupParsingContext context, string comment);

		/// <summary>
		/// If conditional comments delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="htmlConditionalComment">Conditional comment</param>
		public delegate void IfConditionalCommentDelegate(MarkupParsingContext context, 
			HtmlConditionalComment htmlConditionalComment);

		/// <summary>
		/// End If conditional comments delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="type">Conditional comment type</param>
		public delegate void EndIfConditionalCommentDelegate(MarkupParsingContext context, 
			HtmlConditionalCommentType type);

		/// <summary>
		/// Start tags delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="tag">HTML tag</param>
		public delegate void StartTagDelegate(MarkupParsingContext context, HtmlTag tag);

		/// <summary>
		/// End tags delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="tag">HTML tag</param>
		public delegate void EndTagDelegate(MarkupParsingContext context, HtmlTag tag);

		/// <summary>
		/// Text delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="text">Text</param>
		public delegate void TextDelegate(MarkupParsingContext context, string text);

		/// <summary>
		/// Template tags delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="expression">Expression</param>
		/// <param name="startDelimiter">Start delimiter</param>
		/// <param name="endDelimiter">End delimiter</param>
		public delegate void TemplateTagDelegate(MarkupParsingContext context, string expression,
			string startDelimiter, string endDelimiter);
	}
}