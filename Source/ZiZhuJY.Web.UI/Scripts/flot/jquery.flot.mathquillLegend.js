/* Flot plugin that makes the legend containing math expressions be more beautiful.

Copyright (c) 2013 http://zizhujy.com.
Licensed under the MIT license.

Usage:
Inside the <head></head> area of your html page, add the following lines:

<link href="http://zizhujy.com/Scripts/mathquill/mathquill.css" rel="Stylesheet" type="text/css" />    
<script type="text/javascript" src="http://zizhujy.com/Scripts/mathquill/mathquill.js"></script>
<script type="text/javascript" src="http://zizhujy.com/Scripts/flot/jquery.flot.mathquillLegend.js"></script>

Now you are all set. The legend on your charts will be rendered more beautiful if contains math expressions.

Online examples:
http://zizhujy.com/FunctionGrapher is using it.

Dependencies:
This plugin references the mathquill.css and mathquill.js

*/

; (function ($) {
    function prepare() {
        var extended = false;
        
        function extend(plot, extendOptions) {
            if (!plot.extendedBy || !plot.extendedBy.indexOf("jquery.flot.mathquillLegend") < 0) {
                var setupGrid = plot.setupGrid;

                plot.setupGrid = function () {
                    setupGrid();
                    mathquillLegend(plot, plot.getCanvas());
                };
            }

            return plot;
        }

        var originPlot = $.plot;

        if (!extended) {

            $.plot = function (placeholder, data, options) {
                var plot = extend(originPlot(placeholder, data, options), options);
                window.testPlot = plot;

                plot.extendedBy = plot.extendedBy || [];
                plot.extendedBy.push("jquery.flot.mathquillLegend");
                return plot;
            };
            
            for (var p in originPlot) {
                $.plot[p] = originPlot[p];
            }
            
            $.plot.extendedBy = $.plot.extendedBy || [];
            $.plot.extendedBy.push("jquery.flot.mathquillLegend");

            extended = true;
        }
    }

    prepare();
    
    function mathquillLegend(plot, canvasContext) {
        $(".mathquill-embedded-latex").mathquill();
        // recalculate the legend width and height:
        var $legendTable = $("div.legend > table");
        var $legendBackground = $("div.legend > div");
        $legendBackground.width($legendTable.outerWidth());
        $legendBackground.height($legendTable.outerHeight());
    }
    
    //$.plot.plugins.push({
    //    init: function(plot) {
    //        plot.hooks.draw.push(mathquillLegend);
    //    },
    //    name: "mathquillLegend",
    //    version: "1.2"
    //});
})(jQuery);