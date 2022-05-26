;
(function ($) {
    $(document).ready(function () {
        // 选择菜单项
        var currentPageId = $("zizhujy").attr("pageId");
        if (!!currentPageId) {
            $("#menucontainer ul li[pageId='" + currentPageId + "']").addClass("selected");
        }

        // 增加Logo特效
        $("#logo #logoImage").bind("mouseover mouseout", function () { $(this).toggleClass("hover"); });

        // Jump to the specific culture page when selection changed
        $("#cultures").bind("change", function (event) {
            var url = $(this).attr("value");
            window.location.href = url;
        });

        // Auto stretch to all available spaces for main content
        function adjustMainSize() {
            var $parentContainer = $("#page");

            if ($parentContainer.length > 0) {
                var $me = $("#main");
                if ($me.find("zizhujy").hasClass("full-available-space")) {
                    var myIdealHeight = $parentContainer.height() - ($("#header").outerHeight() || 0) - ($("#footer").outerHeight() || 0);
                    $me.css({
                        height: myIdealHeight + "px"
                    });
                }
            }
        }

        adjustMainSize();

        $(window).resize(function (event) {
            adjustMainSize();
        });
    });

    $(document).ready(function() {
        $("#culture-selection").find("select").select2();
    });
})(jQuery);