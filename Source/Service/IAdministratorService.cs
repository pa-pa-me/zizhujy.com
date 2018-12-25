using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.Data;
using System.Runtime.Serialization;

namespace ZiZhuJY.ServiceModel.Services
{
    [ServiceContract(Namespace="http://ZiZhuJY.ServiceModel.Services")]
    public interface IAdministratorService
    {
        [OperationContract]
        DataTable SQLQuery(string sql);
    }
}
