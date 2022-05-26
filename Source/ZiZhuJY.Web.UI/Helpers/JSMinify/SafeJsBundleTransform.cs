using System;
using System.Collections.Generic;
using System.Text;
using System.Web.Optimization;
using Microsoft.Ajax.Utilities;

namespace ZiZhuJY.Web.UI.Helpers.JSMinify
{
    public class SafeJsBundleTransform : IBundleTransform
    {
        public void Process(BundleContext context, BundleResponse response)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (response == null)
            {
                throw new ArgumentNullException("response");
            }

            if (!context.EnableInstrumentation)
            {
                var codeSetting = new CodeSettings
                {
                    // Important to make it all safe, otherwise the function grapher would 
                    // run to problems which extensively uses window.eval("some expression").
                    EvalTreatment = EvalTreatment.MakeAllSafe,
                    PreserveImportantComments = false
                };

                var min = new Minifier();
                var content = min.MinifyJavaScript(response.Content, codeSetting);

                if (min.ErrorList.Count > 0)
                {
                    GenerateErrorResponse(response, min.ErrorList);
                }
                else
                {
                    response.Content = content;
                }
            }

            response.ContentType = "text/javascript";
        }

        internal static void GenerateErrorResponse(BundleResponse bundle, IEnumerable<object> errors)
        {
            var content = new StringBuilder();
            content.Append("/* ");
            content.AppendLine("MinifyError: ");
            foreach (object current in errors)
            {
                content.AppendLine(current.ToString());
            }
            content.AppendLine(" */");
            content.Append(bundle.Content);
            bundle.Content = content.ToString();
        }
    }
}