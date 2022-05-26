(function ($) {
    $(document).ready(function () {
        //        var urlParams = {};
        //        (function () {
        //            var e,
        //                    a = /\+/g,  // Regex for replacing addition symbol with a space
        //                    r = /([^&=]+)=?([^&]*)/g,
        //                    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        //                    q = window.location.search.substring(1);

        //            while (e = r.exec(q))
        //                urlParams[d(e[1])] = d(e[2]);
        //        })();

        var urlParams = zizhujy.com.deserializeUrlParams();
        if (urlParams != null) {
            if (typeof urlParams.fn == "string" && urlParams.fn.trim() != "") {
                $("#taFunctionList").val(urlParams.fn);
                if (typeof urlParams.xMin == "string" && urlParams.xMin.trim() != "") $("#txtXmin").val(urlParams.xMin);
                if (typeof urlParams.xMax == "string" && urlParams.xMax.trim() != "") $("#txtXmax").val(urlParams.xMax);
                if (typeof urlParams.yMin == "string" && urlParams.yMin.trim() != "") $("#txtYmin").val(urlParams.yMin);
                if (typeof urlParams.yMax == "string" && urlParams.yMax.trim() != "") $("#txtYmax").val(urlParams.yMax);
                if (typeof urlParams.tMin == "string" && urlParams.tMin.trim() != "") $("#txtTmin").val(urlParams.tMin);
                if (typeof urlParams.tMax == "string" && urlParams.tMax.trim() != "") $("#txtTmax").val(urlParams.tMax);
            } else if (typeof urlParams.functions == "string" && urlParams.functions.trim() != "") {
                // 与老版本兼容：
                $("#taFunctionList").val(urlParams.functions);
                if (typeof urlParams.minOfx == "string" && urlParams.minOfx.trim() != "") $("#txtXmin").val(urlParams.minOfx);
                if (typeof urlParams.maxOfx == "string" && urlParams.maxOfx.trim() != "") $("#txtXmax").val(urlParams.maxOfx);
                if (typeof urlParams.minOfy == "string" && urlParams.minOfy.trim() != "") $("#txtYmin").val(urlParams.minOfy);
                if (typeof urlParams.maxOfy == "string" && urlParams.maxOfy.trim() != "") $("#txtYmax").val(urlParams.maxOfy);
                if (typeof urlParams.minOft == "string" && urlParams.minOft.trim() != "") $("#txtTmin").val(urlParams.minOft);
                if (typeof urlParams.maxOft == "string" && urlParams.maxOft.trim() != "") $("#txtTmax").val(urlParams.maxOft);
            }
        }
        var funGrapher = new JFunGrapher();
        funGrapher.handleHelp();

        funGrapher.ui.autoResize = function () {
            var $Parent = funGrapher.ui.$Canvas.parent();
            var parentWidth = $Parent.width();

            var percentageWidth = 0.99;

            // Make the funGrapher.ui.$Canvas percentage width to permit it to resize
            funGrapher.ui.$Canvas.css("width", (percentageWidth * 100) + "%");
            funGrapher.ui.$Canvas.css("height", (parentWidth * percentageWidth) + "px");

            return parentWidth * percentageWidth;
        };

        function autoResizeUI() {
            var canvasHeight = funGrapher.ui.autoResize();

            $("#taFunctionList").css("height", canvasHeight * 0.4 + "px");
        }

        autoResizeUI();

        $(window).resize(function () {
            autoResizeUI();
        });

        $("#aGetLink").click(function () {
            var link = window.location;
            var host = link.host;
            var path = link.pathname;
            link = "http://" + host + path;

            var fn = encodeURI($("#taFunctionList").val());
            var xMin = encodeURI($("#txtXmin").val());
            var xMax = encodeURI($("#txtXmax").val());
            var yMin = encodeURI($("#txtYmin").val());
            var yMax = encodeURI($("#txtYmax").val());
            var tMin = encodeURI($("#txtTmin").val());
            var tMax = encodeURI($("#txtTmax").val());

            link += String.format("?fn={0}&xMin={1}&xMax={2}&yMin={3}&yMax={4}&tMin={5}&tMax={6}", fn, xMin, xMax, yMin, yMax, tMin, tMax);

            $("#link").val(link);
            $("#linkDialog").show();
            $("#link").select();
        });
    });
})(jQuery);