(function ($) {
    var options = {
        grid: {
            hoverable: true,
            clickable: true
        }
    };

    var previousPoint = null;

    function showTooltip(x, y, contents) {
        $("<div id='tooltip'>" + contents + "</div>").css({
            position: "absolute",
            display: "none",
            top: y + 5,
            left: x + 5,
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }

    function init(plot) {
        $(plot.getPlaceholder()).bind("plothover", function (event, pos, item) {
            if (item) {
                if (previousPoint != item.dataIndex) {

                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY,
                        String.format("({1}, {2}) <br />{0}", item.series.label, x, y));
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });

        $(plot.getPlaceholder()).bind("plotclick", function (event, pos, item) {
            if (item) {
                plot.highlight(item.series, item.datapoint);
            }
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "tooltip",
        version: "1.0"
    });
})(jQuery);