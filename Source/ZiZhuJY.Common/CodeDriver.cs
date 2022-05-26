using Microsoft.CSharp;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using ZiZhuJY.Common.Extensions;

namespace ZiZhuJY.Common
{
    public sealed class CodeDriver : MarshalByRefObject
    {
        public string CompileAndRun(string input, out bool hasError, string @namespace = "", string type = "Immediate", string libDirectory = "")
        {
            hasError = false;
            string returnData = null;

            CompilerResults results = null;
            using (var provider = new CSharpCodeProvider())
            {
                var options = new CompilerParameters { GenerateInMemory = true };

                const string referencedDirectory = @"C:\Program Files (x86)\Reference Assemblies";
                var subDirectories = Directory.GetDirectories(referencedDirectory);

                options.CompilerOptions =
                    "/lib:{0}".FormatWith(string.Join(",", subDirectories.Select(d => @"""{0}""".FormatWith(d))));

                if (!string.IsNullOrWhiteSpace(libDirectory))
                {
                    options.CompilerOptions += string.Format(@",""{0}""", libDirectory);
                }

                options.CompilerOptions += " /r:System.dll;System.Data.Entity.dll;System.Core.dll";

                if (!string.IsNullOrWhiteSpace(libDirectory))
                {
                    var files = Directory.GetFiles(libDirectory, "*.dll", SearchOption.TopDirectoryOnly);
                    if (files.Length > 0)
                    {
                        options.CompilerOptions += " /r:{0}".FormatWith(string.Join(";", files));
                    }
                }

                var sb = new StringBuilder();
                sb.Append(input);

                results = provider.CompileAssemblyFromSource(
                    options, sb.ToString());
            }

            if (results.Errors.HasErrors)
            {
                hasError = true;
                var errorMessage = new StringBuilder();
                foreach (CompilerError error in results.Errors)
                {
                    errorMessage.AppendFormat("{0} {1}", error.Line, error.ErrorText);
                }

                returnData = errorMessage.ToString();
            }
            else
            {
                TextWriter temp = Console.Out;
                var writer = new StringWriter();
                Console.SetOut(writer);
                Type driverType = results.CompiledAssembly.GetType(
                    "{0}{1}".FormatWith(
                        string.IsNullOrWhiteSpace(@namespace)
                            ? string.Empty
                            : "{0}.".FormatWith(@namespace),
                        type));

                driverType.InvokeMember("Run",
                    System.Reflection.BindingFlags.InvokeMethod | System.Reflection.BindingFlags.Static |
                    System.Reflection.BindingFlags.Public, null, null, null);
                Console.SetOut(temp);

                returnData = writer.ToString();
            }

            return returnData;
        }
    }
}
