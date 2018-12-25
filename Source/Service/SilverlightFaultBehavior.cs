using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel.Configuration;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.ServiceModel.Channels;

namespace ZiZhuJY.Services
{
    public class SilverlightFaultBehavior : BehaviorExtensionElement, IEndpointBehavior
    {
        public void AddBindingParameters(ServiceEndpoint endpoint, System.ServiceModel.Channels.BindingParameterCollection bindingParameters)
        {
        }

        public void ApplyClientBehavior(ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.ClientRuntime clientRuntime)
        {
        }

        public void ApplyDispatchBehavior(ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.EndpointDispatcher endpointDispatcher)
        {
            SilverlightFaultMessageInspector inspector = new SilverlightFaultMessageInspector();
            endpointDispatcher.DispatchRuntime.MessageInspectors.Add(inspector);
        }

        public class SilverlightFaultMessageInspector : IDispatchMessageInspector
        {
            public object AfterReceiveRequest(ref System.ServiceModel.Channels.Message request, System.ServiceModel.IClientChannel channel, System.ServiceModel.InstanceContext instanceContext)
            {
                // Do nothing to the incoming message.
                return null;
            }

            public void BeforeSendReply(ref System.ServiceModel.Channels.Message reply, object correlationState)
            {
                if (reply.IsFault)
                {
                    HttpResponseMessageProperty property = new HttpResponseMessageProperty();

                    // Here the response code is changed to 200.
                    property.StatusCode = System.Net.HttpStatusCode.OK;

                    reply.Properties[HttpResponseMessageProperty.Name] = property;
                }
            }
        }

        public void Validate(ServiceEndpoint endpoint)
        {
        }

        public override Type BehaviorType
        {
            get { return typeof(SilverlightFaultBehavior); }
        }

        protected override object CreateBehavior()
        {
            return new SilverlightFaultBehavior();
        }
    }
}
