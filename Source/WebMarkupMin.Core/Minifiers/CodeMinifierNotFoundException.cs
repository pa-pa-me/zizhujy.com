namespace WebMarkupMin.Core.Minifiers
{
	using System;

	/// <summary>
	/// The exception that is thrown when a minifier is not found
	/// </summary>
	public sealed class CodeMinifierNotFoundException : Exception
	{
		/// <summary>
		/// Initializes a new instance of the WebMarkupMin.Core.Minifiers.CodeMinifierNotFoundException class
		/// with a specified error message
		/// </summary>
		/// <param name="message">The message that describes the error</param>
		public CodeMinifierNotFoundException(string message)
			: base(message)
		{ }

		/// <summary>
		/// Initializes a new instance of the WebMarkupMin.Core.Minifiers.CodeMinifierNotFoundException class
		/// with a specified error message and a reference to the inner exception that is the cause of this exception
		/// </summary>
		/// <param name="message">The error message that explains the reason for the exception</param>
		/// <param name="innerException">The exception that is the cause of the current exception</param>
		public CodeMinifierNotFoundException(string message, Exception innerException)
			: base(message, innerException)
		{ }
	}
}