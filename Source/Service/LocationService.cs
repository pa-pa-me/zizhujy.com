using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.Runtime.Serialization;
using System.ServiceModel.Description;
using ZiZhuJY.Helpers;
using System.ServiceModel.Activation;

namespace ZiZhuJY.Services.Location
{
    [Serializable]
    [AspNetCompatibilityRequirements(RequirementsMode=AspNetCompatibilityRequirementsMode.Allowed)]
    public class LocationService : ILocationService
    {
        private static Dictionary<IdentifiedDevice, GeoCoordinate> geoDictionary = new Dictionary<IdentifiedDevice, GeoCoordinate>();        
        
        public void UpdateGeoCoordinate(Device device, GeoCoordinate geoCoor)
        {
            string userName = "";
            if (ServiceSecurityContext.Current != null)
            {
                userName = ServiceSecurityContext.Current.PrimaryIdentity.Name;
            }
            else
            {
                // TODO: Throw fault exception
            }

            IdentifiedDevice idd = new IdentifiedDevice(userName, device);
            
            geoDictionary.Upsert(idd, geoCoor);
        }

        public GeoCoordinate GetLatestGeoCoordinateByDevice(Device device)
        {
            string userName = "";
            if (ServiceSecurityContext.Current != null)
            {
                userName = ServiceSecurityContext.Current.PrimaryIdentity.Name;
            }
            IdentifiedDevice idd = new IdentifiedDevice(userName, device);

            return geoDictionary[idd];
        }
        
        public GeoCoordinate GetLatestGeoCoordinateByUserNameAndDevice(string userName, Device device)
        {
            IdentifiedDevice idd = new IdentifiedDevice(userName, device);

            return geoDictionary[idd];
        }

        public Dictionary<IdentifiedDevice, GeoCoordinate> GetLatestGeoCoordinates()
        {
            return geoDictionary;
        }

        public Dictionary<Device, GeoCoordinate> GetLatestGeoCoordinatesByUserName(string userName)
        {
            throw new NotImplementedException();
        }
    }

    [ServiceContract(Namespace = "http://ZiZhuJY.Services.Location")]
    public interface ILocationService
    {
        /// <summary>
        /// Update self's geo coordinate of a special device
        /// </summary>
        /// <param name="device"></param>
        /// <param name="geoCoor"></param>
        [OperationContract]
        void UpdateGeoCoordinate(Device device, GeoCoordinate geoCoor);

        /// <summary>
        /// Get self's latest geo coordinate by device
        /// </summary>
        /// <param name="device"></param>
        /// <returns></returns>
        [OperationContract]
        GeoCoordinate GetLatestGeoCoordinateByDevice(Device device);

        /// <summary>
        /// Get self's latest geo coordinates of all devices
        /// </summary>
        /// <returns></returns>
        [OperationContract]
        Dictionary<IdentifiedDevice, GeoCoordinate> GetLatestGeoCoordinates();

        /// <summary>
        /// Get a user's geo coordinates of all devices
        /// </summary>
        /// <remarks>This method is only for administrators</remarks>
        /// <param name="userName"></param>
        /// <returns></returns>
        [OperationContract]
        //TODO: [Authorize(Roles = "Administrators")] using role provider of System.Web.Mvc
        Dictionary<Device, GeoCoordinate> GetLatestGeoCoordinatesByUserName(string userName);

        /// <summary>
        /// Get a user's geo coordinate of a special device
        /// </summary>
        /// <remarks>This method is only for administrators</remarks>
        /// <param name="userName"></param>
        /// <param name="device"></param>
        /// <returns></returns>
        [OperationContract]
        //TODO: [Authorize(Roles = "Administrators")] using role provider of System.Web.Mvc
        GeoCoordinate GetLatestGeoCoordinateByUserNameAndDevice(string userName, Device device);
    }

    [DataContract(Namespace = "http://ZiZhuJY.Services.Location")]
    public class GeoCoordinate
    {
        /// <summary>
        /// Gets the altitude of the GeoCoordinate, in meters.
        /// </summary>
        [DataMember]
        public double Altitude { get; set; }

        /// <summary>
        /// Gets or sets the heading in degrees, relative to true north.
        /// </summary>
        [DataMember]
        public double Course { get; set; }

        /// <summary>
        /// Gets or sets the accuracy of the latitude and longitude that is given by the GeoCoordinate, in meters.
        /// </summary>
        [DataMember]
        public double HorizontalAccuracy { get; set; }

        /// <summary>
        /// Gets or sets the latitude of the GeoCoordinate.
        /// </summary>
        [DataMember]
        public double Latitude { get; set; }

        /// <summary>
        /// Gets or sets the longitude of the GeoCoordinate.
        /// </summary>
        [DataMember]
        public double Longitude { get; set; }

        /// <summary>
        /// Gets or sets the speed in meters per second.
        /// </summary>
        [DataMember]
        public double Speed { get; set; }

        /// <summary>
        /// Gets or sets the accuracy of the altitude given by the GeoCoordinate, in meters.
        /// </summary>
        [DataMember]
        public double VerticalAccruracy { get; set; }

        [DataMember]
        public DateTime TimeStamp { get; set; }

        [DataMember]
        public string Remark { get; set; }

        public GeoCoordinate() { }

        public GeoCoordinate(double latitude, double longtitude)
        {
            this.Latitude = latitude;
            this.Longitude = longtitude;
            this.TimeStamp = DateTime.Now;
        }
    }

    [DataContract(Namespace = "http://ZiZhuJY.Services.Location")]
    public class Device
    {
        [DataMember]
        public string DeviceName { get; set; }
    }

    [DataContract(Namespace="http://ZiZhuJY.Services.Location")]
    public class IdentifiedDevice
    {
        [DataMember]
        public string UserName { get; set; }
        [DataMember]
        public Device Device { get; set; }

        public IdentifiedDevice(string userName, Device device)
        {
            this.UserName = userName;
            this.Device = device;
        }

        #region For this class would be used as dictionary key, this region is very important to avoid the problem that Dictionary.ContainsKey() always return false when the key is of this class
        public override string ToString()
        {
            return string.Format("{0}<{1}>", this.UserName, this.Device.DeviceName);
        }

        public override bool Equals(object obj)
        {
            return obj.ToString().Equals(this.ToString());
        }

        public override int GetHashCode()
        {
            return this.ToString().GetHashCode();
        }
        #endregion
    }
}
