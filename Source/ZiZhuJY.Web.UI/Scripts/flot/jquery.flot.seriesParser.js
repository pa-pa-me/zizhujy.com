/* Flot plugin that parses an input as a function and generate its plotting data for it in function graphing.

Copyright (c) 2013 http://zizhujy.com.
Licensed under the MIT license.

The series are accessed through the standard series options:

series: {
    input: 'y=1/x',
    inputType: 'autoDetect'
}
*/

(function ($) {
    function processSeries(plot, series, data_, datapoints) {
        var options = plot.getOptions();
        var handlers = {
            explicitFunctionFx: function (plot, series, data_, datapoints) {
                var axes = plot.getAxes();
                var xaxis = axes.xaxis;
                var yaxis = axes.yaxis;

                var inputParts = series.input.trim().split("=");
                if (inputParts && inputParts.length == 2) {
                    //var step = (xaxis.options.max - xaxis.options.min) / series.viewPortWidth;
                    var step = (xaxis.options.max - xaxis.options.min) / 50;
                    var data = [];

                    for (var x = xaxis.options.min; x <= xaxis.options.max; x += step) {
                        var y = eval(inputParts[1]);
                        data.push([x, y]);
                    }

                    data_ = data;
                    series.data = data;
                }
            }
        };

        if (series.input && options.seriesParserEnabled) {
            // parse series input, and return a function object contains
            //  function type
            //  is valid
            //  error message
            //
            var type = series.inputType;
            if (handlers[type])
                handlers[type](plot, series, data_, datapoints);
        }
    }

    function init(plot) {
        plot.hooks.processRawData.push(processSeries);
    }

    var options = { seriesParserEnabled: false };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'seriesParser',
        version: '1.0'
    });
})(jQuery);
