namespace WebMarkupMin.Web
{
	using System;

	/// <summary>
	/// The exception that is thrown when a content type is invalid
	/// </summary>
	public sealed class InvalidContentTypeException : Exception
	{
		/// <summary>
		/// Initializes a new instance of the WebMarkupMin.Mvc.InvalidContentTypeException class
		/// with a specified error message
		/// </summary>
		/// <param name="message">The message that describes the error</param>
		public InvalidContentTypeException(string message)
			: base(message)
		{ }

		/// <summary>
		/// Initializes a new instance of the WebMarkupMin.Mvc.InvalidContentTypeException class
		/// with a specified error message and a reference to the inner exception that is the cause of this exception
		/// </summary>
		/// <param name="message">The error message that explains the reason for the exception</param>
		/// <param name="innerException">The exception that is the cause of the current exception</param>
		public InvalidContentTypeException(string message, Exception innerException)
			: base(message, innerException)
		{ }
	}
}