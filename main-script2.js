function beforeLoader() {
    return '<div class="loader"></div>'
}
function beautiAvatar(e) {
    $(e).attr("src", function(e, t) {
        return (t = (t = t.replace("//resources.blogblog.com/img/blank.gif", "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s39/avatar.jpg")).replace("//lh3.googleusercontent.com/zFdxGE77vvD2w5xHy6jkVuElKv-U9_9qLkRYK8OnbDeJPtjSZ82UPq5w6hJ-SA=s35", "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s39/avatar.jpg")).replace("/s35", "/s39")
    })
}! function(e) {
    e.fn.lazyify = function() {
        return this.each(function() {
            var t, o = e(this),
                i = e(window),
                a = o.attr("data-image"),
                n = "w" + Math.round(o.width() + o.width() / 10) + "-h" + Math.round(o.height() + o.height() / 10) + "-p-k-no-nu";
            noThumbnail = "undefined" != typeof noThumbnail ? noThumbnail : "//4.bp.blogspot.com/-eALXtf-Ljts/WrQYAbzcPUI/AAAAAAAABjY/vptx-N2H46oFbiCqbSe2JgVSlHhyl0MwQCK4BGAYYCw/s72-c/nth-ify.png", a.match("resources.blogblog.com") && (a = noThumbnail), t = a.match("/s72-c") ? a.replace("/s72-c", "/" + n) : a.match("/w72-h") ? a.replace("/w72-h72-p-k-no-nu", "/" + n) : a.match("=w72-h") ? a.replace("=w72-h72-p-k-no-nu", "=" + n) : a, o.is(":hidden") || i.on("load resize scroll", function e() {
                if (i.scrollTop() + i.height() >= o.offset().top) {
                    i.off("load resize scroll", e);
                    var a = new Image;
                    a.onload = function() {
                        o.attr("style", "background-image:url(" + this.src + ")").addClass("lazy-ify")
                    }, a.src = t
                }
            }).trigger("scroll")
        })
    }
}(jQuery),
function(e) {
    e.fn.tickerify = function() {
        return this.each(function() {
            new class {
                constructor(e) {
                    this.ticker = e, this.active = 0, this.tickerInit()
                }
                tickerActive(e) {
                    this.active = e, this.items.each(function() {
                        this.classList.remove("active")
                    }), this.items[e].classList.add("active"), this.tickerAuto()
                }
                tickerArrows() {
                    this.ticker.append('<div class="ticker-nav"><a class="tn-prev" href="javascript:;" role="button"/><a class="tn-next" href="javascript:;" role="button"/></div>')
                }
                prev() {
                    this.active > 0 ? this.tickerActive(this.active - 1) : this.tickerActive(this.items.length - 1)
                }
                next() {
                    this.active < this.items.length - 1 ? this.tickerActive(this.active + 1) : this.tickerActive(0)
                }
                tickerNavigation() {
                    const e = this.ticker.find(".tn-prev");
                    this.ticker.find(".tn-next").on("click", this.next), e.on("click", this.prev)
                }
                tickerAuto() {
                    clearTimeout(this.timeout), this.timeout = setTimeout(this.next, 5e3)
                }
                tickerInit() {
                    this.next = this.next.bind(this), this.prev = this.prev.bind(this), this.items = this.ticker.find(".ticker-items > *");
                    const e = this.items.length;
                    e && (this.tickerActive(0), e >= 2 && (this.tickerArrows(), this.tickerNavigation()))
                }
            }(e(this))
        })
    }
}(jQuery), $(".show-search").on("click", function() {
    $("body").addClass("search-active"), $("#main-search-wrap").fadeIn(170).find("input").focus()
}), $(".search-close").on("click", function() {
    $("body").removeClass("search-active"), $("#main-search-wrap").fadeOut(170).find("input").blur()
}), $("html").each(function() {
    var e = $(this);
    darkMode = "undefined" != typeof darkMode && darkMode, userDarkMode = "undefined" == typeof userDarkMode || userDarkMode, 1 != darkMode && 0 != userDarkMode && ("dark" == localStorage.themeColor && e.addClass("is-dark"), $(".darkmode-toggle").on("click", function() {
        "dark" != localStorage.themeColor ? (e.addClass("is-dark"), localStorage.themeColor = "dark") : (e.removeClass("is-dark"), localStorage.themeColor = "light")
    }))
}), $("#ticker .PopularPosts .widget-content").tickerify(), $(".sidebar .social-icons li a").each(function(e) {
    var t = $(this),
        o = t.attr("href").split("#");
    null != o[1] && "" != (e = o[1].trim()) && t.append('<span class="text">' + e + "</span>"), t.attr("href", o[0].trim())
}), $("#litespot-pro-new-before-ad").each(function() {
    var e = $(this);
    e.length && $("#before-ad").appendTo(e)
}), $("#litespot-pro-new-after-ad").each(function() {
    var e = $(this);
    e.length && $("#after-ad").appendTo(e)
}), $("#litespot-pro-main-before-ad .widget").each(function() {
    var e = $(this);
    e.length && e.appendTo($("#before-ad"))
}), $("#litespot-pro-main-after-ad .widget").each(function() {
    var e = $(this);
    e.length && e.appendTo($("#after-ad"))
}), $("#litespot-pro-post-footer-ads .widget").each(function() {
    var e = $(this);
    e.length && e.appendTo($("#post-footer-ads"))
}), $(".entry-share-links .window-ify,.litespot-pro-share-links .window-ify").on("click", function() {
    var e = $(this),
        t = e.data("url"),
        o = e.data("width"),
        i = e.data("height"),
        a = window.screen.width,
        n = window.screen.height,
        s = Math.round(a / 2 - o / 2),
        r = Math.round(n / 2 - i / 2);
    window.open(t, "_blank", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + o + ",height=" + i + ",left=" + s + ",top=" + r).focus()
}), $(".litespot-pro-share-links").each(function() {
    var e = $(this);
    e.find(".show-hid a").on("click", function() {
        e.toggleClass("show-hidden")
    })
}), $(".about-author .author-text").each(function() {
    var e = $(this),
        t = e.find("a");
    t.each(function() {
        var e = $(this),
            t = e.text().trim(),
            o = e.attr("href");
        e.replaceWith('<li class="' + t + '"><a href="' + o + '" title="' + t + '" rel="noopener noreferrer" target="_blank"/></li>')
    }), t.length && e.parent().append('<ul class="author-links social social-color"></ul>'), e.find("li").appendTo(".author-links")
}), $(function() {
    $(".entry-image-wrap .entry-thumb,.author-avatar-wrap .author-avatar").lazyify(), $("#litespot-pro-mobile-menu").each(function() {
        var e = $(this),
            t = $("#litespot-pro-main-nav-menu").clone();
        t.attr("id", "main-mobile-nav"), t.find(".mega-items").remove(), t.find(".mega-menu > a").each(function(e, t) {
            var o = $(this),
                i = o.data("shortcode");
            null != i && (t = "recent" == (e = shortCodeIfy(i.trim(), "label")) ? "/search" : "/search/label/" + e, o.attr("href", t))
        }), t.appendTo(e), $(".mobile-menu-toggle, .hide-litespot-pro-mobile-menu, .overlay").on("click", function() {
            $("body").toggleClass("nav-active")
        }), $(".litespot-pro-mobile-menu .has-sub").append('<div class="submenu-toggle"/>'), $(".litespot-pro-mobile-menu .mega-menu").find(".submenu-toggle").remove(), $(".litespot-pro-mobile-menu ul li .submenu-toggle").on("click", function(e) {
            $(this).parent().hasClass("has-sub") && (e.preventDefault(), $(this).parent().hasClass("show") ? $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170) : $(this).parent().addClass("show").children(".m-sub").slideToggle(170))
        })
    }), $(".mm-footer .mm-social").each(function() {
        var e = $(this),
            t = $("#litespot-pro-about-section ul.social").clone();
        t.removeClass("social-bg-hover"), t.appendTo(e)
    }), $(".mm-footer .mm-menu").each(function() {
        var e = $(this);
        $("#footer-menu ul.link-list").clone().appendTo(e)
    }), $(".header-inner").each(function() {
        var e = $(this);
        if (1 == fixedMenu && e.length > 0) {
            var t = $(document).scrollTop(),
                o = e.offset().top,
                i = e.height(),
                a = o + i + i;
            $(window).scroll(function() {
                var i = $(document).scrollTop();
                i > a ? e.addClass("is-fixed") : (i < o || i <= 1) && e.removeClass("is-fixed"), i > t ? e.removeClass("show") : e.addClass("show"), t = i
            })
        }
    }), $("#litespot-pro-load-more-link").each(function() {
        var e = $(this).data("load");
        e && $("#litespot-pro-load-more-link").show(), $("#litespot-pro-load-more-link").on("click", function(t) {
            $("#litespot-pro-load-more-link").hide(), $.ajax({
                url: e,
                success: function(t) {
                    var o = $(t).find(".blog-posts");
                    o.find(".index-post").addClass("post-animated post-fadeInUp"), $(".blog-posts").append(o.html()), (e = $(t).find("#litespot-pro-load-more-link").data("load")) ? $("#litespot-pro-load-more-link").show() : ($("#litespot-pro-load-more-link").hide(), $("#blog-pager .no-more").addClass("show"))
                },
                beforeSend: function() {
                    $("#blog-pager .loading").show()
                },
                complete: function() {
                    $("#blog-pager .loading").hide(), $(".index-post .entry-image-wrap .entry-thumb").lazyify()
                }
            }), t.preventDefault()
        })
    }), $("#back-top").each(function() {
        var e = $(this);
        $(window).on("scroll", function() {
            $(this).scrollTop() >= 100 ? e.fadeIn(170) : e.fadeOut(170), e.offset().top >= $("#footer-wrapper").offset().top - 34 ? e.addClass("on-footer") : e.removeClass("on-footer")
        }), e.on("click", function() {
            $("html, body").animate({
                scrollTop: 0
            }, 500)
        })
    })
});
