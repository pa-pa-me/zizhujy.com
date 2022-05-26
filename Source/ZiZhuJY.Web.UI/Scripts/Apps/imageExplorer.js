; (function ($) {

    Array.prototype.randomlyShift = function () {

        if (this.length > 0) {

            var desiredIndex = Math.floor(Math.random() * this.length);

            var target = this[desiredIndex];

            this.splice(desiredIndex, 1);

            return target;

        } else {

            return undefined;

        }

    };

    function localize(s) {
        return Globalize.localize(s);
    }

    function localizeIt(selector, messageId) {
        if (arguments.length >= 2) {
            $(selector).val(localize(messageId));
        } else {
            messageId = selector;
            if (messageId.startsWith("#") || messageId.startsWith(".")) {
                messageId = selector.substr(1);
            }

            $(selector).val(localize(messageId));
        }
    }

    function localizeAll() {
        var $localizationList = $("*[localize]");
        $localizationList.each(function (index, element) {
            var messageId = $(element).attr("localize");
            if (messageId == "")
                messageId = $(element).attr("id").replace(/\-/g, "_");

            try {
                $(element).text(localize(messageId)).val(localize(messageId));
            } catch (ex) {

            }
        });
    }

    $(document).ready(function () {
        localizeAll();
    });

    var recursiveCount = 0;

    var displayedImage = [];

    var requestedUrls = [];

    var httpRequestQueue = [];

    var imageQueue = [];

    var processing = false;

    var imageChecked = 0;

    var currentStatus = "stopped";



    function getThisBaseUrl() {

        return window.location.origin;

    }



    function getUrl(url) {
        if (!url) return "";

        url = url.toString();

        if (url.startsWith("http://")) {
            return url;
        }

        if (url.startsWith("https://")) {
            return url;
        }

        return "http://{0}".format(url);
    }



    function getSrc(targetUrl, src) {

        if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {

            return src;

        } else {

            if (src.startsWith("/")) {

                // absolute path case

                return getRootUrl(targetUrl) + src.substr(1);

            } else {

                // relative path case

                return getParentUrl(targetUrl) + src;

            }

        }

    }



    function replaceBaseUrl(s, baseUrl) {

        var index = s.toLowerCase().indexOf("<base");

        if (index >= 0) {
            var end = s.indexOf(">", index);
            if (end >= 0) {
                return s.substr(0, index) + "<base href='{0}' />".format(baseUrl) + s.substr(end + 1);

            } else {

                return s;

            }

        } else {

            index = s.toLowerCase().indexOf("</head>");

            if (index >= 0) {

                return s.substr(0, index) + "<base href='{0}' />".format(baseUrl) + s.substr(index);

            } else {

                return s;

            }

        }

    }



    function replaceImageUrls(s, baseUrl) {
        var newS = s.replace(
            /(<img [^<>\/]*src="?)([^<>"']+)("?[^<>\/]*\/?>)|(<img [^<>\/]*src='?)([^<>'"]+)('?[^<>\/]*\/?>)/gi,
            function(match, $1, $2, $3, $4, $5, $6, offset, input) {
                var newSrc = getSrc(baseUrl, $2 || $5);
                var newImage = ($1 || $4) + newSrc + ($3 || $6);
                return newImage;
            });

        return newS;
    }

    window.replaceImageUrls = replaceImageUrls;

    function addToImageQueue(src) {

        imageQueue.push(src);

    }



    function deQueueImage() {

        //return imageQueue.shift();

        // Randomly consume the queue

        return imageQueue.randomlyShift();

    }



    function addToHttpRequestQueue(baseUrl, src) {

        var o = { baseUrl: baseUrl, src: src };

        if (!httpRequestQueue.contains(o)) {

            httpRequestQueue.push(o);

        }

    }



    function deQueueHttpRequest() {

        return httpRequestQueue.randomlyShift();

    }



    function consumeImageQueue() {
        if (currentStatus == "paused") return;

        var src = deQueueImage();

        if (src) {

            if (!processing) {

                processing = true;

                addImage(src);

                imageChecked++;

                processing = false;

            }

            setTimeout(consumeImageQueue, 1000 * 0.25);

        } else {

            consumeHttpRequestQueue();

            setTimeout(consumeImageQueue, 1000 * 2);

        }

    }



    function loadImage(uri, callback) {

        var xhr = new XMLHttpRequest();

        xhr.responseType = "blob";

        xhr.onload = function () {

            callback(window.webkitURL.createObjectURL(xhr.response), uri);

        };

        xhr.open("GET", uri, true);

        xhr.send();

    }



    function addImage(src) {

        if (displayedImage.contains(src)) return;

        displayedImage.push(src);



        var image = new Image();
        image.src = src;

        $(image).load(function (event) {

            try {

                if (image.height && image.height > 400 || image.width && image.width > 600) {

                    var $container = $("#container-big-images");

                    $container.append($("<a href='{0}' target='_blank'></a>".format(src)).append(image));

                    $container.parent().animate({ scrollTop: $container[0].scrollHeight - $container.parent().height() }, "slow");

                } else {

                    var $container = $("#container-small-images");

                    $container.append($("<a href='{0}' target='_blank'></a>".format(src)).append(image));

                }

            } catch (ex) {

                image.alt = ex.description;

                $("#container-exception").append($("<a href='{0}' target='_blank' title='{1}:{2} \r\n{3}\r\n{4}'></a>".format(src, ex.number, ex.name, ex.message, ex.description)).append(image));

            }

        });

    }



    function consumeHttpRequestQueue() {

        if (currentStatus == "paused") return;

        var target = deQueueHttpRequest();

        if (target) {

            if (!processing) {

                processing = true;

                go(target.baseUrl, target.src);

                processing = false;

            }



            setTimeout(consumeHttpRequestQueue, 1000 * 60 * 3);

        } else {

            setTimeout(consumeHttpRequestQueue, 1000 * 60 * 5);

        }

    }



    function statusReport() {
        if (currentStatus == "paused") return;

        if (!processing) {

            $("#status").text("Idle.");

            $("#image-queue").text(imageQueue.length);

            $("#http-request-queue").text(httpRequestQueue.length);

            $("#image-checked").text(imageChecked);

            $("#http-request-sent").text(requestedUrls.length);

            $("#current-url").text(requestedUrls[requestedUrls.length - 1]);

        } else {

            $("#status").text("Processing...");

        }



        setTimeout(statusReport, 250);

    }

    function handleFirstGo(json, targetUrl) {
        var s = json.contents;

        if (!s) {
            stop();
            return;
        } else {
            //alert(s);
            s = atob(s);
            //alert(s);
            //return;
        }

        s = replaceBaseUrl(s, targetUrl);

        s = replaceImageUrls(s, targetUrl);

        var $document = $(s);



        $document.find("img").each(function (index, img) {

            var src = $(img).attr("src");



            if (src && src.length > 0) {

                //alert("targetUrl = " + targetUrl + "; src = " + src);

                src = getSrc(targetUrl, src);

                //alert(src);

                //addImage(src);

                addToImageQueue(src);

            }

        });



        $document.find("a").each(function (index, a) {

            var src = $(a).attr("href");

            if (src && src.length > 0) {

                var indexOfQuestionMark = src.indexOf("?");

                var srcWithoutQuery = src;

                if (indexOfQuestionMark >= 0) {

                    srcWithoutQuery = src.substring(0, indexOfQuestionMark);

                }



                if (srcWithoutQuery.endsWith(".jpg") || srcWithoutQuery.endsWith(".jpeg") || srcWithoutQuery.endsWith(".bmp")

                    || srcWithoutQuery.endsWith(".png") || srcWithoutQuery.endsWith(".gif")) {

                    src = getSrc(targetUrl, src);

                    addToImageQueue(src);

                } else {
                    addToHttpRequestQueue(targetUrl, src);

                }

            }

        });

    }



    function getRootUrl(url) {

        var rootUrl = url.toString().replace(/^(.*\/\/[^\/?#]+).*$/, "$1");

        if (!rootUrl.endsWith("/")) rootUrl += "/";



        return rootUrl;

    }



    function isRootUrl(url) {

        var rootUrl = getRootUrl(url);

        if (!url.endsWith("/")) url += "/";

        return rootUrl == url;

    }



    function getParentUrl(url) {

        var parentUrl = url.toString().substr(0, url.toString().lastIndexOf("/"));



        if (isRootUrl(url)) {

            parentUrl = url;

        }



        if (!parentUrl.endsWith("/")) parentUrl += "/";

        return parentUrl;

    }


    function go(baseUrl, url) {
        var targetUrl = baseUrl;

        if (!targetUrl) {

            targetUrl = getUrl($("#location-bar").val());

        } else {

            targetUrl = getSrc(targetUrl, url);

        }


        if (requestedUrls.contains(targetUrl)) {

            return;

        }


        requestedUrls.push(targetUrl);

        $.retryableAjax(
            "{0}?url={1}".format("http://proxy-jefftian.rhcloud.com/proxy.php", encodeURIComponent(targetUrl)),
            2,
            4000,
            function(json) {
                handleFirstGo(json, targetUrl);
            },
            function(xhr, textStatus, errorThrown) {
                $.retryableAjax(
                    '{0}?url={1}'.format('https://proxy-php.herokuapp.com/proxy.php', encodeURIComponent('http://zizhujy.com/blog/syndication.axd')),
                    4,
                    8000,
                    function(json) {
                        handleFirstGo(json, targetUrl);
                    },
                    function(xhr, textStatus, errorThrown) {
                        console.log('Stopped retrying...');
                    });
            });
    }

    function play() {

        go();

        consumeImageQueue();

        consumeHttpRequestQueue();

        statusReport();

        currentStatus = "playing";

        $("#go").val(localize("pause"));

    }



    function pause() {

        $("#go").val(localize("resume"));

        currentStatus = "paused";

    }



    function resume() {

        currentStatus = "playing";

        consumeImageQueue();

        consumeHttpRequestQueue();

        statusReport();

        $("#go").val(localize("pause"));

    }



    function stop() {

        $("#go").val(localize("goButtonText"));

        currentStatus = "stopped";

        recursiveCount = 0;

        displayedImage = [];

        requestedUrls = [];

        httpRequestQueue = [];

        imageQueue = [];

        processing = false;

        imageChecked = 0;

        $("#container-big-images").html("");

        $("#container-small-images").html("");

        $("#container-exception").html("");

    }



    $(document).ready(function () {

        $("#location-bar").focus();



        $("#location-bar").keyup(function (event) {

            switch (event.which) {

                case 13:

                    switch (currentStatus) {

                        case "stopped":

                            play();

                            break;

                        case "playing":

                            pause();

                            break;

                        case "paused":

                            resume();

                            break;

                    }

                    break;



                default:

                    break;

            }

        });



        $("#go").click(function (event) {

            switch (currentStatus) {

                case "stopped":

                    play();

                    break;

                case "playing":

                    pause();

                    break;

                case "paused":

                    resume();

                    break;

            }

        });



        $("#stop-button").click(function (event) {

            stop();

        });

    });

})(jQuery);