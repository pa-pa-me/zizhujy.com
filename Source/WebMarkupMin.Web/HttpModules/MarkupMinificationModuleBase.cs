namespace WebMarkupMin.Web.HttpModules
{
	using System;
	using System.Web;

	using Core;

	/// <summary>
	/// Base class of HTTP module for markup minification
	/// </summary>
	public abstract class MarkupMinificationModuleBase : IHttpModule
	{
		/// <summary>
		/// Initializes a module and prepares it to handle requests.
		/// </summary>
		/// <param name="context">HTTP context</param>
		public void Init(HttpApplication context)
		{
			context.PostRequestHandlerExecute += ProcessResponse;
		}

		/// <summary>
		/// Processes the response and sets a XML minification response filter
		/// </summary>
		/// <param name="sender">The source of the event (HTTP application)</param>
		/// <param name="e">An System.EventArgs that contains no event data</param>
		private void ProcessResponse(object sender, EventArgs e)
		{
			if (!WebMarkupMinContext.Current.IsMinificationEnabled())
			{
				return;
			}

			HttpContext context = ((HttpApplication) sender).Context;
			ProcessContent(context);
		}

		/// <summary>
		/// Processes a response content
		/// </summary>
		/// <param name="context">HTTP response</param>
		protected abstract void ProcessContent(HttpContext context);

		/// <summary>
		/// Destroys object
		/// </summary>
		public void Dispose()
		{
			// Nothing to destroy
		}
	}
}