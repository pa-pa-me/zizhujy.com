using System.Web;

namespace ZiZhuJY.Web.UI.HttpHandlers
{
    public class SimpleHandler :　IHttpHandler
    {
        #region IHttpHandler 成员

        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            HttpResponse response = context.Response;
            response.Write("<html><body><h1>Rendered by the SimpleHandler");
            response.Write("</h1></body></html>");
        }

        #endregion
    }
}