using System;
using System.Web;

namespace ZiZhuJY.Web.UI.HttpModules
{
    /// <summary>
    /// Handles URLs
    /// </summary>
    public class UrlRewrite : IHttpModule
    {
        #region Implemented Interfaces

        #region IHttpModule 成员

        public void Dispose()
        {
        }

        /// <summary>
        /// Initialize a module and prepare it to handle requests.
        /// </summary>
        /// <param name="context"></param>
        public void Init(HttpApplication context)
        {
            context.BeginRequest += ContextBeginRequest;
        }

        #endregion

        #endregion

        #region Methods

        /// <summary>
        /// Handles the BeginRequest event of the context control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private static void ContextBeginRequest(object sender, EventArgs e)
        {
            var context = ((HttpApplication)sender).Context;
            var path = context.Request.Path.ToUpperInvariant();
            var url = context.Request.RawUrl.ToUpperInvariant();

            if (url.Contains("/BLOG/"))
            {
                RewriteBlog(context, url);
            }
        }

        /// <summary>
        /// Rewrites the blog
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="url">The URL string.</param>
        private static void RewriteBlog(HttpContext context, string url)
        {
            context.RewritePath("~/");
        }

        #endregion
    }
}