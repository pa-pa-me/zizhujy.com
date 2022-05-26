; (function ($) {
    function addUI(){
        addTop();
        addRenren();
        addRenrenLike();
        addFacebookShare();
        addFacebookLike();

        clearFloat();
    }

    function addTop(){
        var html = new StringBuffer();
        html.append("<div id='social-top' class='socialTop'></div>");

        $(document.body).append("{0}".format(html.toString()));
    }

    function addToTop(html){
        var $clearFloat = $("#social-top .clearFloat");
        if($clearFloat.length <= 0){
            $("#social-top").append("<div>{0}</div>".format(html));
        } else {
            $(html).insertBefore($clearFloat);
        }
    }

    function clearFloat(){
        $("#social-top").append("<div class='clearFloat'></div>");
    }

    function addRenren(){
        var html = new StringBuffer();        
        html.append("<script type='text/javascript' src='http://widget.renren.com/js/rrshare.js'></script>");
        html.append("<a name='xn_share' onclick='SocialPlugin.Hooks.RenrenShareClick();return false;' type='button_medium' href='javascript:;'>分享到人人</a>");

        addToTop(html.toString());
    }

    function addRenrenLike(){
        var html = new StringBuffer();
        var p = [];
        var like = {
            url: window.location.href, /*喜欢的URL(不含如分页等无关参数)*/
            title: $(document).attr("title"), /*喜欢标题(可选)*/
            description: SocialPlugin.Functions.GetPageDesc(),  /*喜欢简介(可选)*/
            image: SocialPlugin.Functions.GetImage()  /*喜欢相关图片的路径(可选)*/
        };
        for(var i in like){
            p.push(i + "=" + encodeURIComponent(like[i] || ""));
        }

        html.append("<iframe scrolling=\"no\" frameborder=\"0\" allowtransparency=\"true\" src=\"http://www.connect.renren.com/like/v2?{2}\" style=\"width:{0}px;height:{1}px;\"></iframe>".format(110, 24, p.join("&")));

        addToTop(html.toString());
    }

    function addFacebookLike(){
        var html = new StringBuffer();

        var p = [];
        var like = {
            href: window.location.href.startsWith("http://localhost") ? "http://zizhujy.com": window.location.href,
            width: 77,
            height: 24,
            colorscheme: "light",
            layout: "button_count",
            action: "like",
            show_faces: "false",
            send: "false",
            appId: "322515571154206"
        };

        for(var i in like){
            p.push(i + "=" + encodeURIComponent(like[i] || ""));
        }

        html.append("<iframe id='fb-like-iframe' src=\"//www.facebook.com/plugins/like.php?{2}\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:{0}px; height:{1}px;\" allowTransparency=\"true\"></iframe>".format(77, 24, p.join("&")));

        addToTop(html.toString());
    }

    function addFacebookShare(){
        var html = new StringBuffer();
        html.append("<a id='facebook_share' onclick='SocialPlugin.Hooks.FacebookShareClick();return false;', href='javascript:;'>Share on Facebook</a>");

        var buttonIcon = new Image(68, 24);

        buttonIcon.src = zizhujy.com.rootWebSitePath + "/Content/Images/facebook_button.png";
        $(buttonIcon).load(function(){
            $("a#facebook_share").html("");
            $("a#facebook_share").append(buttonIcon);
            $("a#facebook_share, a#facebook_share img").css({"border": "none"});
        });

        addToTop(html.toString());
    }

    var SocialPlugin = function(){};
    window.SocialPlugin = SocialPlugin;
    SocialPlugin.Functions = function(){        
        function getPageDescription(){
            var descMeta = $("meta[name='description']");
            return descMeta.length > 0 ? descMeta.attr("content") || descMeta.attr("edit") : "";
        }

        function getImage(){
            return get1stImage();
        }

        function get1stImage(){
            var images = [];
            var $images = $("*");
            for(var i = 0; i < $images.length; i++){
                var bgImg = $($images[i]).css("background-image");
                if(bgImg && bgImg.trim().startsWith("url")) {
                    images.push(bgImg.replace(/^url\([\"|']?/i, "").replace(/[\"|']?\)$/i, ""));
                    break;
                }
            }

            if( images.length > 0 ) {
                return images[0];
            }

            var $images = $("img");
            if($images.length > 0){
                return $($images[0]).attr("src");
            }

            $images = $("a[href~='.jpg .jpeg .png .bmp .gif']");
            if($images.length > 0){
                return $($images[0]).attr("href");
            }
        }

        return {
            GetPageDesc: getPageDescription,
            GetImage: getImage            
        };
    }();

    SocialPlugin.Hooks = function(){
        function renrenShareClick(){
            var rrShareParam = {
                resourceUrl: window.location.href, //分享的资源Url
                srcUrl: window.location.href, //分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
                pic: SocialPlugin.Functions.GetImage(), //分享的主题图片Url
                title: $(document).attr("title"), //分享的标题
                description: SocialPlugin.Functions.GetPageDesc() //分享的详细描述
            };

            rrShareOnclick(rrShareParam);
        }

        function facebookShareClick(){
            window.open(
                'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href), 
                'facebook-share-dialog', 
                'width=626,height=436'
            );

            return false;
        }

        return {
            RenrenShareClick: renrenShareClick,
            FacebookShareClick: facebookShareClick
        };
    }();

    $(document).ready(function(){
        addUI();

//        SocialPlugin.Hooks.RenrenShareClick = function(){
//            alert("Hello");
//        };
    });
})(jQuery);