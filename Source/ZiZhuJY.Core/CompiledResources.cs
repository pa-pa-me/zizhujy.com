using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Resources;
using System.Text;
using System.Web;
using System.Linq;
using System.Reflection;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Core
{
    public sealed class CompiledResources
    {
        private static CompiledResources instance;
        private List<string> compiledResources = new List<string>();

        private CompiledResources()
        {
            LoadAllCompiledResources();
        }

        private void LoadAllCompiledResources()
        {
            var binFolder = HttpContext.Current.Server.MapPath("~/Bin");
            var resourceAssemblyFiles = Directory.GetFiles(binFolder, "ZiZhuJY.Web.UI.resources.dll", SearchOption.AllDirectories);

            foreach (var assembly in resourceAssemblyFiles.Select(Assembly.ReflectionOnlyLoadFrom))
            {
                compiledResources.AddRange(assembly.GetManifestResourceNames());
            }
        }

        public static CompiledResources GetInstance()
        {
            if (instance == null)
            {
                instance = new CompiledResources();
            }

            return instance;
        }

        public static string[] GetAvailableCulturesFor(string virtualPath, string resourceFolder = "App_LocalResources", bool guessDefault = true)
        {
            var resourcePath = string.Format("ZiZhuJY.Web.UI.Views.{0}.{1}",
                virtualPath.Substr("~/Views/".Length, virtualPath.IndexOf("/", "~/Views/".Length, StringComparison.OrdinalIgnoreCase)), resourceFolder);

            var pageName = virtualPath.Substring(virtualPath.LastIndexOf("/", StringComparison.OrdinalIgnoreCase) + 1);

            var resourceFullName = string.Format("{0}.{1}", resourcePath, pageName);

            var compiledResources = GetInstance().compiledResources;

            var cultures = compiledResources
                .Where(c => c.StartsWith(resourceFullName, StringComparison.OrdinalIgnoreCase))
                .Select(c => c.Substr(resourceFullName.Length + 1, c.LastIndexOf(".")))
                .ToList();

            if (guessDefault)
            {
                if (!cultures.Contains("zh-CN", StringComparer.OrdinalIgnoreCase))
                {
                    cultures.Add("zh-CN");
                }

                if (!cultures.Contains("en-US", StringComparer.OrdinalIgnoreCase))
                {
                    cultures.Add("en-US");
                }
            }

            return cultures.ToArray();
        }

        public static ResourceManager GetResourceManager(string virtualPath, string resourceFolder = "App_LocalResources", string fromAssembly = "ZiZhuJY.Web.UI")
        {
//            var binFolder = HttpContext.Current.Server.MapPath("~/Bin");
//            var assembly = Assembly.LoadFrom(Path.Combine(binFolder, fromAssembly + ".dll"));
//            var typeMap =
//                assembly.GetTypes()
//                    .Where(
//                        t =>
//                            t.Namespace != null &&
//                            t.Namespace.EndsWith(resourceFolder, StringComparison.OrdinalIgnoreCase))
//                    .ToDictionary(t => t.FullName, t => t, StringComparer.OrdinalIgnoreCase);

            var theView = virtualPath.Substr("~/Views/".Length,
                virtualPath.IndexOf("/", "~/Views/".Length, StringComparison.OrdinalIgnoreCase)).FirstLetterToUpper();

            var @namespace =
                "ZiZhuJY.Web.UI.Views.{0}.{1}".FormatWith(theView, resourceFolder);

            var typeName =
                virtualPath.Substring(virtualPath.LastIndexOf("/", StringComparison.OrdinalIgnoreCase) + 1)
                    .Replace(".cshtml", "_cshtml");

            var typeFullName = "{0}.{1}, {2}".FormatWith(@namespace, typeName, fromAssembly);

            var type = Type.GetType(typeFullName, false, true);

            if (type == null)
            {
                // Type not found
                throw new TypeLoadException(
                    "The resource type was not found when getting ResourceManager for vitual path '{0}'.{1}Type '{2}' was not found."
                        .FormatWith(virtualPath, Environment.NewLine, typeFullName));
            }
            
            var propertyInfo = type.GetProperty("ResourceManager",
                BindingFlags.Public | BindingFlags.Static | BindingFlags.GetProperty);

            if (propertyInfo == null)
            {
                throw new MissingFieldException(type.FullName, "ResourceManager");
            }

            var resourceManager = (ResourceManager) propertyInfo.GetValue(null, null);

            if (resourceManager == null)
            {
                throw new FieldAccessException(
                    "ResourceManager was not found for virtual path '{0}'.".FormatWith(virtualPath));
            }

            return resourceManager;
        }
    }
}
