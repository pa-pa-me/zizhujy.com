using System.Linq;
using System.Web.Optimization;
using ZiZhuJY.Web.UI.Helpers.JSMinify;

namespace ZiZhuJY.Web.UI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
#if DEBUG
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true;
#endif

            bundles.Add(new ScriptBundle("~/Scripts/Common/js")
//            .Include("~/Scripts/handsontable/touchpad/jquery.min.js")
                .Include("~/Scripts/jquery-1.8.3.js")
                //.Include("~/Scripts/jquery-1.9.0.js")
                //.Include("~/Scripts/jquery-ui/js/jquery-1.10.2.js")
                .Include("~/Scripts/zizhujy.com.js")
                .Include("~/Scripts/Globalize.js")
                .Include("~/Scripts/jquery-ui/js/jquery-ui-1.10.4.js")
                .Include("~/Scripts/select2/select2.js")
                .Include("~/Scripts/requireLite/requireLite.js")
                .Include("~/Scripts/common.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Math/js")
                .Include("~/Scripts/bigjs/big.js")
                .Include("~/Scripts/Maths/zizhujy.com.MathExtended.js")
                .Include("~/Scripts/Maths/zizhujy.com.IntervalArithmetic.js")
                .Include("~/Scripts/FunctionGrapher/functionSampler.js")
                .Include("~/Scripts/LaTex/zizhujy.com.LaTexLex.1.2.js")
                .Include("~/Scripts/LaTex/zizhujy.com.LaTexParser.1.2.js")
                .Include("~/Scripts/mathquill/mathquill.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Flot/js")
                .Include("~/Scripts/jquery.colorhelpers.js")
                .Include("~/Scripts/flot/flot/jquery.flot.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Flot/PluginsForFunctionGrapher/js")
                .Include("~/Scripts/drawing/canvas2image.js")
                .Include("~/Scripts/flot/coordinate/jquery.flot.coordinate.js")
                .Include("~/Scripts/flot/jquery.flot.plotSymbol.js")
                .Include("~/Scripts/flot/jquery.flot.symbol.js")
                .Include("~/Scripts/flot/saveAsImage/jquery.flot.saveAsImage.js")
                .Include("~/Scripts/flot/jquery.flot.navigate.js")
                .Include("~/Scripts/flot/navigationControl/jquery.flot.navigationControl.js")
                .Include("~/Scripts/flot/jquery.flot.resize.js")
                .Include("~/Scripts/flot/extendedForMath/jquery.flot.extendedForMath.js")
                .Include("~/Scripts/flot/jquery.flot.mathquillLegend.js")
                .Include("~/Scripts/flot/jquery.flot.tooltip.js"));

            bundles.Add(new StyleBundle("~/Content/commonStyles")
                .Include("~/Content/Baseline.css")
                .Include("~/Content/SimpleLayout.css")
                .Include("~/Content/themes/simple.css"));

            bundles.Add(new StyleBundle("~/Scripts/jquery-ui/css/smoothness/jquery-ui")
                .Include("~/Scripts/jquery-ui/css/smoothness/jquery-ui-1.10.4.custom.css"));

            bundles.Add(new ScriptBundle("~/Scripts/FunctionGrapher/js")
                .Include("~/Scripts/zizhujy.com.Console.js")
                .Include("~/Scripts/jquery.colorhelpers.js")
                .Include("~/Scripts/flot/flot/jquery.flot.js")
                .Include("~/Scripts/flot/coordinate/jquery.flot.coordinate.js")
                .Include("~/Scripts/flot/jquery.flot.seriesParser.js")
                .Include("~/Scripts/flot/jquery.flot.plotSymbol.js")
                .Include("~/Scripts/flot/jquery.flot.symbol.js")
                .Include("~/Scripts/LaTex/zizhujy.com.LaTexLex.1.2.js")
                .Include("~/Scripts/LaTex/zizhujy.com.LaTexParser.1.2.js")
                .Include("~/Scripts/json2.js")
                .Include("~/Scripts/bigjs/big.js")
                .Include("~/Scripts/Maths/zizhujy.com.MathExtended.js")
                .Include("~/Scripts/drawing/zizhujy.com.coordinate.js")
                .Include("~/Scripts/Maths/zizhujy.com.IntervalArithmetic.js")
                .Include("~/Scripts/FunctionGrapher/functionSampler.js")
                .Include("~/Scripts/flot/jquery.flot.navigate.js")
                .Include("~/Scripts/flot/jquery.flot.resize.js")
                .Include("~/Scripts/mathquill/mathquill.js")
                .Include("~/Scripts/base64.js")
                .Include("~/Scripts/drawing/canvas2image.js")
                .Include("~/Scripts/flot/jquery.flot.saveAsImage.js")
                .Include("~/Scripts/zizhujy.com.Collection.js")
                .Include("~/Scripts/zizhujy.com.DataTable.js")
                .Include("~/Scripts/flot/jquery.flot.mathquillLegend.js")
                .Include("~/Scripts/flot/navigationControl/jquery.flot.navigationControl.js"));

            bundles.Add(new StyleBundle("~/Content/css/FunctionGrapherStyles")
                .Include("~/Content/css/functionGrapherNewStyle.css")
                .Include("~/Content/css/tables.css"));

            bundles.Add(new StyleBundle("~/Content/appLayoutStyles")
                .Include("~/Content/AppLayout.css"));

            bundles.Add(new StyleBundle("~/Content/css/App/FunGrapherStyles")
                .Include("~/Content/css/Apps/FunGrapher.css")
                .Include("~/Content/css/tables.css"));

            bundles.Add(new ScriptBundle("~/Scripts/lz-string/js")
                .Include("~/Scripts/lz-string/base64-string.js")
                .Include("~/Scripts/lz-string/lz-string.js"));

            bundles.Add(new ScriptBundle("~/Scripts/skulpt/js")
                .Include("~/Scripts/skulptDist/base.js")
                .Include("~/Scripts/skulptDist/deps.js")
                .Include("~/Scripts/skulptDist/skulpt.js")
                .Include("~/Scripts/skulptDist/skulpt-stdlib.js")
                .Include("~/Scripts/skulptDist/processing.js"));

            if (!BundleTable.EnableOptimizations)
            {
                foreach (var bundle in BundleTable.Bundles)
                {
                    bundle.Transforms.Clear();
                }
            }
            else
            {
                foreach (var bundle in BundleTable.Bundles.OfType<ScriptBundle>())
                {
                    bundle.Transforms.Clear();
                    bundle.Transforms.Add(new SafeJsBundleTransform());
                }
            }
        }
    }
}