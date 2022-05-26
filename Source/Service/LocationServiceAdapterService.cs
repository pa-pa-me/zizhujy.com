using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ServiceModel;
using ZiZhuJY.Services.ZiZhuJYLocationService;
using ZiZhuJY.Helpers;

namespace ZiZhuJY.Services.LocationAdapter
{    
    public class LocationServiceAdapterService : ILocationServiceAdapterService
    {
        public void UpdateGeoCoordinate(string userName, string password, Device device, GeoCoordinate geoCoor)
        {
            try
            {
                ZiZhuJYLocationService.LocationServiceClient client = new LocationServiceClient();
                client.ClientCredentials.UserName.UserName = userName;
                client.ClientCredentials.UserName.Password = password;

                client.UpdateGeoCoordinate(device, geoCoor);
                client.Close();
            }
            catch (Exception ex)
            {
                throw new FaultException(ex.GetDebugString());
            }
        }

        public GeoCoordinate GetLatestGeoCoordinateByDevice(string userName, string password, Device device)
        {
            GeoCoordinate geoCoor = null;
            try
            {
                ZiZhuJYLocationService.LocationServiceClient client = new LocationServiceClient();
                client.ClientCredentials.UserName.UserName = userName;
                client.ClientCredentials.UserName.Password = password;

                geoCoor = client.GetLatestGeoCoordinateByDevice(device);
                client.Close();
            }
            catch (Exception ex)
            {
                throw new FaultException(ex.GetDebugString());
            }

            return geoCoor;
        }

        public Dictionary<IdentifiedDevice, GeoCoordinate> GetLatestGeoCoordinates(string userName, string password)
        {
            Dictionary<IdentifiedDevice, GeoCoordinate> dic = null;

            try
            {
                ZiZhuJYLocationService.LocationServiceClient client = new LocationServiceClient();
                client.ClientCredentials.UserName.UserName = userName;
                client.ClientCredentials.UserName.Password = password;

                dic = client.GetLatestGeoCoordinates();
                client.Close();
            }
            catch (Exception ex)
            {
                throw new FaultException(ex.GetDebugString());
            }

            return dic;
        }

        public Dictionary<Device, GeoCoordinate> GetLatestGeoCoordinatesByUserName(string userName, string password, string queryingUserName)
        {
            Dictionary<Device, GeoCoordinate> dic = null;
            try
            {
                ZiZhuJYLocationService.LocationServiceClient client = new LocationServiceClient();
                client.ClientCredentials.UserName.UserName = userName;
                client.ClientCredentials.UserName.Password = password;

                dic = client.GetLatestGeoCoordinatesByUserName(queryingUserName);
                client.Close();
            }
            catch (Exception ex)
            {
                throw new FaultException(ex.GetDebugString());
            }

            return dic;
        }

        public GeoCoordinate GetLatestGeoCoordinateByUserNameAndDevice(string userName, string password, string queryingUserName, Device device)
        {
            GeoCoordinate geoCoor = null;
            try
            {
                LocationServiceClient client = new LocationServiceClient();
                client.ClientCredentials.UserName.UserName = userName;
                client.ClientCredentials.UserName.Password = password;

                geoCoor = client.GetLatestGeoCoordinateByUserNameAndDevice(queryingUserName, device);
                client.Close();
            }
            catch (Exception ex)
            {
                throw new FaultException(ex.GetDebugString());
            }

            return geoCoor;
        }
    }

    [ServiceContract(Namespace = "http://ZiZhuJY.Services.LocationAdapter")]
    public interface ILocationServiceAdapterService
    {
        [OperationContract]
        void UpdateGeoCoordinate(string userName, string password, Device device, GeoCoordinate geoCoor);

        [OperationContract]
        GeoCoordinate GetLatestGeoCoordinateByDevice(string userName, string password, Device device);

        [OperationContract]
        Dictionary<IdentifiedDevice, GeoCoordinate> GetLatestGeoCoordinates(string userName, string password);

        [OperationContract]
        Dictionary<Device, GeoCoordinate> GetLatestGeoCoordinatesByUserName(string userName, string password, string queryingUserName);

        [OperationContract]
        GeoCoordinate GetLatestGeoCoordinateByUserNameAndDevice(string userName, string password, string queryingUserName, Device device);
    }    
}
