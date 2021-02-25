function regxdynery(e) {
  return String(e.match(/[^{\}]+(?=})/g)).trim();
}
function beforeLoader() {
  return '<div class="loader"/>';
}
function getFeedUrl(e, t, o) {
  var n = "";
  switch (o) {
    case "comments":
      n = "list" == e ? "/feeds/comments/default?alt=json&max-results=" + t : "/feeds/posts/default/-/" + o + "?alt=json&max-results=" + t;
      break;
    default:
      n = "/feeds/posts/default/-/" + o + "?alt=json&max-results=" + t;
  }
  return n;
}
function getPostLink(e, t) {
  for (var o = 0; o < e[t].link.length; o++)
    if ("alternate" == e[t].link[o].rel) {
      var n = e[t].link[o].href;
      break;
    }
  return n;
}
function getPostTitle(e, t) {
  return e[t].title.$t;
}
function getFirstImage(e, t) {
  var o = $("<div>").html(e).find("img:first").attr("src"),
    n = o.lastIndexOf("/") || 0,
    a = o.lastIndexOf("/", n - 1) || 0,
    s = o.substring(0, a),
    i = o.substring(a, n),
    r = o.substring(n);
  return (i.match(/\/s[0-9]+/g) || i.match(/\/w[0-9]+/g) || "/d" == i) && (i = "/w72-h72-p-k-no-nu"), s + i + r;
}
function getPostImage(e, t, o) {
  var n = e[t].content.$t;
  if (e[t].media$thumbnail) var a = e[t].media$thumbnail.url;
  else a = "https://1.bp.blogspot.com/-LiMF6D7uAKs/YC7Avh5FUwI/AAAAAAAAAI4/EC6jjGKqAH42RJbukr94gdg3Mc8NpYelgCLcBGAsYHQ/s72-c/resim-yok.png";
  return n.indexOf(n.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1
    ? n.indexOf("<img") > -1
      ? n.indexOf(n.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < n.indexOf("<img")
        ? a.replace("/default.", "/0.")
        : getFirstImage(n)
      : a.replace("/default.", "/0.")
    : n.indexOf("<img") > -1
    ? getFirstImage(n)
    : "https://1.bp.blogspot.com/-LiMF6D7uAKs/YC7Avh5FUwI/AAAAAAAAAI4/EC6jjGKqAH42RJbukr94gdg3Mc8NpYelgCLcBGAsYHQ/s72-c/resim-yok.png";
}
function getPostAuthor(e, t) {
  return (t = e[t].author[0].name.$t), "true" == messages.postAuthor ? '<span class="entry-author">' + t + "</span>" : "";
}
function getPostDate(e, t) {
  var o = e[t].published.$t,
    n = o.substring(0, 4),
    a = o.substring(5, 7),
    s = o.substring(8, 10),
    i = monthFormat[parseInt(a, 10) - 1] + " " + s + ", " + n;
  if ("true" == messages.postDate) var r = '<span class="entry-time"><time class="published" datetime="' + o + '">' + i + "</time></span>";
  else r = "";
  return r;
}
function getPostMeta(e, t) {
  if ("true" == messages.postAuthor || "true" == messages.postDate) var o = '<div class="meta-list">' + e + t + "</div>";
  else o = "";
  if ("true" == messages.postDate) var n = '<div class="meta-list">' + t + "</div>";
  else n = "";
  return [o, n];
}
function getPostLabel(e, t) {
  if (null != e[t].category) var o = '<span class="entry-category">' + e[t].category[0].term + "</span>";
  else o = "";
  return o;
}
function getCustomStyle(e, t, o) {
  if ("" != o) {
    if ("featured" == e) var n = ".id-" + e + "-" + t + " .entry-category{background-color:" + o + ";color:#fff}.id-" + e + "-" + t + " .loader:after{border-color:" + o + ";border-right-color:rgba(155,155,155,0.2)}";
  } else n = "";
  return n;
}
(function (e) {
  e.fn.replaceText = function (t, o, n) {
    return this.each(function () {
      var a,
        s,
        i = this.firstChild,
        r = [];
      if (i)
        do {
          3 === i.nodeType && (s = (a = i.nodeValue).replace(t, o)) !== a && (!n && /</.test(s) ? (e(i).before(s), r.push(i)) : (i.nodeValue = s));
        } while ((i = i.nextSibling));
      r.length && e(r).remove();
    });
  };
})(jQuery),
  (function (e) {
    e.fn.replaceText = function (t, o, n) {
      return this.each(function () {
        var a,
          s,
          i = this.firstChild,
          r = [];
        if (i)
          do {
            3 === i.nodeType && (s = (a = i.nodeValue).replace(t, o)) !== a && (!n && /</.test(s) ? (e(i).before(s), r.push(i)) : (i.nodeValue = s));
          } while ((i = i.nextSibling));
        r.length && e(r).remove();
      });
    };
  })(jQuery),
  $(".search-toggle").on("click", function () {
    $("body").toggleClass("search-active");
  }),
  $("#social-counter ul.social-icons li a").each(function () {
    var e = $(this),
      t = e.find(".count"),
      o = e.data("content").trim().split("$"),
      n = o[0],
      a = o[1];
    e.attr("href", n), t.text(a);
  }),
  $(".avatar-image-container img").attr("src", function (e, t) {
    return (t = t.replace("//dynery.github.io/blank.gif", "//1.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg")).replace(
      "//dynery.github.io/blank.gif",
      "//1.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg"
    );
  }),
  $(".post-body a").each(function () {
    var e = $(this),
      t = e.text().trim(),
      o = t.split("/"),
      n = o[0],
      a = o[1],
      s = o.pop();
    t.match("button") && (e.addClass("button").text(n), "button" != a && e.addClass(a), "button" != s && e.addClass("colored-button").css({ "background-color": s }));
  }),
  $(".share-links .window-dynery,.entry-share .window-dynery").on("click", function () {
    var e = $(this),
      t = e.data("url"),
      o = e.data("width"),
      n = e.data("height"),
      a = window.screen.width,
      s = window.screen.height,
      i = Math.round(a / 2 - o / 2),
      r = Math.round(s / 2 - n / 2);
    window.open(t, "_blank", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + o + ",height=" + n + ",left=" + i + ",top=" + r).focus();
  }),
  $(".share-links").each(function () {
    var e = $(this);
    e.find(".show-hid a").on("click", function () {
      e.toggleClass("show-hidden");
    });
  }),
  $(".about-author .author-description span a").each(function () {
    var e = $(this),
      t = e.text().trim(),
      o = e.attr("href");
    e.replaceWith('<li class="' + t + '"><a href="' + o + '" title="' + t + '" target="_blank"/></li>'), $(".author-description").append($(".author-description span li")), $(".author-description").addClass("show-icons");
  }),
  $(".blog-post-comments").each(function () {
    var e = $(this);
    e.addClass("comments-system-blogger").show(), $(".meta-list .entry-comments-link").addClass("show");
    var t = e.find(".comments .toplevel-thread > ol > .comment .comment-actions .comment-reply"),
      o = e.find(".comments .toplevel-thread > #top-continue");
    t.on("click", function () {
      o.show();
    }),
      o.on("click", function () {
        o.hide();
      });
  }),
  $(function () {
    $(".mobile-logo").each(function () {
      var e = $(this),
        t = $("#brand .header-widget a").clone();
      t.find("#h1-tag").remove(), t.appendTo(e);
    }),
      $("#mobile-menu").each(function () {
        var e = $(this),
          t = $("#menu-nav").clone();
        t.attr("id", "main-mobile-nav"),
          t.appendTo(e),
          $(".on-mobile-menu, .hide-mobile-menu, .overlay").on("click", function () {
            $("body").toggleClass("nav-active");
          }),
          $(".mobile-menu .has-sub").append('<div class="submenu-toggle"/>'),
          $(".mobile-menu ul li .submenu-toggle").on("click", function (e) {
            $(this).parent().hasClass("has-sub") &&
              (e.preventDefault(), $(this).parent().hasClass("show") ? $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170) : $(this).parent().addClass("show").children(".m-sub").slideToggle(170));
          });
      }),
      $(".social-mobile").each(function () {
        var e = $(this);
        $("#navbar-social ul.social").clone().appendTo(e);
      }),
      $("#header-section .headsection").each(function () {
        var e = $(this),
          t = $(document).scrollTop(),
          o = e.offset().top,
          n = e.height(),
          a = o + n;
        $(window).scroll(function () {
          var o = $(document).scrollTop();
          o < $("#footer-wrapper").offset().top - n && (o > a ? e.addClass("is-fixed") : 0 >= o && e.removeClass("is-fixed"), o > t ? e.removeClass("show") : e.addClass("show"), (t = $(document).scrollTop()));
        });
      }),
      $(".back-top").each(function () {
        var e = $(this);
        $(window).on("scroll", function () {
          $(this).scrollTop() >= 100 ? e.fadeIn(250) : e.fadeOut(250), e.offset().top >= $("#footer-wrapper").offset().top - 32 ? e.addClass("on-footer") : e.removeClass("on-footer");
        }),
          e.click(function () {
            $("html, body").animate({ scrollTop: 0 }, 500);
          });
      }),
      $("#load-more-link").each(function () {
        var e = $(this).data("load");
        e && $("#load-more-link").show(),
          $("#load-more-link").on("click", function (t) {
            $("#load-more-link").hide(),
              $.ajax({
                url: e,
                success: function (t) {
                  var o = $(t).find(".blog-posts");
                    $(".blog-posts").append(o.html()),
                    (e = $(t).find("#load-more-link").data("load")) ? $("#load-more-link").show() : ($("#load-more-link").hide(), $("#blog-pager .no-more").addClass("show")),
                    $(".index-post .entry-image-link .entry-thumb").lazydynery();
                },
                beforeSend: function () {
                  $("#blog-pager .loading").show();
                },
                complete: function () {
                  $("#blog-pager .loading").hide();
                },
              }),
              t.preventDefault();
          });
      });
  });
