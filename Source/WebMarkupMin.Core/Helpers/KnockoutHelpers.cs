﻿namespace WebMarkupMin.Core.Helpers
{
	using System.Text.RegularExpressions;

	using Parsers;

	/// <summary>
	/// Knockout helpers
	/// </summary>
	internal static class KnockoutHelpers
	{
		/// <summary>
		/// Regular expression for working with the Knockout begin containerless comment
		/// </summary>
		private static readonly Regex _koBeginContainerlessCommentRegex = new Regex(@"^\s*ko(?:\s+(?<expression>[\s\S]+))?\s*$");

		/// <summary>
		/// Regular expression for working with the Knockout end containerless comment
		/// </summary>
		private static readonly Regex _koEndContainerlessCommentRegex = new Regex(@"^\s*/ko\s*$");


		/// <summary>
		/// Checks whether the comment is the Knockout begin containerless comment
		/// </summary>
		/// <param name="commentText">Comment text</param>
		/// <returns>Result of check (true - is begin containerless comment; false - is not begin containerless comment)</returns>
		public static bool IsBeginContainerlessComment(string commentText)
		{
			return _koBeginContainerlessCommentRegex.IsMatch(commentText);
		}

		/// <summary>
		/// Parses a Knockout begin containerless comment
		/// </summary>
		/// <param name="commentText">Comment text</param>
		/// <param name="expressionHandler">Binding expression handler</param>
		public static void ParseBeginContainerlessComment(string commentText,
			ExpressionDelegate expressionHandler)
		{
			Match koBeginContainerlessCommentMatch = _koBeginContainerlessCommentRegex.Match(commentText);

			if (koBeginContainerlessCommentMatch.Success)
			{
				var innerContext = new InnerMarkupParsingContext(commentText);
				var context = new MarkupParsingContext(innerContext);

				Group expressionGroup = koBeginContainerlessCommentMatch.Groups["expression"];
				int expressionPosition = expressionGroup.Index;
				string expression = expressionGroup.Value.TrimEnd();

				innerContext.IncreasePosition(expressionPosition);

				if (expressionHandler != null)
				{
					expressionHandler(context, expression);
				}
			}
		}

		/// <summary>
		/// Checks whether the comment is the Knockout end containerless comment
		/// </summary>
		/// <param name="commentText">Comment text</param>
		/// <returns>Result of check (true - is end containerless comment; false - is not end containerless comment)</returns>
		public static bool IsEndContainerlessComment(string commentText)
		{
			return _koEndContainerlessCommentRegex.IsMatch(commentText);
		}

		/// <summary>
		/// Knockout binding expression delegate
		/// </summary>
		/// <param name="context">Markup parsing context</param>
		/// <param name="expression">Binding expression</param>
		public delegate void ExpressionDelegate(MarkupParsingContext context, string expression);
	}
}