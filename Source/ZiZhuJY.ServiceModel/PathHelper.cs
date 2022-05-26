using System;
using System.Collections.Generic;
using System.Text;

namespace ZiZhuJY.ServiceModel
{
    /// <summary>
    /// Static class with path related methods.
    /// </summary>
    static class PathHelper
    {
        /// <summary>
        /// If the path is absolute is return as is, otherwise is combined with AppDomain.CurrentDomain.SetupInformation.ApplicationBase
        /// The path are always server relative path.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static string LocateServerPath(string path)
        {
            if (System.IO.Path.IsPathRooted(path) == false)
                path = System.IO.Path.Combine(AppDomain.CurrentDomain.SetupInformation.ApplicationBase, path);

            return path;
        }
    }
}
