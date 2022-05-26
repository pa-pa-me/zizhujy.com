using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using zizhujy.services.location;

namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {
            //CalculatorClient client = new CalculatorClient();
            LocationServiceClient client = new LocationServiceClient();

            client.ClientCredentials.UserName.UserName = "Jeff";
            client.ClientCredentials.UserName.Password = "1050709";

            //client.UpdateGeoCoordinate(new zizhujy.services.location.Device() { DeviceName = "Test" },
            //    new zizhujy.services.location.GeoCoordinate() { Remark = "Test" });
            Dictionary<IdentifiedDevice, GeoCoordinate> dic = client.GetLatestGeoCoordinates();
            
            client.Close();

            /*
            double value1 = 100.00D;
            double value2 = 15.99D;
            double result = client.Add(value1, value2);
            Console.WriteLine("Add({0}, {1}) = {2}", value1, value2, result);
            client.Close();
            */

            Console.WriteLine(dic != null ? dic.Count.ToString() : "null");

            Console.WriteLine();
            Console.WriteLine("Press <ENTER> to terminate client.");
            Console.ReadLine();
        }
    }
}
