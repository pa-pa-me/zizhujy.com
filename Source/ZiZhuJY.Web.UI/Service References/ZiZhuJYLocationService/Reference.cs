﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ZiZhuJY.Web.UI.ZiZhuJYLocationService {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="Device", Namespace="http://ZiZhuJY.Services.Location")]
    [System.SerializableAttribute()]
    public partial class Device : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string DeviceNameField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string DeviceName {
            get {
                return this.DeviceNameField;
            }
            set {
                if ((object.ReferenceEquals(this.DeviceNameField, value) != true)) {
                    this.DeviceNameField = value;
                    this.RaisePropertyChanged("DeviceName");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="GeoCoordinate", Namespace="http://ZiZhuJY.Services.Location")]
    [System.SerializableAttribute()]
    public partial class GeoCoordinate : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double AltitudeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double CourseField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double HorizontalAccuracyField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double LatitudeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double LongitudeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string RemarkField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double SpeedField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private System.DateTime TimeStampField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double VerticalAccruracyField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double Altitude {
            get {
                return this.AltitudeField;
            }
            set {
                if ((this.AltitudeField.Equals(value) != true)) {
                    this.AltitudeField = value;
                    this.RaisePropertyChanged("Altitude");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double Course {
            get {
                return this.CourseField;
            }
            set {
                if ((this.CourseField.Equals(value) != true)) {
                    this.CourseField = value;
                    this.RaisePropertyChanged("Course");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double HorizontalAccuracy {
            get {
                return this.HorizontalAccuracyField;
            }
            set {
                if ((this.HorizontalAccuracyField.Equals(value) != true)) {
                    this.HorizontalAccuracyField = value;
                    this.RaisePropertyChanged("HorizontalAccuracy");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double Latitude {
            get {
                return this.LatitudeField;
            }
            set {
                if ((this.LatitudeField.Equals(value) != true)) {
                    this.LatitudeField = value;
                    this.RaisePropertyChanged("Latitude");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double Longitude {
            get {
                return this.LongitudeField;
            }
            set {
                if ((this.LongitudeField.Equals(value) != true)) {
                    this.LongitudeField = value;
                    this.RaisePropertyChanged("Longitude");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Remark {
            get {
                return this.RemarkField;
            }
            set {
                if ((object.ReferenceEquals(this.RemarkField, value) != true)) {
                    this.RemarkField = value;
                    this.RaisePropertyChanged("Remark");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double Speed {
            get {
                return this.SpeedField;
            }
            set {
                if ((this.SpeedField.Equals(value) != true)) {
                    this.SpeedField = value;
                    this.RaisePropertyChanged("Speed");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public System.DateTime TimeStamp {
            get {
                return this.TimeStampField;
            }
            set {
                if ((this.TimeStampField.Equals(value) != true)) {
                    this.TimeStampField = value;
                    this.RaisePropertyChanged("TimeStamp");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double VerticalAccruracy {
            get {
                return this.VerticalAccruracyField;
            }
            set {
                if ((this.VerticalAccruracyField.Equals(value) != true)) {
                    this.VerticalAccruracyField = value;
                    this.RaisePropertyChanged("VerticalAccruracy");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="IdentifiedDevice", Namespace="http://ZiZhuJY.Services.Location")]
    [System.SerializableAttribute()]
    public partial class IdentifiedDevice : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device DeviceField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string UserNameField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device Device {
            get {
                return this.DeviceField;
            }
            set {
                if ((object.ReferenceEquals(this.DeviceField, value) != true)) {
                    this.DeviceField = value;
                    this.RaisePropertyChanged("Device");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string UserName {
            get {
                return this.UserNameField;
            }
            set {
                if ((object.ReferenceEquals(this.UserNameField, value) != true)) {
                    this.UserNameField = value;
                    this.RaisePropertyChanged("UserName");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(Namespace="http://ZiZhuJY.Services.Location", ConfigurationName="ZiZhuJYLocationService.ILocationService")]
    public interface ILocationService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://ZiZhuJY.Services.Location/ILocationService/UpdateGeoCoordinate", ReplyAction="http://ZiZhuJY.Services.Location/ILocationService/UpdateGeoCoordinateResponse")]
        void UpdateGeoCoordinate(ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device device, ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate geoCoor);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinateByDevice", ReplyAction="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinateByDeviceR" +
            "esponse")]
        ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate GetLatestGeoCoordinateByDevice(ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device device);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinates", ReplyAction="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinatesResponse" +
            "")]
        System.Collections.Generic.Dictionary<ZiZhuJY.Web.UI.ZiZhuJYLocationService.IdentifiedDevice, ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate> GetLatestGeoCoordinates();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinatesByUserNa" +
            "me", ReplyAction="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinatesByUserNa" +
            "meResponse")]
        System.Collections.Generic.Dictionary<ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device, ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate> GetLatestGeoCoordinatesByUserName(string userName);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinateByUserNam" +
            "eAndDevice", ReplyAction="http://ZiZhuJY.Services.Location/ILocationService/GetLatestGeoCoordinateByUserNam" +
            "eAndDeviceResponse")]
        ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate GetLatestGeoCoordinateByUserNameAndDevice(string userName, ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device device);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface ILocationServiceChannel : ZiZhuJY.Web.UI.ZiZhuJYLocationService.ILocationService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class LocationServiceClient : System.ServiceModel.ClientBase<ZiZhuJY.Web.UI.ZiZhuJYLocationService.ILocationService>, ZiZhuJY.Web.UI.ZiZhuJYLocationService.ILocationService {
        
        public LocationServiceClient() {
        }
        
        public LocationServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public LocationServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public LocationServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public LocationServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public void UpdateGeoCoordinate(ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device device, ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate geoCoor) {
            base.Channel.UpdateGeoCoordinate(device, geoCoor);
        }
        
        public ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate GetLatestGeoCoordinateByDevice(ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device device) {
            return base.Channel.GetLatestGeoCoordinateByDevice(device);
        }
        
        public System.Collections.Generic.Dictionary<ZiZhuJY.Web.UI.ZiZhuJYLocationService.IdentifiedDevice, ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate> GetLatestGeoCoordinates() {
            return base.Channel.GetLatestGeoCoordinates();
        }
        
        public System.Collections.Generic.Dictionary<ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device, ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate> GetLatestGeoCoordinatesByUserName(string userName) {
            return base.Channel.GetLatestGeoCoordinatesByUserName(userName);
        }
        
        public ZiZhuJY.Web.UI.ZiZhuJYLocationService.GeoCoordinate GetLatestGeoCoordinateByUserNameAndDevice(string userName, ZiZhuJY.Web.UI.ZiZhuJYLocationService.Device device) {
            return base.Channel.GetLatestGeoCoordinateByUserNameAndDevice(userName, device);
        }
    }
}
