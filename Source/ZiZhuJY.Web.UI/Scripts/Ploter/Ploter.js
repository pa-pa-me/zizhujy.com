(function () {
    function ploter(culture, language) {
        // Prepare jPloter
        var graphBoardId = "divGraffiti";
        var inputBoardId = "taExpression";
        var graphButtonId = "btnGraph";
        var resetButtonId = "btnReset";
        var shareButtonId = "btnShare";
        var linkButtonId = "btnLink";
        var linkTextBoxId = "txtLink";
        var statsDivId = "divStats";
        var chkLinearFitId = "chkLinearFit";
        var chkQuadraticFitId = "chkQuadraticFit";
        var chkCubicFitId = "chkCubicFit";
        var chkPolynomialFit = "chkPolynomialFit";
        var txtPower = "txtPower";

        var options = {                
            zoom: {
                interactive: true
            },
            pan: {
                interactive: true
            }, 
            series: {
                lines: { show: false },
                points: { show: true }
            },
        };

        var jPloter = new window.JPloter(graphBoardId, inputBoardId, graphButtonId, resetButtonId, shareButtonId, linkButtonId, linkTextBoxId, statsDivId, chkLinearFitId, chkQuadraticFitId, chkCubicFitId, chkPolynomialFit, txtPower, culture, 1, options);
            
        window.jPloter = jPloter;

        jPloter.ui.$GraphBoard.bind("plotpan", function(event, plot){
        });

        jPloter.ui.$GraphBoard.bind("plotzoom", function(event, plot) {
        });

        // Prepare editor
        if(!$.browser.msie) {   
            window.EditAreaCallbacks = {};
            window.EditAreaCallbacks.updateExpression = function() {
                var id = arguments[0];
                $("#" + id).val(editAreaLoader.getValue(id));

                $("#" + id).trigger("change");
            };

            editAreaLoader.init({
                id: "taExpression"	// id of the textarea to transform		
			        , start_highlight: true	// if start with highlight
			        , allow_resize: "both"
			        , allow_toggle: true
			        , word_wrap: true
                    , language: language
			        /*, language: "zh"*/
			        , syntax: "js"
                    , change_callback: "EditAreaCallbacks.updateExpression"
            });    

            editAreaLoader.init({
                id: "xValues"	// id of the textarea to transform		
			        , start_highlight: false	// if start with highlight
			        , allow_resize: "both"
			        , allow_toggle: true
			        , word_wrap: true
                    , language: language
			        /*, language: "zh"*/
			        , syntax: "js"
                    , min_width: 200
                    , toolbar: "*"
                    , change_callback: "EditAreaCallbacks.updateExpression"                
            });

            editAreaLoader.init({
                id: "yValues"	// id of the textarea to transform		
			    , start_highlight: false	// if start with highlight
			    , allow_resize: "both"
			    , allow_toggle: true
			    , word_wrap: true
                , language: language
			    /*, language: "zh"*/
			    , syntax: "js"
                , min_width: 200
                , toolbar: "*"
                , change_callback: "EditAreaCallbacks.updateExpression"                
            });
        }   
    }

    window.ploter = ploter;
})();