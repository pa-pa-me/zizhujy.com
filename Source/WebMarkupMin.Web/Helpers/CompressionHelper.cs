namespace WebMarkupMin.Web.Helpers
{
	using System.IO.Compression;
	using System.Web;

	/// <summary>
	/// Compression helper
	/// </summary>
	public static class CompressionHelper
	{
		/// <summary>
		/// Name of the GZIP encoding
		/// </summary>
		const string GZIP_ENCODING_NAME = "gzip";

		/// <summary>
		/// Name of the Deflate encoding
		/// </summary>
		const string DEFLATE_ENCODING_NAME = "deflate";


		/// <summary>
		/// Checks whether the browser support compression
		/// </summary>
		/// <param name="request">HTTP request</param>
		/// <returns>Result of check (true - supports compression; false - not supports compression)</returns>
		public static bool IsCompressionSupported(HttpRequest request)
		{
			return IsCompressionSupported(new HttpRequestWrapper(request));
		}

		/// <summary>
		/// Checks whether the browser support compression
		/// </summary>
		/// <param name="request">HTTP request base</param>
		/// <returns>Result of check (true - supports compression; false - not supports compression)</returns>
		public static bool IsCompressionSupported(HttpRequestBase request)
		{
			if (request.Browser == null)
			{
				return false;
			}

			if (request.Params["SERVER_PROTOCOL"] != null
			    && request.Params["SERVER_PROTOCOL"].Contains("1.1")
			    && request.Headers["Accept-Encoding"] != null)
			{
				return true;
			}

			return false;
		}

		/// <summary>
		/// Compresses content using GZIP or Deflate (if there is support in browser)
		/// </summary>
		/// <param name="context">HTTP context</param>
		public static void TryCompressContent(HttpContext context)
		{
			TryCompressContent(new HttpContextWrapper(context));
		}

		/// <summary>
		/// Compresses content using GZIP or Deflate (if there is support in browser)
		/// </summary>
		/// <param name="context">HTTP context</param>
		public static void TryCompressContent(HttpContextBase context)
		{
			var request = context.Request;
			var response = context.Response;

			string acceptEncoding = request.Headers["Accept-Encoding"];
			if (acceptEncoding == null)
			{
				return;
			}

			acceptEncoding = acceptEncoding.ToLowerInvariant();
			if (acceptEncoding.Contains(GZIP_ENCODING_NAME))
			{
				response.Filter = new GZipStream(response.Filter, CompressionMode.Compress);
				SetEncoding(response, GZIP_ENCODING_NAME);
			}
			else if (acceptEncoding.Contains(DEFLATE_ENCODING_NAME))
			{
				response.Filter = new DeflateStream(response.Filter, CompressionMode.Compress);
				SetEncoding(response, DEFLATE_ENCODING_NAME);
			}
		}

		/// <summary>
		/// Adds a specified encoding to the response headers
		/// </summary>
		/// <param name="response">HTTP response</param>
		/// <param name="encoding">Encoding to sent to the Accept-encoding HTTP header of the response</param>
		private static void SetEncoding(HttpResponseBase response, string encoding)
		{
			response.Headers["Content-Encoding"] = encoding;

			// Allow proxy servers to cache encoded and unencoded versions separately
			response.Cache.VaryByHeaders["Accept-encoding"] = true;
		}
	}
}