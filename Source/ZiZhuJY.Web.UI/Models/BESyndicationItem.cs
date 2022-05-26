using System.Collections.Generic;
using System.ServiceModel.Syndication;
using System.Text.RegularExpressions;

namespace ZiZhuJY.Web.UI.Models
{
    public class BESyndicationItem
    {
        private SyndicationItem syndicationItem;
        public SyndicationItem SyndicationItem
        {
            get { return syndicationItem; }
        }

        private List<Attachment> attachments;
        public List<Attachment> Attachments
        {
            get { if (attachments == null) attachments = new List<Attachment>(); return attachments; }
            set { attachments = value; }
        }

        public BESyndicationItem(SyndicationItem syndicationItem)
        {
            // TODO: Complete member initialization
            this.syndicationItem = syndicationItem;
            //Parse();
        }

        private void Parse()
        {
            this.Attachments = new List<Attachment>();

            string source = this.SyndicationItem.Summary.Text;
            Regex reImg = new Regex("(<img[^>]+>)", RegexOptions.IgnoreCase | RegexOptions.Multiline);
            Regex reLink = new Regex("src=\"([^\"]+)\"", RegexOptions.IgnoreCase | RegexOptions.Multiline);
            MatchCollection imgs = reImg.Matches(source);
            for (int i = 0; i < imgs.Count; i++)
            {
                string tag = imgs[i].Groups[0].ToString();

                Match match = reLink.Match(tag);
                string link = "";

                if (match != null && match.Groups != null && match.Groups.Count > 1)
                {
                    link = match.Groups[1].ToString();
                }

                this.Attachments.Add(new Attachment(tag, link));
            }
        }
    }

    public class Attachment
    {
        public Attachment(string tag, string link)
        {
            this.tag = tag;
            this.link = link;
        }

        private string tag;
        public string Tag
        {
            get { return tag; }
            set { tag = value; }
        }

        private string link;
        public string Link
        {
            get { return link; }
            set { link = value; }
        }

        private AttachmentType type;
        public AttachmentType Type
        {
            get { return type; }
            set { type = value; }
        }
    }

    public enum AttachmentType
    {
        Image,
        File, 
        Video
    }
}