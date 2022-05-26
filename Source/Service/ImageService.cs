using System;
using System.IO;
using System.ServiceModel;

namespace ZiZhuJY.Services
{
    public class ImageService : IImageService
    {
        public Stream GetRandomImageSegment(string vdir)
        {
            throw new NotImplementedException();
        }
    }

    [ServiceContract(Namespace = "http://ZiZhuJY.Services")]
    public interface IImageService
    {
        [OperationContract]
        System.IO.Stream GetRandomImageSegment(string vdir);
    }
}
