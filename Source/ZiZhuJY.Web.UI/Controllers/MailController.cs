using System.Net;
using System.Net.Mail;
using System.Web.Mvc;
using ZiZhuJY.Web.UI.Models;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Authorize(Roles="Administrators")]
    public class MailController : Controller
    {
        //
        // GET: /Mail/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string Index(MailModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    MailMessage mail = new MailMessage(model.From, model.To, model.Title, model.Content);
                    mail.CC.Add(model.CC);
                    mail.Bcc.Add(model.BCC);
                    SmtpClient smtpClient = new SmtpClient("smtp.zizhujy.com", 25);
                    smtpClient.Credentials = new NetworkCredential("postmaster@zizhujy.com", "Love1050709");
                    smtpClient.Send(mail);
                }
                catch
                {
                    throw;
                }

                return "Succeeded";
            }
            else
            {
                return "Error.";
            }
        }
    }
}
