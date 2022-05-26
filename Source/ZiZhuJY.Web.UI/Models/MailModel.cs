using System.ComponentModel.DataAnnotations;

namespace ZiZhuJY.Web.UI.Models
{
    public class MailModel
    {
        private string from;
        private string to;
        private string cc;
        private string bcc;
        private string title;
        private string content;

        public MailModel()
        {
        }

        public MailModel(string from, string to, string cc, string bcc, string title, string content)
        {
            this.from = from;
            this.to = to;
            this.cc = cc;
            this.bcc = bcc;
            this.title = title;
            this.content = content;
        }

        public MailModel(string from, string to, string title, string content)
        {
            this.from = from;
            this.to = to;
            this.title = title;
            this.content = content;
        }

        public MailModel(string to, string title, string content)
        {
            this.to = to;
            this.title = title;
            this.content = content;
        }

        public string From { get { return from; } set { from = value; } }
        [Required]
        public string To { get { return to; } set { to = value; } }
        public string CC { get { return cc; } set { cc = value; } }
        public string BCC { get { return bcc; } set { bcc = value; } }
        public string Title { get { return title; } set { title = value; } }
        public string Content { get { return content; } set { content = value; } }
    }
}