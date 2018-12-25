using System;
using System.ServiceModel;
using System.ServiceModel.Description;

namespace ZiZhuJY.Services.Samples
{
    class Program
    {
        static void Main(string[] args)
        {
            Uri baseAddress = new Uri("http://localhost:8000/ServiceModelSamples/Service");
            ServiceHost selfHost = new ServiceHost(typeof(CalculatorService), baseAddress);
            try
            {
                selfHost.AddServiceEndpoint(typeof(ICalculator), new WSHttpBinding(), "CalculatorService");

                ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
                smb.HttpGetEnabled = true;
                selfHost.Description.Behaviors.Add(smb);

                selfHost.Open();
                Console.WriteLine("The service is ready.");
                Console.WriteLine("Press <ENTER> to terminate service.");
                Console.WriteLine();
                Console.ReadLine();

                selfHost.Close();
            }
            catch (CommunicationException ce)
            {
                Console.WriteLine("An exception occurred: {0}", ce.Message);
                selfHost.Abort();
            }
        }
    }

    [ServiceContract(Namespace="http://ZiZhuJY.Services.Samples")]
    public interface ICalculator {
        [OperationContract]
        double Add(double n1, double n2);

        [OperationContract]
        double Subtract(double n1, double n2);

        [OperationContract]
        double Multiply(double n1, double n2);

        [OperationContract]
        double Divide(double n1, double n2);
    }
}
