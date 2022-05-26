
$(document).ready(function () {
    var data = [
        [1900, 10.83],
        [1904, 11.48],
        [1908, 12.17],
        [1912, 12.96],
        [1920, 13.42],
        [1924, 12.96],
        [1928, 13.77],
        [1932, 14.15],
        [1936, 14.27],
        [1948, 14.1],
        [1952, 14.92],
        [1956, 14.96],
        [1960, 15.42],
        [1964, 16.73],
        [1968, 17.71],
        [1972, 18.04],
        [1976, 18.04],
        [1980, 18.96],
        [1984, 18.85],
        [1988, 19.77],
        [1992, 19.02],
        [1996, 19.42]
    ];

    var $dataTableContainer = $('#data-area');
    $dataTableContainer.handsontable({
//        data: data,
        minSpareRows: 1,
        colHeaders: ['x', 'y'],
        cols: 2,
        rowHeaders: true,
        contextMenu: true,
//        currentRowClassName: 'currentRow',
//        currentColClassName: 'currentCol',
        autoWrapRow: true,
//        cells: function (row, col, prop) {
//            var cellProperties = {};
//            cellProperties.renderer = defaultValueRenderer;
//            return cellProperties;
//        },
        Controller: true
    });

    $dataTableContainer.handsontable('loadData', data); 

//    $dataTableContainer.find("table")
//        .addClass('table')
//        .addClass('table-striped')
//        .addClass('table-hover');

    function isEmptyRow(instance, row) {
        var rowData = instance.getData()[row];
        for (var i = 0, ilen = rowData.length; i < ilen; i++) {
            if (rowData[i] !== null) {
                return false;
            }
        }
        return true;
    }

    function defaultValueRenderer(instance, td, row, col, prop, value, cellProperties) {
        var args = $.extend(true, [], arguments);
        if (args[5] === null && isEmptyRow(instance, row)) {
            //args[5] = tpl[col];
            args[5] = '';
            td.style.color = '#999';
        }
        else {
            td.style.color = '';
        }
        Handsontable.renderers.TextRenderer.apply(this, args);
    }
    
    // jPloter the controller :)
    var jPloter = null;
    var uiSettings = {
        statsFormat: "",
        fitFormat: ""
    };

    if (!window.console) {
        window.console = new zizhujy.com.console("#log");
    }

    // Button Plot clicked
    $("#btnPlot").click(btnPlotClicked);
    // Button Clear clicked
    $("#btnClear").click(btnClearClicked);
    // Button estimate/predict clicked
    $("#btnEsitmateAndPredict").click(btnEsitmateAndPredictClicked);
    // Fit checkboxes changed
    $("#chkLinearFit").change(chkLinearFitChanged);
    $("#chkQuadraticFit").change(chkQuadraticFitChanged);
    $("#chkCubicFit").change(chkCubicFitChanged);
    $("#chkExpFit").change(chkExpFitChanged);
    $("#chkLogFit").change(chkLogFitChanged);
    $("#chkPolynomialFit").change(chkPolynomialFitChanged);
    $("#txtPower").change(chkPolynomialFitChanged);

    // update ui automatically
    //$("#data-area").change(taDataPointsChanged);
    $("#txtX").keyup(function () {
        updateFits();
    });

    $(window).resize(function() {
        //var ht = $("#data-area").handsontable('getInstance');
        //ht.render();
    });

    readUISettings();

    go(function () {
        // Initialize
        $("#chkLinearFit").attr("checked", "checked").trigger("change");
        /*
        $("#chkQuadraticFit").attr("checked", "checked").trigger("change");
        $("#chkCubicFit").attr("checked", "checked").trigger("change");
        $("#chkExpFit").attr("checked", "checked").trigger("change");
        $("#chkLogFit").attr("checked", "checked").trigger("change");
        $("#chkPolynomialFit").attr("checked", "checked").trigger("change");*/
    });

    //#region Event handlers
    function btnPlotClicked(eventInfo) {
        go();
        checkOptions();
    }

    function btnClearClicked(eventInfo) {
        //var ht = $("#data-area").handsontable('getInstance');
        //ht.loadData([[null, null]]);
        //ht.render();
        $('#data-area').handsontable('loadData', [[null, null]]);
        go();
    }

    function chkLinearFitChanged(eventInfo) {
        if (jPloter != null) {
            var $chk = $(typeof (eventInfo.srcElement) != "undefined" ? eventInfo.srcElement : eventInfo.target);
            if ($chk.attr("checked") == "checked") {
                jPloter.addLinearModel();
            } else {
                jPloter.delLinearModel();
            }
            updateUI();
        }
    }

    function chkQuadraticFitChanged(eventInfo) {
        if (jPloter != null) {
            var $chk = $(typeof (eventInfo.srcElement) != "undefined" ? eventInfo.srcElement : eventInfo.target);
            if ($chk.attr("checked") == "checked") {
                jPloter.addQuadraticModel();
            } else {
                jPloter.delQuadraticalModel();
            }

            updateUI();
        }
    }

    function chkCubicFitChanged(eventInfo) {
        if (jPloter != null) {
            var $chk = $(typeof (eventInfo.srcElement) != "undefined" ? eventInfo.srcElement : eventInfo.target);
            if ($chk.attr("checked") == "checked") {
                jPloter.addCubicalModel();
            } else {
                jPloter.delCubicalModel();
            }

            updateUI();
        }
    }

    function chkExpFitChanged(eventInfo) {
        if (jPloter != null) {
            var $chk = $(typeof (eventInfo.srcElement) != "undefined" ? eventInfo.srcElement : eventInfo.target);
            if ($chk.attr("checked") == "checked") {
                jPloter.addExponentialModel();
            } else {
                jPloter.delExponentialModel();
            }

            updateUI();
        }
    }

    function chkLogFitChanged(eventInfo) {
        if (jPloter != null) {
            var $chk = $(typeof (eventInfo.srcElement) != "undefined" ? eventInfo.srcElement : eventInfo.target);
            if ($chk.attr("checked") == "checked") {
                jPloter.addLogarithmModel();
            } else {
                jPloter.delLogarithmModel();
            }

            updateUI();
        }
    }

    function chkPolynomialFitChanged(eventInfo) {
        if (jPloter != null) {
            //            var $chk = $(typeof (eventInfo.srcElement) != "undefined" ? eventInfo.srcElement : eventInfo.target);
            var $chk = $("#chkPolynomialFit");
            if ($chk.prop("checked")) {
                var $txtPower = $("#txtPower");
                var power = parseInt($txtPower.val());
                if (power > 5) { power = 5; $txtPower.val(power); }
                if (power < 1) { power = 1; $txtPower.val(power); }

                jPloter.delPolynomialModel();
                jPloter.addPolynomialModel(power);
            } else {
                jPloter.delPolynomialModel();
            }

            updateUI();
        }
    }

    function btnEsitmateAndPredictClicked(eventInfo) {
        updateFits();
    }

    //#endregion

    //#region Methods
    function updateStats() {
        if (jPloter != null) {
            var $statsArea = $("#statsColumn");
            $statsArea.html(jPloter.getStatistics(uiSettings.statsFormat));
        }
    }

    function updateFits() {
        if (jPloter != null) {
            var $models = $("#fits table tbody");
            $models.html("");
            var x = $("#txtX").val();
            var html = new StringBuffer();
            for (var modelIndex in jPloter.models) {
                var model = jPloter.models[modelIndex];
                if (x != "") {
                    x = parseFloat(x);
                    var y = "";
                    try {
                        y = window.eval("var x = " + x + ";" + model.getExpression());
                    } catch (ex) {
                        //console.error(ex);
                    }
                    html.append(uiSettings.fitFormat.format(model.name, model.formulaHtml, model.getParametersHtml(), model.sse.toFixed(2), x, y));
                } else {
                    html.append(uiSettings.fitFormat.format(model.name, model.formulaHtml, model.getParametersHtml(), model.sse.toFixed(2), "", ""));
                }
            }
            $models.html(html.toString());
        }
    }

    function updateCharts() {
        if (jPloter != null) {
            jPloter.draw($("#canvas"));
        }
    }

    function updateErrorMessage() {
        if (jPloter != null && jPloter.messages != null && jPloter.messages.length > 0) {
            var msgHtml = "";
            var msgFormat = Globalize.localize("message.format");
            var msgItemFormat = "<li>{0}</li>";
            for (var i = 0; i < jPloter.messages.length; i++) {
                msgHtml += String.format(msgItemFormat, jPloter.messages[i]);
            }
            msgHtml = String.format(msgFormat, msgHtml, $("#data-area").val());
            $(".mask").show();
            $("#data-area").addClass("errorBox");
            $("#error-message").html(msgHtml);
            $("#error-message").dialog({
                modal: true,
                minWidth: 500
            });
        } else {
            $(".mask").hide();
            $("#data-area").removeClass("errorBox");
            $("#error-message").dialog({
                modal: true
            });
            $("#error-message").dialog("close");
            $("#error-message").html("");
        }
    }

    function updateUI() {
        updateStats();
        updateFits();
        updateCharts();
        updateErrorMessage();
    }

    function readUISettings() {
        uiSettings.statsFormat = $("#statsColumn").html();
        uiSettings.fitFormat = $("#fits table tbody").html();
    }

    function go(callback) {
        jPloter = new JPloter();
        // read data points
        var s = $("#data-area").handsontable('getData');
        s = s.filter(function(row) {
            var empty = true;
            for (var i = 0; i < row.length; i++) {
                if (row[i] !== null && row[i] !== '') {
                    empty = false;
                    break;
                }
            }

            return !empty;
        });
        
        if (s) {
            jPloter.readDataPoints(s);
            updateUI();
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            alert(Globalize.localize("message.no.data"));
        }
    }

    function checkOptions() {
        var checkList = ["#chkLinearFit", "#chkQuadraticFit", "#chkCubicFit", "#chkExpFit", "#chkLogFit", "#chkPolynomialFit"];
        checkOne();

        function checkOne() {
            if (checkList.length > 0) {
                $(checkList[0]).trigger("change");
                checkList.splice(0, 1);
                setTimeout(checkOne, 5);
            }
        }
    }
    //#endregion
});