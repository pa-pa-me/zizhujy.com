using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Web.Script.Serialization;

namespace ZiZhuJY.Helpers
{
    public static class ObjectExtensions
    {
        public static string ToJson(this object o)
        {
            var jsSerializer = new JavaScriptSerializer();
            var json = jsSerializer.Serialize(o);

            return json;
        }

        /// <summary>
        /// Calculate the length in bytes of an object roughly
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        public static int GetRoughSize(this object o)
        {
            var ms = new MemoryStream();
            try
            {
                new BinaryFormatter().Serialize(ms, o);

                return ms.ToArray().Length;
            }
            catch
            {
                return -1;
            }
        }
    }
}
