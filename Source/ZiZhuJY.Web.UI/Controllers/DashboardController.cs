using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Microsoft.Web.Administration;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Authorize(Roles = "Administrators")]
    public class DashboardController : Controller
    {
        //
        // GET: /Dashboard/

        public ActionResult Index()
        {
            dynamic model = new ExpandoObject();
            model.ApplicationPools = new List<ExpandoObject>();

            try
            {
                using (var localServer = new ServerManager())
                {
                    var config = localServer.GetApplicationHostConfiguration();
                    var appPoolConfigSection = config.GetSection("system.applicationHost/applicationPools");
                    var appPoolCollection = appPoolConfigSection.GetCollection();

                    #region appPoolCollection

                    foreach (var element in appPoolCollection)
                    {
                        dynamic appPoolConfig = new ExpandoObject();

                        appPoolConfig.Name = element.GetAttributeValue("name").ToString();
                        appPoolConfig.PipelineMode = element.GetAttributeValue("managedPipelineMode").ToString();

                        var processModel = element.GetChildElement("processModel");
                        appPoolConfig.AppPoolIdentity = processModel.GetAttributeValue("userName");

                        var recycling = element.GetChildElement("recycling");
                        var periodicRecyclingSettings = recycling.GetChildElement("periodicRestart");

                        appPoolConfig.PeriodicRecyclingParameters = new ExpandoObject();
                        appPoolConfig.PeriodicRecyclingParameters.Memory =
                            periodicRecyclingSettings.GetAttributeValue("memory");
                        appPoolConfig.PeriodicRecyclingParameters.PrivateMemory =
                            periodicRecyclingSettings.GetAttributeValue("privateMemory");
                        appPoolConfig.PeriodicRecyclingParameters.Requests =
                            periodicRecyclingSettings.GetAttributeValue("requests");
                        appPoolConfig.PeriodicRecyclingParameters.Time =
                            periodicRecyclingSettings.GetAttributeValue("time");

                        model.ApplicationPools.Add(appPoolConfig);
                    }

                    #endregion
                }
            }
            catch (Exception ex)
            {
                model.Exception = ex;
            }

            return View(model);
        }

        public ActionResult HttpRuntimeCacheMonitor()
        {
            dynamic model = new ExpandoObject();
            model.Cache = HttpRuntime.Cache;

            return View(model);
        }

        public ActionResult Immediate()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Immediate(string input, string usings = "")
        {
            var codeDriver = new Common.CodeDriver();
            bool hasError;

            var source = new StringBuilder();
            source.Append(@"
using System;
");
            source.Append(usings);
            source.Append(@"
namespace ZiZhuJY.Web.UI.Controllers.ImmediateCode {
    public class ImmediateCode {
        public static void Run () {
");
            source.Append(input);
            source.Append(@"
        }
    }
}
");

            var result =
                codeDriver.CompileAndRun(source.ToString(), out hasError, "ZiZhuJY.Web.UI.Controllers.ImmediateCode",
                    "ImmediateCode",
                    Server.MapPath("~/Bin"));

            return Content(result);
        }
    }
}
