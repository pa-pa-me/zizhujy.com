(function () {
    function functionGraffiti(culture, language) {
        // Prepare jGraffiti
        var graphBoardId = "divGraffiti";
        var inputBoardId = "taExpression";
        var xMinId = "txtMinOfx";
        var xMaxId = "txtMaxOfx";
        var yMinId = "txtMinOfy";
        var yMaxId = "txtMaxOfy";
        var tMinId = "txtMinOft";
        var tMaxId = "txtMaxOft";
        var pointsCountId = "txtPointsCount";
        var graphButtonId = "btnGraph";
        var resetButtonId = "btnReset";
        var shareButtonId = "btnShare";
        var linkButtonId = "btnLink";
        var linkTextBoxId = "txtLink";
        var chkLegendId = "chkLegend";

        var options = {
            zoom: {
                interactive: true
            },
            pan: {
                interactive: true
            }
        };

        var jGraffiti = new window.JGraffiti(graphBoardId, inputBoardId, xMinId, xMaxId, yMinId, yMaxId, tMinId, tMaxId, pointsCountId, graphButtonId, resetButtonId, shareButtonId, linkButtonId, linkTextBoxId, chkLegendId, culture, 1, options);

        window.jGraffiti = jGraffiti;

        jGraffiti.ui.$GraphBoard.bind("plotpan", function (event, plot) {
            var axes = plot.getAxes();
            jGraffiti.ui.RangeX.$Min.val(axes.xaxis.min.toFixed(2));
            jGraffiti.ui.RangeX.$Max.val(axes.xaxis.max.toFixed(2));
            jGraffiti.ui.RangeY.$Min.val(axes.yaxis.min.toFixed(2));
            jGraffiti.ui.RangeY.$Max.val(axes.yaxis.max.toFixed(2));
            jGraffiti.run();
        });

        jGraffiti.ui.$GraphBoard.bind("plotzoom", function (event, plot) {
            var axes = plot.getAxes();
            jGraffiti.ui.RangeX.$Min.val(axes.xaxis.min.toFixed(2));
            jGraffiti.ui.RangeX.$Max.val(axes.xaxis.max.toFixed(2));
            jGraffiti.ui.RangeY.$Min.val(axes.yaxis.min.toFixed(2));
            jGraffiti.ui.RangeY.$Max.val(axes.yaxis.max.toFixed(2));
            jGraffiti.run();
        });

        $("#chkAutoYRange").click(function () {
            jGraffiti.config.autoComputeRangeY = $(this).attr("checked");
        });

        jGraffiti.ui.readAttributes();
        //$("#chkAutoYRange").trigger("click");
        jGraffiti.config.autoComputeRangeY = $("#chkAutoYRange").attr("checked");
        jGraffiti.run();

        // and add panning buttons

        // little helper for taking the repetitive work out of placing
        // panning arrows
        //            function addArrow(dir, right, top, offset) {
        //                $('<img class="button" src="@Url.Content("~/Content/Images/")arrow-' + dir + '.gif" style="right:' + right + 'px;top:' + top + 'px">').appendTo(jGraffiti.ui.$GraphBoard).click(function (e, plot) {
        //                    e.preventDefault();
        //                    plot.pan(offset);
        //                });
        //            }

        //            addArrow('left', 55, 60, { left: -100 });
        //            addArrow('right', 25, 60, { left: 100 });
        //            addArrow('up', 40, 45, { top: -100 });
        //            addArrow('down', 40, 75, { top: 100 });

        // Prepare editor
        if (!$.browser.msie) {
            editAreaLoader.init({
                id: "taExpression"	// id of the textarea to transform		
			        , start_highlight: true	// if start with highlight
			        , allow_resize: "both"
			        , allow_toggle: true
			        , word_wrap: true
                    , language: language
                /*, language: "zh"*/
			        , syntax: "js"
            });
        }

        // highlight
        SyntaxHighlighter.all();
    }

    window.functionGraffiti = functionGraffiti;
})();