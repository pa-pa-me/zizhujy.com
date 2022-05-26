/* Flot plugin that adds some extra symbols for plotting points in function graphing.

Copyright (c) 2013 http://zizhujy.com.
Licensed under the MIT license.

The symbols are accessed as strings through the standard symbol options:

    series: {
        points: {
            symbol: "point"
        }
    }
*/

(function ($) {
    function processRawData(plot, series, datapoints) {
        var handlers = {
            point: function (ctx, x, y, radius, shadow) {
                //var size = radius * Math.sqrt(Math.PI) / 2;
                var size = radius;
                ctx.rect(x - size, y - size, size * 2, size * 2);
            },

            pixel: function (ctx, x, y, radius, shadow) {
                var size = radius;
                ctx.rect(x, y, size, size);
            }
        };

        var s = series.points.symbol;
        if (handlers[s])
            series.points.symbol = handlers[s];
    }

    function init(plot) {
        plot.hooks.processDatapoints.push(processRawData);
    }

    $.plot.plugins.push({
        init: init,
        name: 'plotSymbols',
        version: '1.0'
    });
})(jQuery);