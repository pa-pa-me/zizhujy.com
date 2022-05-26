(function ($) {
    function pasteIntoInput(el, text) {
        el.focus();
        var val = el.value;
        if (typeof el.selectionStart == "number") {
            var selStart = el.selectionStart;
            el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd);
            el.selectionEnd = el.selectionStart = selStart + text.length;
        } else if (typeof document.selection != "undefined") {
            var textRange = document.selection.createRange();
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        }
    }

    function allowTabChar(el) {
        $(el).keydown(function (e) {
            if (e.which == 9 || e.which == 32 || e.which == 186 /*;*/) {
                pasteIntoInput(this, "\t");
                return false;
            }
        });

        // For Opera, which only allows suppression of keypress events, not keydown
        $(el).keypress(function (e) {
            if (e.which == 9) {
                return false;
            }
        });
    }

    $.fn.allowTabChar = function () {
        if (this.jquery) {
            this.each(function () {
                if (this.nodeType == 1) {
                    var nodeName = this.nodeName.toLowerCase();
                    if (nodeName == "textarea" || (nodeName == "input" && this.type == "text")) {
                        allowTabChar(this);
                    }
                }
            })
        }
        return this;
    }
})(jQuery);