;
(function($) {
    $.retryableAjax = function(url, retryLimit, timeout, success, error) {
        $.ajax({
            url: url,
            dataType: 'jsonp',
            tryCount: 0,
            retryLimit: retryLimit,
            timeout: timeout,
            success: function(responseTextAsJson, statusText, xhr) {
                success(responseTextAsJson, statusText, xhr);
            },
            error: function (xhr, textStatus, errorThrown) {
                if (textStatus === 'timeout' || xhr.status === 302 || xhr.status === 404) {
                    console.log('textStatus = ' + textStatus);
                    console.log('xhr.status = ' + xhr.status);
                    console.log('timeout = ' + timeout);
                    console.log(errorThrown);
                    console.log('retrying...');
                    this.tryCount++;
                    if (this.tryCount < this.retryLimit) {
                        $.ajax(this);
                        return;
                    } else {
                        !!window.console && console.log("Can't handle this url: '{0}'.".format(this.url));

                        if (typeof error === 'function') {
                            error();
                        }
                    }

                    return;
                }

                if (xhr.status === 500) {
                    console.log('server 500');
                }

                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            },
            complete: function(xhr, textStatus) {
            }
        });
    }
})(jQuery);