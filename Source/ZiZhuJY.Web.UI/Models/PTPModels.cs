namespace ZiZhuJY.Web.UI.Models
{
    public class PTPClientModel
    {
        private string privateIP;
        private int privatePort;
        private string privateHostName;
        private string privateHostFullName;

        private string publicIP;
        private int publicPort;
        private string publicHostName;
        private string publicHostFullName;

        private string remark;

        public PTPClientModel() { }
        public PTPClientModel(string privateIP, int privatePort, string privateHostName, string publicIP, int publicPort)
        {
            this.privateIP = privateIP;
            this.privatePort = privatePort;
            this.privateHostName = privateHostName;
            this.publicIP = publicIP;
            this.publicPort = publicPort;
        }

        public string PrivateIP { get { return privateIP; } set { privateIP = value; } }
        public int PrivatePort { get { return privatePort; } set { privatePort = value; } }
        public string PrivateHostName { get { return privateHostName; } set { privateHostName = value; } }
        public string PrivateHostFullName { get { return privateHostFullName; } set { privateHostFullName = value; } }
        public string PublicIP { get { return publicIP; } set { publicIP = value; } }
        public int PublicPort { get { return PublicPort; } set { publicPort = value; } }
        public string PublicHostName { get { return publicHostName; } set { publicHostName = value; } }
        public string PublicHostFullName { get { return publicHostFullName; } set { publicHostFullName = value; } }

        public string Remark { get { return remark; } set { remark = value; } }
    }
}