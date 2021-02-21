(function ($) {
  $.fn.theiaStickySidebar = function (options) {
    var defaults = {
      containerSelector: "",
      additionalMarginTop: 0,
      additionalMarginBottom: 0,
      updateSidebarHeight: true,
      minWidth: 0,
      disableOnResponsiveLayouts: true,
      sidebarBehavior: "modern",
      defaultPosition: "relative",
      namespace: "TSS",
    };
    options = $.extend(defaults, options);
    options.additionalMarginTop = parseInt(options.additionalMarginTop) || 0;
    options.additionalMarginBottom = parseInt(options.additionalMarginBottom) || 0;
    tryInitOrHookIntoEvents(options, this);
    function tryInitOrHookIntoEvents(options, $that) {
      var success = tryInit(options, $that);
      if (!success) {
        console.log("TSS: Body width smaller than options.minWidth. Init is delayed.");
        $(document).on(
          "scroll." + options.namespace,
          (function (options, $that) {
            return function (evt) {
              var success = tryInit(options, $that);
              if (success) {
                $(this).unbind(evt);
              }
            };
          })(options, $that)
        );
        $(window).on(
          "resize." + options.namespace,
          (function (options, $that) {
            return function (evt) {
              var success = tryInit(options, $that);
              if (success) {
                $(this).unbind(evt);
              }
            };
          })(options, $that)
        );
      }
    }
    function tryInit(options, $that) {
      if (options.initialized === true) {
        return true;
      }
      if ($("body").width() < options.minWidth) {
        return false;
      }
      init(options, $that);
      return true;
    }
    function init(options, $that) {
      options.initialized = true;
      var existingStylesheet = $("#theia-sticky-sidebar-stylesheet-" + options.namespace);
      if (existingStylesheet.length === 0) {
        $("head").append($('<style id="theia-sticky-sidebar-stylesheet-' + options.namespace + '">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'));
      }
      $that.each(function () {
        var o = {};
        o.sidebar = $(this);
        o.options = options || {};
        o.container = $(o.options.containerSelector);
        if (o.container.length == 0) {
          o.container = o.sidebar.parent();
        }
        o.sidebar.parents().css("-webkit-transform", "none");
        o.sidebar.css({ position: o.options.defaultPosition, overflow: "visible", "-webkit-box-sizing": "border-box", "-moz-box-sizing": "border-box", "box-sizing": "border-box" });
        o.stickySidebar = o.sidebar.find(".theiaStickySidebar");
        if (o.stickySidebar.length == 0) {
          var javaScriptMIMETypes = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
          o.sidebar
            .find("script")
            .filter(function (index, script) {
              return script.type.length === 0 || script.type.match(javaScriptMIMETypes);
            })
            .remove();
          o.stickySidebar = $("<div>").addClass("theiaStickySidebar").append(o.sidebar.children());
          o.sidebar.append(o.stickySidebar);
        }
        o.marginBottom = parseInt(o.sidebar.css("margin-bottom"));
        o.paddingTop = parseInt(o.sidebar.css("padding-top"));
        o.paddingBottom = parseInt(o.sidebar.css("padding-bottom"));
        var collapsedTopHeight = o.stickySidebar.offset().top;
        var collapsedBottomHeight = o.stickySidebar.outerHeight();
        o.stickySidebar.css("padding-top", 1);
        o.stickySidebar.css("padding-bottom", 1);
        collapsedTopHeight -= o.stickySidebar.offset().top;
        collapsedBottomHeight = o.stickySidebar.outerHeight() - collapsedBottomHeight - collapsedTopHeight;
        if (collapsedTopHeight == 0) {
          o.stickySidebar.css("padding-top", 0);
          o.stickySidebarPaddingTop = 0;
        } else {
          o.stickySidebarPaddingTop = 1;
        }
        if (collapsedBottomHeight == 0) {
          o.stickySidebar.css("padding-bottom", 0);
          o.stickySidebarPaddingBottom = 0;
        } else {
          o.stickySidebarPaddingBottom = 1;
        }
        o.previousScrollTop = null;
        o.fixedScrollTop = 0;
        resetSidebar();
        o.onScroll = function (o) {
          if (!o.stickySidebar.is(":visible")) {
            return;
          }
          if ($("body").width() < o.options.minWidth) {
            resetSidebar();
            return;
          }
          if (o.options.disableOnResponsiveLayouts) {
            var sidebarWidth = o.sidebar.outerWidth(o.sidebar.css("float") == "none");
            if (sidebarWidth + 50 > o.container.width()) {
              resetSidebar();
              return;
            }
          }
          var scrollTop = $(document).scrollTop();
          var position = "static";
          if (scrollTop >= o.sidebar.offset().top + (o.paddingTop - o.options.additionalMarginTop)) {
            var offsetTop = o.paddingTop + options.additionalMarginTop;
            var offsetBottom = o.paddingBottom + o.marginBottom + options.additionalMarginBottom;
            var containerTop = o.sidebar.offset().top;
            var containerBottom = o.sidebar.offset().top + getClearedHeight(o.container);
            var windowOffsetTop = 0 + options.additionalMarginTop;
            var windowOffsetBottom;
            var sidebarSmallerThanWindow = o.stickySidebar.outerHeight() + offsetTop + offsetBottom < $(window).height();
            if (sidebarSmallerThanWindow) {
              windowOffsetBottom = windowOffsetTop + o.stickySidebar.outerHeight();
            } else {
              windowOffsetBottom = $(window).height() - o.marginBottom - o.paddingBottom - options.additionalMarginBottom;
            }
            var staticLimitTop = containerTop - scrollTop + o.paddingTop;
            var staticLimitBottom = containerBottom - scrollTop - o.paddingBottom - o.marginBottom;
            var top = o.stickySidebar.offset().top - scrollTop;
            var scrollTopDiff = o.previousScrollTop - scrollTop;
            if (o.stickySidebar.css("position") == "fixed") {
              if (o.options.sidebarBehavior == "modern") {
                top += scrollTopDiff;
              }
            }
            if (o.options.sidebarBehavior == "stick-to-top") {
              top = options.additionalMarginTop;
            }
            if (o.options.sidebarBehavior == "stick-to-bottom") {
              top = windowOffsetBottom - o.stickySidebar.outerHeight();
            }
            if (scrollTopDiff > 0) {
              top = Math.min(top, windowOffsetTop);
            } else {
              top = Math.max(top, windowOffsetBottom - o.stickySidebar.outerHeight());
            }
            top = Math.max(top, staticLimitTop);
            top = Math.min(top, staticLimitBottom - o.stickySidebar.outerHeight());
            var sidebarSameHeightAsContainer = o.container.height() == o.stickySidebar.outerHeight();
            if (!sidebarSameHeightAsContainer && top == windowOffsetTop) {
              position = "fixed";
            } else if (!sidebarSameHeightAsContainer && top == windowOffsetBottom - o.stickySidebar.outerHeight()) {
              position = "fixed";
            } else if (scrollTop + top - o.sidebar.offset().top - o.paddingTop <= options.additionalMarginTop) {
              position = "static";
            } else {
              position = "absolute";
            }
          }
          if (position == "fixed") {
            var scrollLeft = $(document).scrollLeft();
            o.stickySidebar.css({
              position: "fixed",
              width: getWidthForObject(o.stickySidebar) + "px",
              transform: "translateY(" + top + "px)",
              left: o.sidebar.offset().left + parseInt(o.sidebar.css("padding-left")) - scrollLeft + "px",
              top: "0px",
            });
          } else if (position == "absolute") {
            var css = {};
            if (o.stickySidebar.css("position") != "absolute") {
              css.position = "absolute";
              css.transform = "translateY(" + (scrollTop + top - o.sidebar.offset().top - o.stickySidebarPaddingTop - o.stickySidebarPaddingBottom) + "px)";
              css.top = "0px";
            }
            css.width = getWidthForObject(o.stickySidebar) + "px";
            css.left = "";
            o.stickySidebar.css(css);
          } else if (position == "static") {
            resetSidebar();
          }
          if (position != "static") {
            if (o.options.updateSidebarHeight == true) {
              o.sidebar.css({ "min-height": o.stickySidebar.outerHeight() + o.stickySidebar.offset().top - o.sidebar.offset().top + o.paddingBottom });
            }
          }
          o.previousScrollTop = scrollTop;
        };
        o.onScroll(o);
        $(document).on(
          "scroll." + o.options.namespace,
          (function (o) {
            return function () {
              o.onScroll(o);
            };
          })(o)
        );
        $(window).on(
          "resize." + o.options.namespace,
          (function (o) {
            return function () {
              o.stickySidebar.css({ position: "static" });
              o.onScroll(o);
            };
          })(o)
        );
        if (typeof ResizeSensor !== "undefined") {
          new ResizeSensor(
            o.stickySidebar[0],
            (function (o) {
              return function () {
                o.onScroll(o);
              };
            })(o)
          );
        }
        function resetSidebar() {
          o.fixedScrollTop = 0;
          o.sidebar.css({ "min-height": "1px" });
          o.stickySidebar.css({ position: "static", width: "", transform: "none" });
        }
        function getClearedHeight(e) {
          var height = e.height();
          e.children().each(function () {
            height = Math.max(height, $(this).height());
          });
          return height;
        }
      });
    }
    function getWidthForObject(object) {
      var width;
      try {
        width = object[0].getBoundingClientRect().width;
      } catch (err) {}
      if (typeof width === "undefined") {
        width = object.width();
      }
      return width;
    }
    return this;
  };
})(jQuery);
(function ($) {
  $.fn.replaceText = function (b, a, c) {
    return this.each(function () {
      var f = this.firstChild,
        g,
        e,
        d = [];
      if (f) {
        do {
          if (f.nodeType === 3) {
            g = f.nodeValue;
            e = g.replace(b, a);
            if (e !== g) {
              if (!c && /</.test(e)) {
                $(f).before(e);
                d.push(f);
              } else {
                f.nodeValue = e;
              }
            }
          }
        } while ((f = f.nextSibling));
      }
      d.length && $(d).remove();
    });
  };
})(jQuery);
function regxdynery(t) {
  return String(t.match(/[^{\}]+(?=})/g)).trim();
}
function beforeLoader() {
  return '<div class="loader"/>';
}
function getPostLink(t, e) {
  for (var i = 0; i < t[e].link.length; i++)
    if ("alternate" == t[e].link[i].rel) {
      var o = t[e].link[i].href;
      break;
    }
  return o;
}
function getPostTitle(t, e) {
  return t[e].title.$t;
}
function getFirstImage(t, e) {
  var i = $("<div>").html(t).find("img:first").attr("src"),
    o = i.lastIndexOf("/") || 0,
    a = i.lastIndexOf("/", o - 1) || 0,
    n = i.substring(0, a),
    s = i.substring(a, o),
    r = i.substring(o);
  return (s.match(/\/s[0-9]+/g) || s.match(/\/w[0-9]+/g) || "/d" == s) && (s = "/w72-h72-p-k-no-nu"), n + s + r;
}
function getPostImage(t, e, i) {
  var o = t[e].content.$t;
  if (t[e].media$thumbnail) var a = t[e].media$thumbnail.url;
  else a = "https://1.bp.blogspot.com/-LiMF6D7uAKs/YC7Avh5FUwI/AAAAAAAAAI4/EC6jjGKqAH42RJbukr94gdg3Mc8NpYelgCLcBGAsYHQ/s72-c/resim-yok.png";
  return o.indexOf(o.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1
    ? o.indexOf("<img") > -1
      ? o.indexOf(o.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < o.indexOf("<img")
        ? a.replace("/default.", "/0.")
        : getFirstImage(o)
      : a.replace("/default.", "/0.")
    : o.indexOf("<img") > -1
    ? getFirstImage(o)
    : "https://1.bp.blogspot.com/-LiMF6D7uAKs/YC7Avh5FUwI/AAAAAAAAAI4/EC6jjGKqAH42RJbukr94gdg3Mc8NpYelgCLcBGAsYHQ/s72-c/resim-yok.png";
}
function getPostAuthor(t, e) {
  return (e = t[e].author[0].name.$t), "true" == messages.postAuthor ? '<span class="entry-author">' + e + "</span>" : "";
}
function getPostDate(t, e) {
  var i = t[e].published.$t,
    o = i.substring(0, 4),
    a = i.substring(5, 7),
    n = i.substring(8, 10),
    s = monthFormat[parseInt(a, 10) - 1] + " " + n + ", " + o;
  if ("true" == messages.postDate) var r = '<span class="entry-time"><time class="published" datetime="' + i + '">' + s + "</time></span>";
  else r = "";
  return r;
}
function getPostMeta(t, e) {
  if ("true" == messages.postAuthor || "true" == messages.postDate) var i = '<div class="meta-list">' + t + e + "</div>";
  else i = "";
  if ("true" == messages.postDate) var o = '<div class="meta-list">' + e + "</div>";
  else o = "";
  return [i, o];
}
function getPostLabel(t, e) {
  if (null != t[e].category) var i = '<span class="entry-category">' + t[e].category[0].term + "</span>";
  else i = "";
  return i;
}
function getCustomStyle(t, e, i) {
  if ("" != i) {
    if ("featured" == t) var o = ".id-" + t + "-" + e + " .entry-category{background-color:" + i + ";color:#fff}.id-" + t + "-" + e + " .loader:after{border-color:" + i + ";border-right-color:rgba(155,155,155,0.2)}";
  } else o = "";
  return o;
}
!(function (t) {
  t.fn.theiaStickySidebar = function (e) {
    function i(e, i) {
      return (
        !0 === e.initialized ||
        (!(t("body").width() < e.minWidth) &&
          ((function (e, i) {
            (e.initialized = !0),
              0 === t("#theia-sticky-sidebar-stylesheet-" + e.namespace).length &&
                t("head").append(t('<style id="theia-sticky-sidebar-stylesheet-' + e.namespace + '">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>')),
              i.each(function () {
                var i = {};
                if (
                  ((i.sidebar = t(this)),
                  (i.options = e || {}),
                  (i.container = t(i.options.containerSelector)),
                  0 == i.container.length && (i.container = i.sidebar.parent()),
                  i.sidebar.parents().css("-webkit-transform", "none"),
                  i.sidebar.css({ position: i.options.defaultPosition, overflow: "visible", "-webkit-box-sizing": "border-box", "-moz-box-sizing": "border-box", "box-sizing": "border-box" }),
                  (i.stickySidebar = i.sidebar.find(".theiaStickySidebar")),
                  0 == i.stickySidebar.length)
                ) {
                  var a = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
                  i.sidebar
                    .find("script")
                    .filter(function (t, e) {
                      return 0 === e.type.length || e.type.match(a);
                    })
                    .remove(),
                    (i.stickySidebar = t("<div>").addClass("theiaStickySidebar").append(i.sidebar.children())),
                    i.sidebar.append(i.stickySidebar);
                }
                (i.marginBottom = parseInt(i.sidebar.css("margin-bottom"))), (i.paddingTop = parseInt(i.sidebar.css("padding-top"))), (i.paddingBottom = parseInt(i.sidebar.css("padding-bottom")));
                var n = i.stickySidebar.offset().top,
                  s = i.stickySidebar.outerHeight();
                function r() {
                  (i.fixedScrollTop = 0), i.sidebar.css({ "min-height": "1px" }), i.stickySidebar.css({ position: "static", width: "", transform: "none" });
                }
                i.stickySidebar.css("padding-top", 1),
                  i.stickySidebar.css("padding-bottom", 1),
                  (n -= i.stickySidebar.offset().top),
                  (s = i.stickySidebar.outerHeight() - s - n),
                  0 == n ? (i.stickySidebar.css("padding-top", 0), (i.stickySidebarPaddingTop = 0)) : (i.stickySidebarPaddingTop = 1),
                  0 == s ? (i.stickySidebar.css("padding-bottom", 0), (i.stickySidebarPaddingBottom = 0)) : (i.stickySidebarPaddingBottom = 1),
                  (i.previousScrollTop = null),
                  (i.fixedScrollTop = 0),
                  r(),
                  (i.onScroll = function (i) {
                    if (i.stickySidebar.is(":visible"))
                      if (t("body").width() < i.options.minWidth) r();
                      else {
                        if (i.options.disableOnResponsiveLayouts && i.sidebar.outerWidth("none" == i.sidebar.css("float")) + 50 > i.container.width()) return void r();
                        var a,
                          n,
                          s = t(document).scrollTop(),
                          d = "static";
                        if (s >= i.sidebar.offset().top + (i.paddingTop - i.options.additionalMarginTop)) {
                          var c,
                            l = i.paddingTop + e.additionalMarginTop,
                            u = i.paddingBottom + i.marginBottom + e.additionalMarginBottom,
                            p = i.sidebar.offset().top,
                            h =
                              i.sidebar.offset().top +
                              ((a = i.container),
                              (n = a.height()),
                              a.children().each(function () {
                                n = Math.max(n, t(this).height());
                              }),
                              n),
                            m = 0 + e.additionalMarginTop;
                          c = i.stickySidebar.outerHeight() + l + u < t(window).height() ? m + i.stickySidebar.outerHeight() : t(window).height() - i.marginBottom - i.paddingBottom - e.additionalMarginBottom;
                          var f = p - s + i.paddingTop,
                            b = h - s - i.paddingBottom - i.marginBottom,
                            g = i.stickySidebar.offset().top - s,
                            y = i.previousScrollTop - s;
                          "fixed" == i.stickySidebar.css("position") && "modern" == i.options.sidebarBehavior && (g += y),
                            "stick-to-top" == i.options.sidebarBehavior && (g = e.additionalMarginTop),
                            "stick-to-bottom" == i.options.sidebarBehavior && (g = c - i.stickySidebar.outerHeight()),
                            (g = y > 0 ? Math.min(g, m) : Math.max(g, c - i.stickySidebar.outerHeight())),
                            (g = Math.max(g, f)),
                            (g = Math.min(g, b - i.stickySidebar.outerHeight()));
                          var v = i.container.height() == i.stickySidebar.outerHeight();
                          d = (!v && g == m) || (!v && g == c - i.stickySidebar.outerHeight()) ? "fixed" : s + g - i.sidebar.offset().top - i.paddingTop <= e.additionalMarginTop ? "static" : "absolute";
                        }
                        if ("fixed" == d) {
                          var w = t(document).scrollLeft();
                          i.stickySidebar.css({ position: "fixed", width: o(i.stickySidebar) + "px", transform: "translateY(" + g + "px)", left: i.sidebar.offset().left + parseInt(i.sidebar.css("padding-left")) - w + "px", top: "0px" });
                        } else if ("absolute" == d) {
                          var k = {};
                          "absolute" != i.stickySidebar.css("position") &&
                            ((k.position = "absolute"), (k.transform = "translateY(" + (s + g - i.sidebar.offset().top - i.stickySidebarPaddingTop - i.stickySidebarPaddingBottom) + "px)"), (k.top = "0px")),
                            (k.width = o(i.stickySidebar) + "px"),
                            (k.left = ""),
                            i.stickySidebar.css(k);
                        } else "static" == d && r();
                        "static" != d && 1 == i.options.updateSidebarHeight && i.sidebar.css({ "min-height": i.stickySidebar.outerHeight() + i.stickySidebar.offset().top - i.sidebar.offset().top + i.paddingBottom }),
                          (i.previousScrollTop = s);
                      }
                  }),
                  i.onScroll(i),
                  t(document).on(
                    "scroll." + i.options.namespace,
                    (function (t) {
                      return function () {
                        t.onScroll(t);
                      };
                    })(i)
                  ),
                  t(window).on(
                    "resize." + i.options.namespace,
                    (function (t) {
                      return function () {
                        t.stickySidebar.css({ position: "static" }), t.onScroll(t);
                      };
                    })(i)
                  ),
                  "undefined" != typeof ResizeSensor &&
                    new ResizeSensor(
                      i.stickySidebar[0],
                      (function (t) {
                        return function () {
                          t.onScroll(t);
                        };
                      })(i)
                    );
              });
          })(e, i),
          !0))
      );
    }
    function o(t) {
      var e;
      try {
        e = t[0].getBoundingClientRect().width;
      } catch (t) {}
      return void 0 === e && (e = t.width()), e;
    }
    return (
      ((e = t.extend(
        { containerSelector: "", additionalMarginTop: 0, additionalMarginBottom: 0, updateSidebarHeight: !0, minWidth: 0, disableOnResponsiveLayouts: !0, sidebarBehavior: "modern", defaultPosition: "relative", namespace: "TSS" },
        e
      )).additionalMarginTop = parseInt(e.additionalMarginTop) || 0),
      (e.additionalMarginBottom = parseInt(e.additionalMarginBottom) || 0),
      (function (e, o) {
        i(e, o) ||
          (console.log("TSS: Body width smaller than options.minWidth. Init is delayed."),
          t(document).on(
            "scroll." + e.namespace,
            (function (e, o) {
              return function (a) {
                i(e, o) && t(this).unbind(a);
              };
            })(e, o)
          ),
          t(window).on(
            "resize." + e.namespace,
            (function (e, o) {
              return function (a) {
                i(e, o) && t(this).unbind(a);
              };
            })(e, o)
          ));
      })(e, this),
      this
    );
  };
})(jQuery),
  (function (t) {
    t.fn.lazydynery = function () {
      return this.each(function () {
        var e = t(this),
          i = e.attr("data-image"),
          o = "w" + Math.round(e.width()) + "-h" + Math.round(e.height()) + "-p-k-no-nu",
          a = "";
        function n() {
          var i = t(window).height();
          if (t(window).scrollTop() + i > e.offset().top) {
            var o = new Image();
            (o.onload = function () {
              e.attr("style", "background-image:url(" + this.src + ")").addClass("lazy-dynery");
            }),
              (o.src = a);
          }
        }
        (a = i.match("/s72-c") ? i.replace("/s72-c", "/" + o) : i.match("/w72-h") ? i.replace("/w72-h72-p-k-no-nu", "/" + o) : i.match("=w72-h") ? i.replace("=w72-h72-p-k-no-nu", "=" + o) : i), t(window).on("load resize scroll", n), n();
      });
    };
  })(jQuery),
  (function (t) {
    t.fn.replaceText = function (e, i, o) {
      return this.each(function () {
        var a,
          n,
          s = this.firstChild,
          r = [];
        if (s)
          do {
            3 === s.nodeType && (n = (a = s.nodeValue).replace(e, i)) !== a && (!o && /</.test(n) ? (t(s).before(n), r.push(s)) : (s.nodeValue = n));
          } while ((s = s.nextSibling));
        r.length && t(r).remove();
      });
    };
  })(jQuery),
  $(".search-toggle").on("click", function () {
    $("body").toggleClass("search-active");
  }),
  $("#social-counter ul.social-icons li a").each(function () {
    var t = $(this),
      e = t.find(".count"),
      i = t.data("content").trim().split("$"),
      o = i[0],
      a = i[1];
    t.attr("href", o), e.text(a);
  }),
  $(".avatar-image-container img").attr("src", function (t, e) {
    return (e = e.replace("//dynery.github.io/blank.gif", "//1.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg")).replace(
      "//dynery.github.io/blank.gif",
      "//1.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg"
    );
  }),
  $(".post-body a").each(function () {
    var t = $(this),
      e = t.text().trim(),
      i = e.split("/"),
      o = i[0],
      a = i[1],
      n = i.pop();
    e.match("button") && (t.addClass("button").text(o), "button" != a && t.addClass(a), "button" != n && t.addClass("colored-button").css({ "background-color": n }));
  }),
  $(".share-links .window-dynery,.entry-share .window-dynery").on("click", function () {
    var t = $(this),
      e = t.data("url"),
      i = t.data("width"),
      o = t.data("height"),
      a = window.screen.width,
      n = window.screen.height,
      s = Math.round(a / 2 - i / 2),
      r = Math.round(n / 2 - o / 2);
    window.open(e, "_blank", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + i + ",height=" + o + ",left=" + s + ",top=" + r).focus();
  }),
  $(".share-links").each(function () {
    var t = $(this);
    t.find(".show-hid a").on("click", function () {
      t.toggleClass("show-hidden");
    });
  }),
  $(".about-author .author-description span a").each(function () {
    var t = $(this),
      e = t.text().trim(),
      i = t.attr("href");
    t.replaceWith('<li class="' + e + '"><a href="' + i + '" title="' + e + '" target="_blank"/></li>'), $(".author-description").append($(".author-description span li")), $(".author-description").addClass("show-icons");
  }),
  $(".blog-post-comments").each(function () {
    var t = $(this);
    t.addClass("comments-system-blogger").show(), $(".meta-list .entry-comments-link").addClass("show");
    var e = t.find(".comments .toplevel-thread > ol > .comment .comment-actions .comment-reply"),
      i = t.find(".comments .toplevel-thread > #top-continue");
    e.on("click", function () {
      i.show();
    }),
      i.on("click", function () {
        i.hide();
      });
  }),
  $(function () {
    $(".index-post .entry-image-link .entry-thumb, .PopularPosts .entry-image-link .entry-thumb, .FeaturedPost .entry-image-link .entry-thumb,.about-author .author-avatar").lazydynery(),
      $(".mobile-logo").each(function () {
        var t = $(this),
          e = $("#brand .header-widget a").clone();
        e.find("#h1-tag").remove(), e.appendTo(t);
      }),
      $("#mobile-menu").each(function () {
        var t = $(this),
          e = $("#menu-nav").clone();
        e.attr("id", "main-mobile-nav"),
          e.appendTo(t),
          $(".on-mobile-menu, .hide-mobile-menu, .overlay").on("click", function () {
            $("body").toggleClass("nav-active");
          }),
          $(".mobile-menu .has-sub").append('<div class="submenu-toggle"/>'),
          $(".mobile-menu ul li .submenu-toggle").on("click", function (t) {
            $(this).parent().hasClass("has-sub") &&
              (t.preventDefault(), $(this).parent().hasClass("show") ? $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170) : $(this).parent().addClass("show").children(".m-sub").slideToggle(170));
          });
      }),
      $(".social-mobile").each(function () {
        var t = $(this);
        $("#navbar-social ul.social").clone().appendTo(t);
      }),
      $("#header-section .headsection").each(function () {
        var t = $(this),
          e = $(document).scrollTop(),
          i = t.offset().top,
          o = t.height(),
          a = i + o;
        $(window).scroll(function () {
          var i = $(document).scrollTop();
          i < $("#footer-wrapper").offset().top - o && (i > a ? t.addClass("is-fixed") : 0 >= i && t.removeClass("is-fixed"), i > e ? t.removeClass("show") : t.addClass("show"), (e = $(document).scrollTop()));
        });
      }),
      $("#main-wrapper,#sidebar-wrapper").each(function () {
        $(this).theiaStickySidebar({ additionalMarginTop: 90, additionalMarginBottom: 30 });
      }),
      $(".back-top").each(function () {
        var t = $(this);
        $(window).on("scroll", function () {
          $(this).scrollTop() >= 100 ? t.fadeIn(250) : t.fadeOut(250), t.offset().top >= $("#footer-wrapper").offset().top - 32 ? t.addClass("on-footer") : t.removeClass("on-footer");
        }),
          t.click(function () {
            $("html, body").animate({ scrollTop: 0 }, 500);
          });
      }),
      $("p.comment-content").each(function () {
        var t = $(this);
        t.replaceText(/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g, '<img src="$1"/>'),
          t.replaceText(
            /(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g,
            '<iframe id="youtube" width="100%" height="358" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
          );
      }),
      $("#load-more-link").each(function () {
        var t = $(this).data("load");
        t && $("#load-more-link").show(),
          $("#load-more-link").on("click", function (e) {
            $("#load-more-link").hide(),
              $.ajax({
                url: t,
                success: function (e) {
                  var i = $(e).find(".blog-posts");
                  i.find(".index-post").addClass("post-animated post-fadeInUp"),
                    $(".blog-posts").append(i.html()),
                    (t = $(e).find("#load-more-link").data("load")) ? $("#load-more-link").show() : ($("#load-more-link").hide(), $("#blog-pager .no-more").addClass("show")),
                    $(".index-post .entry-image-link .entry-thumb").lazydynery();
                },
                beforeSend: function () {
                  $("#blog-pager .loading").show();
                },
                complete: function () {
                  $("#blog-pager .loading").hide();
                },
              }),
              e.preventDefault();
          });
      });
  });
