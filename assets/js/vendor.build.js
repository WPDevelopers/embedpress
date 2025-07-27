(function() {
  "use strict";
  /*!
   * Bootstrap v3.3.7 (http://getbootstrap.com)
   * Copyright 2011-2016 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   */
  /*!
   * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=3388789be7b7c807ff47acdc21b4ef8f)
   * Config saved to config.json and https://gist.github.com/3388789be7b7c807ff47acdc21b4ef8f
   */
  if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
  +function(t) {
    var e = t.fn.jquery.split(" ")[0].split(".");
    if (e[0] < 2 && e[1] < 9 || 1 == e[0] && 9 == e[1] && e[2] < 1 || e[0] > 3) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4");
  }(jQuery), +function(t) {
    function e(e2, o2) {
      return this.each(function() {
        var s = t(this), n = s.data("bs.modal"), r = t.extend({}, i.DEFAULTS, s.data(), "object" == typeof e2 && e2);
        n || s.data("bs.modal", n = new i(this, r)), "string" == typeof e2 ? n[e2](o2) : r.show && n.show(o2);
      });
    }
    var i = function(e2, i2) {
      this.options = i2, this.$body = t(document.body), this.$element = t(e2), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = false, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
        this.$element.trigger("loaded.bs.modal");
      }, this));
    };
    i.VERSION = "3.3.7", i.TRANSITION_DURATION = 300, i.BACKDROP_TRANSITION_DURATION = 150, i.DEFAULTS = { backdrop: true, keyboard: true, show: true }, i.prototype.toggle = function(t2) {
      return this.isShown ? this.hide() : this.show(t2);
    }, i.prototype.show = function(e2) {
      var o2 = this, s = t.Event("show.bs.modal", { relatedTarget: e2 });
      this.$element.trigger(s), this.isShown || s.isDefaultPrevented() || (this.isShown = true, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
        o2.$element.one("mouseup.dismiss.bs.modal", function(e3) {
          t(e3.target).is(o2.$element) && (o2.ignoreBackdropClick = true);
        });
      }), this.backdrop(function() {
        var s2 = t.support.transition && o2.$element.hasClass("fade");
        o2.$element.parent().length || o2.$element.appendTo(o2.$body), o2.$element.show().scrollTop(0), o2.adjustDialog(), s2 && o2.$element[0].offsetWidth, o2.$element.addClass("in"), o2.enforceFocus();
        var n = t.Event("shown.bs.modal", { relatedTarget: e2 });
        s2 ? o2.$dialog.one("bsTransitionEnd", function() {
          o2.$element.trigger("focus").trigger(n);
        }).emulateTransitionEnd(i.TRANSITION_DURATION) : o2.$element.trigger("focus").trigger(n);
      }));
    }, i.prototype.hide = function(e2) {
      e2 && e2.preventDefault(), e2 = t.Event("hide.bs.modal"), this.$element.trigger(e2), this.isShown && !e2.isDefaultPrevented() && (this.isShown = false, this.escape(), this.resize(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : this.hideModal());
    }, i.prototype.enforceFocus = function() {
      t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t2) {
        document === t2.target || this.$element[0] === t2.target || this.$element.has(t2.target).length || this.$element.trigger("focus");
      }, this));
    }, i.prototype.escape = function() {
      this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t2) {
        27 == t2.which && this.hide();
      }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
    }, i.prototype.resize = function() {
      this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal");
    }, i.prototype.hideModal = function() {
      var t2 = this;
      this.$element.hide(), this.backdrop(function() {
        t2.$body.removeClass("modal-open"), t2.resetAdjustments(), t2.resetScrollbar(), t2.$element.trigger("hidden.bs.modal");
      });
    }, i.prototype.removeBackdrop = function() {
      this.$backdrop && this.$backdrop.remove(), this.$backdrop = null;
    }, i.prototype.backdrop = function(e2) {
      var o2 = this, s = this.$element.hasClass("fade") ? "fade" : "";
      if (this.isShown && this.options.backdrop) {
        var n = t.support.transition && s;
        if (this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + s).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t2) {
          return this.ignoreBackdropClick ? void (this.ignoreBackdropClick = false) : void (t2.target === t2.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()));
        }, this)), n && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e2) return;
        n ? this.$backdrop.one("bsTransitionEnd", e2).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : e2();
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass("in");
        var r = function() {
          o2.removeBackdrop(), e2 && e2();
        };
        t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : r();
      } else e2 && e2();
    }, i.prototype.handleUpdate = function() {
      this.adjustDialog();
    }, i.prototype.adjustDialog = function() {
      var t2 = this.$element[0].scrollHeight > document.documentElement.clientHeight;
      this.$element.css({ paddingLeft: !this.bodyIsOverflowing && t2 ? this.scrollbarWidth : "", paddingRight: this.bodyIsOverflowing && !t2 ? this.scrollbarWidth : "" });
    }, i.prototype.resetAdjustments = function() {
      this.$element.css({ paddingLeft: "", paddingRight: "" });
    }, i.prototype.checkScrollbar = function() {
      var t2 = window.innerWidth;
      if (!t2) {
        var e2 = document.documentElement.getBoundingClientRect();
        t2 = e2.right - Math.abs(e2.left);
      }
      this.bodyIsOverflowing = document.body.clientWidth < t2, this.scrollbarWidth = this.measureScrollbar();
    }, i.prototype.setScrollbar = function() {
      var t2 = parseInt(this.$body.css("padding-right") || 0, 10);
      this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", t2 + this.scrollbarWidth);
    }, i.prototype.resetScrollbar = function() {
      this.$body.css("padding-right", this.originalBodyPad);
    }, i.prototype.measureScrollbar = function() {
      var t2 = document.createElement("div");
      t2.className = "modal-scrollbar-measure", this.$body.append(t2);
      var e2 = t2.offsetWidth - t2.clientWidth;
      return this.$body[0].removeChild(t2), e2;
    };
    var o = t.fn.modal;
    t.fn.modal = e, t.fn.modal.Constructor = i, t.fn.modal.noConflict = function() {
      return t.fn.modal = o, this;
    }, t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(i2) {
      var o2 = t(this), s = o2.attr("href"), n = t(o2.attr("data-target") || s && s.replace(/.*(?=#[^\s]+$)/, "")), r = n.data("bs.modal") ? "toggle" : t.extend({ remote: !/#/.test(s) && s }, n.data(), o2.data());
      o2.is("a") && i2.preventDefault(), n.one("show.bs.modal", function(t2) {
        t2.isDefaultPrevented() || n.one("hidden.bs.modal", function() {
          o2.is(":visible") && o2.trigger("focus");
        });
      }), e.call(n, r, this);
    });
  }(jQuery), +function(t) {
    function e() {
      var t2 = document.createElement("bootstrap"), e2 = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" };
      for (var i in e2) if (void 0 !== t2.style[i]) return { end: e2[i] };
      return false;
    }
    t.fn.emulateTransitionEnd = function(e2) {
      var i = false, o = this;
      t(this).one("bsTransitionEnd", function() {
        i = true;
      });
      var s = function() {
        i || t(o).trigger(t.support.transition.end);
      };
      return setTimeout(s, e2), this;
    }, t(function() {
      t.support.transition = e(), t.support.transition && (t.event.special.bsTransitionEnd = { bindType: t.support.transition.end, delegateType: t.support.transition.end, handle: function(e2) {
        return t(e2.target).is(this) ? e2.handleObj.handler.apply(this, arguments) : void 0;
      } });
    });
  }(jQuery);
  !function(a2, b) {
    "function" == typeof define && define.amd ? define(["jquery"], b) : "object" == typeof exports ? module.exports = b(require("jquery")) : a2.bootbox = b(a2.jQuery);
  }(void 0, function a(b, c) {
    function d(a2) {
      var b2 = q[o.locale];
      return b2 ? b2[a2] : q.en[a2];
    }
    function e(a2, c2, d2) {
      a2.stopPropagation(), a2.preventDefault();
      var e2 = b.isFunction(d2) && d2.call(c2, a2) === false;
      e2 || c2.modal("hide");
    }
    function f(a2) {
      var b2, c2 = 0;
      for (b2 in a2) c2++;
      return c2;
    }
    function g(a2, c2) {
      var d2 = 0;
      b.each(a2, function(a3, b2) {
        c2(a3, b2, d2++);
      });
    }
    function h(a2) {
      var c2, d2;
      if ("object" != typeof a2) throw new Error("Please supply an object of options");
      if (!a2.message) throw new Error("Please specify a message");
      return a2 = b.extend({}, o, a2), a2.buttons || (a2.buttons = {}), c2 = a2.buttons, d2 = f(c2), g(c2, function(a3, e2, f2) {
        if (b.isFunction(e2) && (e2 = c2[a3] = { callback: e2 }), "object" !== b.type(e2)) throw new Error("button with key " + a3 + " must be an object");
        e2.label || (e2.label = a3), e2.className || (e2.className = 2 >= d2 && f2 === d2 - 1 ? "btn-primary" : "btn-default");
      }), a2;
    }
    function i(a2, b2) {
      var c2 = a2.length, d2 = {};
      if (1 > c2 || c2 > 2) throw new Error("Invalid argument length");
      return 2 === c2 || "string" == typeof a2[0] ? (d2[b2[0]] = a2[0], d2[b2[1]] = a2[1]) : d2 = a2[0], d2;
    }
    function j(a2, c2, d2) {
      return b.extend(true, {}, a2, i(c2, d2));
    }
    function k(a2, b2, c2, d2) {
      var e2 = { className: "bootbox-" + a2, buttons: l.apply(null, b2) };
      return m(j(e2, d2, c2), b2);
    }
    function l() {
      for (var a2 = {}, b2 = 0, c2 = arguments.length; c2 > b2; b2++) {
        var e2 = arguments[b2], f2 = e2.toLowerCase(), g2 = e2.toUpperCase();
        a2[f2] = { label: d(g2) };
      }
      return a2;
    }
    function m(a2, b2) {
      var d2 = {};
      return g(b2, function(a3, b3) {
        d2[b3] = true;
      }), g(a2.buttons, function(a3) {
        if (d2[a3] === c) throw new Error("button key " + a3 + " is not allowed (options are " + b2.join("\n") + ")");
      }), a2;
    }
    var n = { dialog: "<div class='bootbox modal' tabindex='-1' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>", header: "<div class='modal-header'><h4 class='modal-title'></h4></div>", footer: "<div class='modal-footer'></div>", closeButton: "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>", form: "<form class='bootbox-form'></form>", inputs: { text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />", textarea: "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>", email: "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />", select: "<select class='bootbox-input bootbox-input-select form-control'></select>", checkbox: "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>", date: "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />", time: "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />", number: "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />", password: "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />" } }, o = { locale: "en", backdrop: "static", animate: true, className: null, closeButton: true, show: true, container: "body" }, p = {};
    p.alert = function() {
      var a2;
      if (a2 = k("alert", ["ok"], ["message", "callback"], arguments), a2.callback && !b.isFunction(a2.callback)) throw new Error("alert requires callback property to be a function when provided");
      return a2.buttons.ok.callback = a2.onEscape = function() {
        return b.isFunction(a2.callback) ? a2.callback.call(this) : true;
      }, p.dialog(a2);
    }, p.confirm = function() {
      var a2;
      if (a2 = k("confirm", ["cancel", "confirm"], ["message", "callback"], arguments), a2.buttons.cancel.callback = a2.onEscape = function() {
        return a2.callback.call(this, false);
      }, a2.buttons.confirm.callback = function() {
        return a2.callback.call(this, true);
      }, !b.isFunction(a2.callback)) throw new Error("confirm requires a callback");
      return p.dialog(a2);
    }, p.prompt = function() {
      var a2, d2, e2, f2, h2, i2, k2;
      if (f2 = b(n.form), d2 = { className: "bootbox-prompt", buttons: l("cancel", "confirm"), value: "", inputType: "text" }, a2 = m(j(d2, arguments, ["title", "callback"]), ["cancel", "confirm"]), i2 = a2.show === c ? true : a2.show, a2.message = f2, a2.buttons.cancel.callback = a2.onEscape = function() {
        return a2.callback.call(this, null);
      }, a2.buttons.confirm.callback = function() {
        var c2;
        switch (a2.inputType) {
          case "text":
          case "textarea":
          case "email":
          case "select":
          case "date":
          case "time":
          case "number":
          case "password":
            c2 = h2.val();
            break;
          case "checkbox":
            var d3 = h2.find("input:checked");
            c2 = [], g(d3, function(a3, d4) {
              c2.push(b(d4).val());
            });
        }
        return a2.callback.call(this, c2);
      }, a2.show = false, !a2.title) throw new Error("prompt requires a title");
      if (!b.isFunction(a2.callback)) throw new Error("prompt requires a callback");
      if (!n.inputs[a2.inputType]) throw new Error("invalid prompt type");
      switch (h2 = b(n.inputs[a2.inputType]), a2.inputType) {
        case "text":
        case "textarea":
        case "email":
        case "date":
        case "time":
        case "number":
        case "password":
          h2.val(a2.value);
          break;
        case "select":
          var o2 = {};
          if (k2 = a2.inputOptions || [], !b.isArray(k2)) throw new Error("Please pass an array of input options");
          if (!k2.length) throw new Error("prompt with select requires options");
          g(k2, function(a3, d3) {
            var e3 = h2;
            if (d3.value === c || d3.text === c) throw new Error("given options in wrong format");
            d3.group && (o2[d3.group] || (o2[d3.group] = b("<optgroup/>").attr("label", d3.group)), e3 = o2[d3.group]), e3.append("<option value='" + d3.value + "'>" + d3.text + "</option>");
          }), g(o2, function(a3, b2) {
            h2.append(b2);
          }), h2.val(a2.value);
          break;
        case "checkbox":
          var q2 = b.isArray(a2.value) ? a2.value : [a2.value];
          if (k2 = a2.inputOptions || [], !k2.length) throw new Error("prompt with checkbox requires options");
          if (!k2[0].value || !k2[0].text) throw new Error("given options in wrong format");
          h2 = b("<div/>"), g(k2, function(c2, d3) {
            var e3 = b(n.inputs[a2.inputType]);
            e3.find("input").attr("value", d3.value), e3.find("label").append(d3.text), g(q2, function(a3, b2) {
              b2 === d3.value && e3.find("input").prop("checked", true);
            }), h2.append(e3);
          });
      }
      return a2.placeholder && h2.attr("placeholder", a2.placeholder), a2.pattern && h2.attr("pattern", a2.pattern), a2.maxlength && h2.attr("maxlength", a2.maxlength), f2.append(h2), f2.on("submit", function(a3) {
        a3.preventDefault(), a3.stopPropagation(), e2.find(".btn-primary").click();
      }), e2 = p.dialog(a2), e2.off("shown.bs.modal"), e2.on("shown.bs.modal", function() {
        h2.focus();
      }), i2 === true && e2.modal("show"), e2;
    }, p.dialog = function(a2) {
      a2 = h(a2);
      var d2 = b(n.dialog), f2 = d2.find(".modal-dialog"), i2 = d2.find(".modal-body"), j2 = a2.buttons, k2 = "", l2 = { onEscape: a2.onEscape };
      if (b.fn.modal === c) throw new Error("$.fn.modal is not defined; please double check you have included the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ for more details.");
      if (g(j2, function(a3, b2) {
        k2 += "<button data-bb-handler='" + a3 + "' type='button' class='btn " + b2.className + "'>" + b2.label + "</button>", l2[a3] = b2.callback;
      }), i2.find(".bootbox-body").html(a2.message), a2.animate === true && d2.addClass("fade"), a2.className && d2.addClass(a2.className), "large" === a2.size ? f2.addClass("modal-lg") : "small" === a2.size && f2.addClass("modal-sm"), a2.title && i2.before(n.header), a2.closeButton) {
        var m2 = b(n.closeButton);
        a2.title ? d2.find(".modal-header").prepend(m2) : m2.css("margin-top", "-10px").prependTo(i2);
      }
      return a2.title && d2.find(".modal-title").html(a2.title), k2.length && (i2.after(n.footer), d2.find(".modal-footer").html(k2)), d2.on("hidden.bs.modal", function(a3) {
        a3.target === this && d2.remove();
      }), d2.on("shown.bs.modal", function() {
        d2.find(".btn-primary:first").focus();
      }), "static" !== a2.backdrop && d2.on("click.dismiss.bs.modal", function(a3) {
        d2.children(".modal-backdrop").length && (a3.currentTarget = d2.children(".modal-backdrop").get(0)), a3.target === a3.currentTarget && d2.trigger("escape.close.bb");
      }), d2.on("escape.close.bb", function(a3) {
        l2.onEscape && e(a3, d2, l2.onEscape);
      }), d2.on("click", ".modal-footer button", function(a3) {
        var c2 = b(this).data("bb-handler");
        e(a3, d2, l2[c2]);
      }), d2.on("click", ".bootbox-close-button", function(a3) {
        e(a3, d2, l2.onEscape);
      }), d2.on("keyup", function(a3) {
        27 === a3.which && d2.trigger("escape.close.bb");
      }), b(a2.container).append(d2), d2.modal({ backdrop: a2.backdrop ? "static" : false, keyboard: false, show: false }), a2.show && d2.modal("show"), d2;
    }, p.setDefaults = function() {
      var a2 = {};
      2 === arguments.length ? a2[arguments[0]] = arguments[1] : a2 = arguments[0], b.extend(o, a2);
    }, p.hideAll = function() {
      return b(".bootbox").modal("hide"), p;
    };
    var q = { bg_BG: { OK: "Ок", CANCEL: "Отказ", CONFIRM: "Потвърждавам" }, br: { OK: "OK", CANCEL: "Cancelar", CONFIRM: "Sim" }, cs: { OK: "OK", CANCEL: "Zrušit", CONFIRM: "Potvrdit" }, da: { OK: "OK", CANCEL: "Annuller", CONFIRM: "Accepter" }, de: { OK: "OK", CANCEL: "Abbrechen", CONFIRM: "Akzeptieren" }, el: { OK: "Εντάξει", CANCEL: "Ακύρωση", CONFIRM: "Επιβεβαίωση" }, en: { OK: "OK", CANCEL: "Cancel", CONFIRM: "OK" }, es: { OK: "OK", CANCEL: "Cancelar", CONFIRM: "Aceptar" }, et: { OK: "OK", CANCEL: "Katkesta", CONFIRM: "OK" }, fa: { OK: "قبول", CANCEL: "لغو", CONFIRM: "تایید" }, fi: { OK: "OK", CANCEL: "Peruuta", CONFIRM: "OK" }, fr: { OK: "OK", CANCEL: "Annuler", CONFIRM: "D'accord" }, he: { OK: "אישור", CANCEL: "ביטול", CONFIRM: "אישור" }, hu: { OK: "OK", CANCEL: "Mégsem", CONFIRM: "Megerősít" }, hr: { OK: "OK", CANCEL: "Odustani", CONFIRM: "Potvrdi" }, id: { OK: "OK", CANCEL: "Batal", CONFIRM: "OK" }, it: { OK: "OK", CANCEL: "Annulla", CONFIRM: "Conferma" }, ja: { OK: "OK", CANCEL: "キャンセル", CONFIRM: "確認" }, lt: { OK: "Gerai", CANCEL: "Atšaukti", CONFIRM: "Patvirtinti" }, lv: { OK: "Labi", CANCEL: "Atcelt", CONFIRM: "Apstiprināt" }, nl: { OK: "OK", CANCEL: "Annuleren", CONFIRM: "Accepteren" }, no: { OK: "OK", CANCEL: "Avbryt", CONFIRM: "OK" }, pl: { OK: "OK", CANCEL: "Anuluj", CONFIRM: "Potwierdź" }, pt: { OK: "OK", CANCEL: "Cancelar", CONFIRM: "Confirmar" }, ru: { OK: "OK", CANCEL: "Отмена", CONFIRM: "Применить" }, sq: { OK: "OK", CANCEL: "Anulo", CONFIRM: "Prano" }, sv: { OK: "OK", CANCEL: "Avbryt", CONFIRM: "OK" }, th: { OK: "ตกลง", CANCEL: "ยกเลิก", CONFIRM: "ยืนยัน" }, tr: { OK: "Tamam", CANCEL: "İptal", CONFIRM: "Onayla" }, zh_CN: { OK: "OK", CANCEL: "取消", CONFIRM: "确认" }, zh_TW: { OK: "OK", CANCEL: "取消", CONFIRM: "確認" } };
    return p.addLocale = function(a2, c2) {
      return b.each(["OK", "CANCEL", "CONFIRM"], function(a3, b2) {
        if (!c2[b2]) throw new Error("Please supply a translation for '" + b2 + "'");
      }), q[a2] = { OK: c2.OK, CANCEL: c2.CANCEL, CONFIRM: c2.CONFIRM }, p;
    }, p.removeLocale = function(a2) {
      return delete q[a2], p;
    }, p.setLocale = function(a2) {
      return p.setDefaults("locale", a2);
    }, p.init = function(c2) {
      return a(c2 || b);
    }, p;
  });
})();
//# sourceMappingURL=vendor.build.js.map
