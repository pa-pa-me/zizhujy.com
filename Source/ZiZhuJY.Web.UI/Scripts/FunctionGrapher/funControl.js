function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
}

window.guid = guid;

var expressionLineHtml = "<div class='expressionLine'><div id='taExp-{0}' class='expressionBox'><span class='mathquill-editable'></span><span class='icon clear'>×</span></div></div>";

var FunControl = function () { };
FunControl.UI = function () {
    function executeHooks(hook, args) {
        args = [FunControl.UI].concat(args);
        for (var i = 0; i < hook.length; ++i) {
            hook[i].apply(this, args);
        }
    }

    function setupMathquill($mathquill, callback) {
        $mathquill = $mathquill || $(".expressionBox > span.mathquill-editable").mathquill();

        $mathquill
            .bind("keydown", myKeyDown)
            .bind("keypress", myKeyPress)
            .bind("keyup", myKeyUp)
            .bind("blur", myBlur)
            .keyup();

        if (typeof callback === "function") {
            callback(this);
        }
        

        var userAgent = navigator.userAgent;
        var isAndroidChrome = /android/i.test(userAgent) && /chrome/i.test(userAgent);
        
        if (isAndroidChrome) {
            //$mathquill.on("focus", ".textarea > *", function (event) {
            //    $(this).selectRange(1);
            //});
        }
    }

    // Usage:
    //  addExpressionLine($target);
    //  addExpressionLine($target, expression);
    //  addExpressionLine(expression);
    //  addExpressionLine();
    function addExpressionLine($target, expression) {
        if (arguments.length <= 0) {
            $target = null;
        } else {
            if (!(arguments[0] instanceof jQuery)) {
                // The order of the evaluations is very important!
                expression = arguments[0];
                $target = null;
            }
        }

        if (!$target) {
            $target = $("#control-panel .body div.expressionLine:last");
        }

        var $expressionLine = $(expressionLineHtml.format(guid()));

        !!$target && $target.length > 0 ?
            $expressionLine.insertAfter($target) :
            $("#control-panel .body").prepend($expressionLine);

        var $mathquill = $expressionLine.find("span.mathquill-editable").mathquill("editable").mathquill("latex", !!expression ? expression : "").focus();

        executeHooks(FunControl.UI.Hooks.addExpressionLine, [$expressionLine, $mathquill, $mathquill.mathquill("latex"), event]);

        setupMathquill($mathquill);
    }

    // Find the first available expression line and then add an expression to it.
    // If no avaiable expression line then add one first.
    function addExpression(expression) {
        var availableLines = $("div.expressionLine").filter(function (index) {
            var content = $(this).find("span.mathquill-editable").mathquill("latex");
            return !content;
        });

        if (availableLines.length > 0) {
            $(availableLines[0]).find("span.mathquill-editable").mathquill("latex", expression).find("textarea, input").keyup().blur();
        } else {
            addExpressionLine(expression);
        }
    }

    function getAllExpressions() {
        var expressions = [];

        $.each($("div.expressionLine"), function (index, value) {
            var content = $(value).find("span.mathquill-editable").mathquill("latex");
            if (!!content) {
                expressions.push(content);
            }
        });

        return expressions;
    }

    function addExpressions(expressionList) {
        if (expressionList != null && $.isArray(expressionList)) {
            var availableLines = $("div.expressionLine").filter(function (index) {
                var content = $(this).find("span.mathquill-editable").mathquill("latex");
                return !content;
            });

            var i = 0;
            for (i = 0; i < availableLines.length; i++) {
                $(availableLines[i]).find("span.mathquill-editable").mathquill("latex", !expressionList[i] ? "" : expressionList[i]).find("textarea, input").keyup().blur();
            }

            for (; i < expressionList.length; i++) {
                addExpressionLine(expressionList[i]);
            }
        }
    }

    function deleteExpressionLine($mathquill) {
        var $expressionLine = $mathquill.closest("div.expressionLine");
        removeErrorStyle($expressionLine);

        $expressionLine.remove();

        executeHooks(FunControl.UI.Hooks.deleteExpressionLine, [$expressionLine, $mathquill, $mathquill.mathquill("latex"), event]);

        if ($("div.expressionLine").length <= 0) {
            addExpressionLine();
        }
    }

    function deleteAllExpressionLines() {
        $("div.expressionLine").not(":first")
            .each(function (index, expressionLine) {
                removeErrorStyle($(expressionLine));
            }).remove();

        $("div.expressionLine:first .clear").click();
    }

    function clearExpression($clearButton) {
        var $mathquill = $clearButton.closest("div.expressionBox").find("span.mathquill-editable");
        $mathquill.mathquill("latex", "");
        removeErrorStyle($mathquill.closest("div.expressionLine"));
        var $expressionLine = $clearButton.closest("div.expressionLine").removeAttr("data").removeAttr("expression").removeAttr("inputtype");
    }

    function deleteErrorMessageBox(associatedId) {
        $("div.error-message-box[associatedExpressionId='" + associatedId + "']").remove();
    }

    function removeErrorStyle($expressionLine) {
        $expressionLine.removeClass("error");
        $expressionLine.find("div.error-icon-box").remove();
        var expressionId = $expressionLine.find("div.expressionBox").attr("id");
        deleteErrorMessageBox(expressionId);
    }

    function getErrorMessage(errorList) {
        window.Globalize = Globalize || {};
        Globalize.localize = Globalize.localize || function (key) { return key; };

        var localize = function(key) {
            var s = Globalize.localize(key);
            if (typeof s === "undefined" || s === null) {
                return key;
            } else {
                return s;
            }
        };

        var errorDataTable = new zizhujy.com.DataTable();
        // zizhujy.com.DataTable has a minor bug. Before add columns or rows, clear() must have
        // been called
        errorDataTable.clear();
        errorDataTable.columns.add("#");
        errorDataTable.columns.add(localize("Remark"));
        errorDataTable.columns.add(localize("Context"));
        errorDataTable.columns.add(localize("Index"));

        for (var i = 0; i < errorList.length; i++) {
            var error = errorList[i];
            var errorMsg = "";
            if (error.errorEnum instanceof Array) {
                var sb = new StringBuffer();
                for (var j = 0; j < error.errorEnum.length; j++) {
                    sb.append(error.errorEnum[j].message);
                }
                errorMsg = sb.toString(localize("Or"));
            } else {
                errorMsg = error.errorEnum.message;
            }

            errorDataTable.rows.add((i + 1).toString(), errorMsg, error.contextHTML, error.index.toString());
        }

        return errorDataTable.toHtml("errorList", false, localize("ErrorList"));
    }

    function showErrorStyle($expressionLine, errorList, isStatic) {
        // show error message
        $expressionLine.addClass("error");
        $expressionLine.find("div.error-icon-box").remove();

        $expressionLine.append("<div class='error-icon-box'><span class='icon'>&#x26a0;</span></div>");
        var expressionId = $expressionLine.find("div.expressionBox").attr("id");
        var $oldErrMsg = $(String.format("div.error-message-box[associatedExpressionId='{0}']", expressionId));
        var isActive = $oldErrMsg.hasClass("active");
        $oldErrMsg.remove();

        var newErrMsg = "<div class='error-message-box";
        if (isActive) newErrMsg += " active";
        newErrMsg += "' associatedExpressionId='{0}'></div>";
        var $errorBox = $(String.format(newErrMsg, expressionId))
            .html(getErrorMessage(errorList))
            .appendTo("#layout")
            .css({
                "position": "absolute",
                "top": $expressionLine.position().top + "px",
                "right": $expressionLine.parent().outerWidth() + "px",
                "z-index": 11,
                "display": "none"
            });

        if (!isStatic) {
            var adjustErrorBoxPositionIntervalId = setInterval(function() {
                // Adjust position of error box
                if ($errorBox.length > 0) {
                    $errorBox.css({
                        "top": $expressionLine.position().top + "px",
                        "right": ($expressionLine.parent().outerWidth() + 5) + "px"
                    });
                } else {
                    clearInterval(adjustErrorBoxPositionIntervalId);
                }
            }, 100);
        }
        
        return $errorBox;
    }

    function myKeyDown(event) {
        var text;
        
        switch (event.which) {
            // Enter key:
            case 13:
                event.preventDefault();
                $(this).trigger("keyup");
                addExpressionLine($(this).parent().parent());
                break;
                // Backspace 
            case 8:
                text = $(this).mathquill("latex");
                if (text.length <= 0) {
                    event.preventDefault();
                    text = $(this).mathquill("latex");
                    //event.stopPropagation();
                    
                    var $target = $(this).parent().parent().prev().find("div.expressionBox span.mathquill-editable").focus();

                    if ($target.length > 0) {
                        deleteExpressionLine($(this));
                    } else {
                        if ($(this).parent().parent().next().find("div.expressionBox span.mathquill-editable").focus().length > 0) {
                            deleteExpressionLine($(this));
                        }
                    }
                }

                break;

                // Delete:
            case 46:
                text = $(this).mathquill("latex");
                if (text.length <= 0) {
                    event.preventDefault();
                    var $target = $(this).closest("div.expressionLine").next().find("div.expressionBox > span.mathquill-editable").focus();

                    if ($target.length > 0) {
                        deleteExpressionLine($(this));
                    } else {
                        if ($(this).closest("div.expressionLine").prev().find("div.expressionBox > span.mathquill-editable").focus().length > 0) {
                            deleteExpressionLine($(this));
                        }
                    }
                }
                break;
                // Down Arrow
            case 40:
                // prevent the focus from coming back
                event.stopPropagation();
                if ($(this).closest("div.expressionLine").next().find("div.expressionBox > span.mathquill-editable").focus().length <= 0) {

                    addExpressionLine($(this).closest(".expressionBox").parent());
                }
                break;
                // Up Arrow
            case 38:
                text = $(this).mathquill("latex");
                if (text.length <= 0 && $(this).closest("div.expressionLine").next("div.expressionLine").length <= 0) {
                    event.preventDefault();
                    var $target = $(this).closest("div.expressionLine").prev().find("div.expressionBox > span.mathquill-editable").mathquill("editable").focus();
                    if ($target.length > 0) {
                        deleteExpressionLine($(this));
                    }
                } else {
                    if ($(this).closest("div.expressionLine").prev().find("div.expressionBox > span.mathquill-editable").mathquill("editable").focus().length > 0) {
                        // prevent the focus from coming back:
                        event.stopPropagation();
                    }
                }
                break;
                // Left Arrow:
            case 37:
                break;
                // Right Arrow
            case 39:
                break;
            default:
                break;
        }
    }

    function myKeyUp(event) {
        switch (event.which) {
            case 13:
                // Enter Key:
                break;
            default:
                break;
        }

        var $expressionLine = $(event.target).closest(".expressionLine");
        var $mathquill = $expressionLine.find("span.mathquill-editable");

        executeHooks(FunControl.UI.Hooks.keyup, [$expressionLine, $mathquill, $mathquill.mathquill("latex"), event]);
    }

    function myKeyPress(event) {
        // from base64.js and mathquill
        var c = String.fromCharCode(event.which);
        
        var $mathquill = $(event.currentTarget);
        var latex = $mathquill.mathquill("latex");
        
        switch (c) {
            case '=':

                var replaced = false;

                latex = latex.replace(/<$/, function () {
                    replaced = true;
                    return "\\le ";
                }).replace(/>$/, function () {
                    replaced = true;
                    return "\\ge ";
                });

                if (!!replaced) {
                    event.preventDefault();
                    $mathquill.mathquill("latex", latex).focus();
                }

                break;
            default:
                break;
        }
        
        var $expressionLine = $mathquill.closest(".expressionLine");
        executeHooks(FunControl.UI.Hooks.keypress, [$expressionLine, $mathquill, $mathquill.mathquill("latex"), event]);
    }

    function myBlur(event) {
    }

    return {
        SetupMathquill: setupMathquill,
        AddExpression: addExpression,
        AddExpressions: addExpressions,
        DeleteExpressionLine: deleteExpressionLine,
        DeleteAllExpressionLines: deleteAllExpressionLines,
        ClearExpression: clearExpression,

        GetAllExpressions: getAllExpressions,

        ShowErrorStyle: showErrorStyle,
        RemoveErrorStyle: removeErrorStyle,

        // Can only be called by advancedHandleAnalyzedResult() or handleAnalyzedResult()
        DeleteErrorMessageBox: deleteErrorMessageBox,

        KeyDownHandler: myKeyDown,
        KeyUpHandler: myKeyUp,
        BlurHandler: myBlur,
        KeyPressHandler: myKeyPress,
        Hooks: {
            addExpressionLine: [],
            deleteExpressionLine: [],
            keyup: [],
            keypress: []
        }
    };
}();

FunControl.GetLink = function (currentLink) {
    var queryStart = currentLink.indexOf("?");

    var link = currentLink.substr(0, queryStart >= 0 ? queryStart : currentLink.length);
    var urlParams = zizhujy.com.deserializeUrlParams(currentLink.substring(queryStart >= 0 ? queryStart + 1 : currentLink.length));

    if (!urlParams) {
        urlParams = {};
    }

    //urlParams.fns = Base64String.compress(LZString.compress(JSON.stringify(FunGrapher.UI.GetAllExpressions())));
    //urlParams.fns = LZString.compress(JSON.stringify(FunGrapher.UI.GetAllExpressions()));
    var allExpressions = JSON.stringify(FunControl.UI.GetAllExpressions());
    urlParams.fns = encodeURIComponent("base64/" + btoa(allExpressions));

    link += "?{0}".format($.param(urlParams));

    return link;
};

FunControl.EncodeExpressions = function (expressionsObject) {
    // First serialize it
    var flat = JSON.stringify(expressionsObject);
    // Seconde encode it (base64)
    flat = btoa(flat);
    // 3rd, flag it
    flat = "base64/" + flat;
    // 4th, adjust it to suitable for url
    flat = encodeURIComponent(flat);

    return flat;
};

FunControl.DecodeExpressions = function (expressions) {
    if (expressions != null && typeof (expressions) === "string" && expressions !== "") {
        // 1st, read the url
        var object = decodeURIComponent(expressions);
        // 2nd, remove the flag
        if (object.startsWith("base64/")) {
            object = object.substring("base64/".length);
            // 3rd, decode it from base64
            object = atob(object);
            // 4th, rebuild the object
            object = $.parseJSON(object);

            return $.isArray(object) ? object : [object];
        } else {
            // Be compatible with old versions (LZString encoded)
            object = LZString.decompress(object);
            if (object != null && object !== "") {
                // LZString decompressing succeeded
                object = $.parseJSON(object);

                return $.isArray(object) ? object : [object];
            } else {
                // Not LZString compressed
            }
        }

        return [expressions];
    } else {
        return $.isArray(expressions) ? expressions : [expressions];
    }
};

window.FunControl = FunControl;

(function ($) {
    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /firefox/i.test(navigator.userAgent);
        $.browser.webkit = /webkit/i.test(navigator.userAgent);
        $.browser.opera = /opera/i.test(navigator.userAgent);
        $.browser.msie = /msie/i.test(navigator.userAgent);
    }

    if (!!$.browser.msie || (!!$.browser.mozilla && $.browser.version == "11.0")) {
        // IE 11's navigator.userAgent:
        // Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko
        $(document).on("focus", ".expressionBox > span.mathquill-editable", function (event) {
            var $this = $(this);

            // IE workaround for focusing mathquill
            setTimeout(function () {
                $this.find("textarea").focus();
            }, 50);
        });

        $(document).on("focus", ".expressionBox > span.mathquill-editable textarea", function (event) {
            // Very important to stop propagation, otherwise there would be infinite loop.
            event.stopPropagation();
        });
    }
    
    $(document).ready(function () {

        var $mathquill = $(".expressionBox > span.mathquill-editable");

        FunControl.UI.SetupMathquill($mathquill, function() {
            $mathquill.focus();
        });

        $("#layout").on("click", "div.error-icon-box", function (event) {
            var expressionId = $(this).closest("div.expressionLine").find("div.expressionBox").attr("id");
            $(String.format("div.error-message-box[associatedExpressionId='{0}']", expressionId))
                .toggleClass("active");
        }).on("mouseover", "div.error-icon-box", function (event) {
            var expressionId = $(this).closest("div.expressionLine").find("div.expressionBox").attr("id");
            $(String.format("div.error-message-box[associatedExpressionId='{0}']", expressionId)).show();
        }).on("mouseout", "div.error-icon-box", function (event) {
            var expressionId = $(this).closest("div.expressionLine").find("div.expressionBox").attr("id");
            var $errorBox = $(String.format("div.error-message-box[associatedExpressionId='{0}']", expressionId));
            if (!$errorBox.hasClass("active"))
                $errorBox.hide();
        });

        $("#layout").on("click", ".expressionBox .clear", function (event) {
            FunControl.UI.DeleteExpressionLine($(this));
        });

        $("body").on("click", "table.errorList tbody tr", function () {
            $(this).siblings().removeClass("selected");
            if (!$(this).hasClass("selected"))
                $(this).addClass("selected");
        }).on("dblclick", function () {
            //                    var index = parseInt($(this).find("td:eq(5)").text());
            //                    jfg.ui.$UserInput.focus();
            //                    jfg.ui.$UserInput.attr("selectionStart", index);
            //                    jfg.ui.$UserInput.attr("selectionEnd", index + 1);
        });
    });
})(jQuery);