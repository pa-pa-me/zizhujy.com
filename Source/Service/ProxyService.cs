using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;

namespace ZiZhuJY.Services.Proxy
{
    public class ProxyService : IProxyService
    {
        public string Test()
        {
            return "Sucess";
        }
    }

    [ServiceContract(Namespace = "http://ZiZhuJY.Services.Proxy")]
    public interface IProxyService
    {
        [OperationContract]
        string Test();

    }
}
