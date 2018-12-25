(function ($) {
    function init(plot) {
        var debugLevel = 1;

        function checkDebugEnabled(plot, options) {
            if (options.debug) {
                debugLevel = options.debug;
                plot.hooks.processDatapoints.push(alertSeries);
            }
        }

        function alertSeries(plot, series, datapoints) {
            var msg = "series " + series.label;
            if (debugLevel > 1) {
                if ($("#debugDataArea").length > 0) {
                    $("#debugDataArea").remove();
                }

                var data = "<div style='float: none; clear: both;' id='debugDataArea'><table border=1><thead><tr><th>#</th><th>x</th><th>y</th></tr></thead><tbody>{0}</tbody></table></div>";
                var row = "<tr><td>{2}</td><td>{0}</td><td>{1}</td></tr>";
                var sb = new StringBuffer();
                for (var i = 0; i < series.data.length; i++) {
                    sb.append(row.format(
                        !!series.data ? !!series.data[i] ? series.data[i][0] : "null" : "null",
                        !!series.data ? !!series.data[i] ? series.data[i][1] : "null" : "null",
                        i));
                }
                $(data.format(sb.toString())).insertAfter("body > div:last-child");
            }
        }

        plot.hooks.processOptions.push(checkDebugEnabled);
    }

    var options = { debug: 1 };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "simpledebug",
        version: "0.1"
    });
})(jQuery);