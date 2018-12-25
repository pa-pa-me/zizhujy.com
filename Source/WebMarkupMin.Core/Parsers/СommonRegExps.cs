namespace WebMarkupMin.Core.Parsers
{
	using System.Text.RegularExpressions;

	/// <summary>
	/// Common regular expressions
	/// </summary>
	internal static class CommonRegExps
	{
		public static readonly Regex Doctype = new Regex(@"^<!DOCTYPE [^>]+?>", RegexOptions.IgnoreCase);
	}
}