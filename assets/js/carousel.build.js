var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
(function() {
  "use strict";
  window.CgCarousel = class {
    constructor(t, i = {}, e = []) {
      this.container = document.querySelector(t), this.container && (this.slidesSelector = i.slidesSelector || ".js-carousel__slide", this.trackSelector = i.trackSelector || ".js-carousel__track", this.slides = [], this.track = this.container.querySelector(this.trackSelector), this.slidesLength = 0, this.currentBreakpoint = void 0, this.breakpoints = i.breakpoints || {}, this.hooks = e, this.initialOptions = { loop: i.loop || false, autoplay: i.autoplay || false, autoplaySpeed: i.autoplaySpeed || 3e3, transitionSpeed: i.transitionSpeed || 650, slidesPerView: i.slidesPerView || 1, spacing: i.spacing || 0 }, this.options = this.initialOptions, this.animationStart = void 0, this.animation = void 0, this.animationCurrentTrans = 0, this.animationIndex = 0, window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame, this.autoplayInterval = void 0, this.isButtonRightDisabled = false, this.isButtonLeftDisabled = false, this.currentIndex = 0, this.maxIndex = 0, this.isInfinite = false, this.isPrevInfinite = false, this.swipeStartX = void 0, this.swipeStartY = void 0, this.swipeThreshold = 100, this.swipeRestraint = 100, this.swipeDir = void 0, this.track && (this.addEventListeners(), this.initCarousel()));
    }
    hook(t) {
      this.hooks[t] && this.hooks[t](this);
    }
    isTouchableDevice() {
      return window.matchMedia("(pointer: coarse)").matches;
    }
    handleSwipe() {
      switch (this.swipeDir) {
        case "top":
        case "bottom":
        default:
          break;
        case "left":
          this.next();
          break;
        case "right":
          this.prev();
      }
    }
    onSwipeStart(t) {
      if (!this.isTouchableDevice() || !t.changedTouches) return;
      const i = t.changedTouches[0];
      this.swipeStartX = i.pageX, this.swipeStartY = i.pageY;
    }
    setSwipeDirection(t) {
      const i = t.changedTouches[0], e = i.pageX - this.swipeStartX, s = i.pageY - this.swipeStartY;
      Math.abs(e) >= this.swipeThreshold && Math.abs(s) <= this.swipeRestraint ? this.swipeDir = e < 0 ? "left" : "right" : Math.abs(s) >= this.swipeThreshold && Math.abs(e) <= this.swipeRestraint && (this.swipeDir = s < 0 ? "up" : "down");
    }
    onSwipeMove(t) {
      this.isTouchableDevice() && t.changedTouches && (this.setSwipeDirection(t), ["left", "right"].includes(this.swipeDir) && t.cancelable && t.preventDefault());
    }
    onSwipeEnd(t) {
      this.isTouchableDevice() && t.changedTouches && (this.setSwipeDirection(t), this.handleSwipe());
    }
    addEventListeners() {
      window.addEventListener("orientationchange", () => this.onResize()), window.addEventListener("resize", () => this.onResize()), this.container.addEventListener("touchstart", (t) => this.onSwipeStart(t), { passive: true }), this.container.addEventListener("touchmove", (t) => this.onSwipeMove(t), false), this.container.addEventListener("touchend", (t) => this.onSwipeEnd(t), { passive: true });
    }
    onResize() {
      this.checkBreakpoint() && this.buildCarousel(), this.hook("resized");
    }
    setUpAutoplay() {
      this.options.autoplay && (clearInterval(this.autoplayInterval), this.autoplayInterval = setInterval(() => this.next(), this.options.autoplaySpeed));
    }
    checkBreakpoint() {
      if (!this.breakpoints) return;
      const t = Object.keys(this.breakpoints).reverse().find((t2) => {
        const i2 = `(min-width: ${t2}px)`;
        return window.matchMedia(i2).matches;
      });
      if (this.currentBreakpoint === t) return;
      this.currentBreakpoint = t;
      const i = t ? this.breakpoints[t] : this.initialOptions;
      return this.options = __spreadValues(__spreadValues({}, this.initialOptions), i), true;
    }
    setButtonsVisibility() {
      this.isButtonLeftDisabled = !this.options.loop && 0 === this.currentIndex, this.isButtonRightDisabled = !this.options.loop && this.currentIndex === this.maxIndex - 1;
    }
    clearCarouselStyles() {
      ["grid-auto-columns", "gap", "transition", "left"].map((t2) => this.track.style.removeProperty(t2));
      const t = ["grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end", "left"];
      this.slides.forEach((i) => {
        t.map((t2) => i.style.removeProperty(t2));
      });
    }
    setCarouselStyles() {
      if (!this.slides) return;
      const t = this.options.slidesPerView, i = 100 / t, e = this.options.spacing * (t - 1) / t;
      this.track.style.gridAutoColumns = `calc(${i}% - ${e}px)`, this.track.style.gridGap = `${this.options.spacing}px`, this.track.style.left = 0;
    }
    buildCarousel() {
      this.maxIndex = Math.ceil(this.slidesLength / this.options.slidesPerView), this.clearCarouselStyles(), this.setCarouselStyles(), this.setButtonsVisibility(), this.setUpAutoplay(), this.currentIndex = 0, this.hook("built");
    }
    initCarousel() {
      var _a;
      this.slides = this.container.querySelectorAll(this.slidesSelector), this.slidesLength = (_a = this.slides) == null ? void 0 : _a.length, this.checkBreakpoint(), this.buildCarousel(), this.hook("created");
    }
    onAnimationEnd() {
      const t = this.options.spacing * this.animationIndex, i = -100 * this.animationIndex;
      this.track.style.left = `calc(${i}% - ${t}px)`, this.animationCurrentTrans = i, this.animation = null, this.isInfinite && this.clearInfinite(), this.isPrevInfinite && this.clearPrevInfinite();
    }
    moveAnimateAbort() {
      this.animation && (window.cancelAnimationFrame(this.animation), this.onAnimationEnd());
    }
    animateLeft(t, i, e, s) {
      const n = t - this.animationStart, o = (r = n / s, 1 - Math.pow(1 - r, 5));
      var r;
      const a = (i * o + this.animationCurrentTrans * (1 - o)).toFixed(2);
      this.track.style.left = `calc(${a}% - ${e}px)`, n >= s ? this.onAnimationEnd() : this.animation = window.requestAnimationFrame((t2) => {
        this.animateLeft(t2, i, e, s);
      });
    }
    moveSlide(t, i) {
      this.moveAnimateAbort();
      const e = this.options.spacing * t, s = -100 * t;
      this.animation = window.requestAnimationFrame((i2) => {
        t === this.maxIndex && this.setInfinite(), -1 === t && this.setPrevInfinite(), this.animationStart = i2, this.animationIndex = this.currentIndex, this.animateLeft(i2, s, e, this.options.transitionSpeed);
      }), this.currentIndex = i, this.setUpAutoplay(), this.setButtonsVisibility(), this.hook("moved");
    }
    setInfinite() {
      this.isInfinite = true;
      const t = this.options.slidesPerView * this.maxIndex;
      for (let i = 0; i < this.options.slidesPerView; i++) {
        this.slides[i].style.left = `calc((100% * ${t}) + (${this.options.spacing}px * ${t}))`;
      }
    }
    clearInfinite() {
      this.isInfinite = false, this.track.style.left = `calc(${-100 * this.currentIndex}% - ${this.options.spacing * this.currentIndex}px)`, this.slides.forEach((t, i) => {
        i >= this.options.slidesPerView || t.style.removeProperty("left");
      });
    }
    next() {
      const t = this.currentIndex === this.maxIndex - 1 ? 0 : this.currentIndex + 1;
      !this.options.loop && t < this.currentIndex || (t < this.currentIndex ? this.moveSlide(this.currentIndex + 1, t) : this.moveSlide(t, t));
    }
    setPrevInfinite() {
      this.isPrevInfinite = true;
      const t = this.options.slidesPerView * this.maxIndex, i = t - this.options.slidesPerView;
      for (let e = this.slides.length - 1; e >= 0; e--) {
        if (e < i) return;
        this.slides[e].style.left = `calc((-100% * ${t}) - (${this.options.spacing}px * ${t}))`;
      }
    }
    clearPrevInfinite() {
      this.isPrevInfinite = false, this.track.style.left = `calc(${-100 * this.currentIndex}% - ${this.options.spacing * this.currentIndex}px)`, this.slides.forEach((t, i) => {
        t.style.removeProperty("left");
      });
    }
    prev() {
      const t = 0 === this.currentIndex ? this.maxIndex - 1 : this.currentIndex - 1;
      !this.options.loop && t > this.currentIndex || (t > this.currentIndex ? this.moveSlide(this.currentIndex - 1, t) : this.moveSlide(t, t));
    }
    moveToSlide(t) {
      t !== this.currentIndex && this.moveSlide(t, t);
    }
    getSlides() {
      return this.slides;
    }
    getCurrentIndex() {
      return this.currentIndex;
    }
    getOptions() {
      return this.options;
    }
    getPageSize() {
      return this.maxIndex;
    }
  };
  /* @preserve
        _____ __ _     __                _
       / ___// /(_)___/ /___  ____      (_)___
      / (_ // // // _  // -_)/ __/_    / /(_-<
      \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                                  |___/
  
      Version: 1.7.4
      Author: Nick Piscitelli (pickykneee)
      Website: https://nickpiscitelli.com
      Documentation: http://nickpiscitelli.github.io/Glider.js
      License: MIT License
      Release Date: October 25th, 2018
  
    */
  !function(e) {
    "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e() : e();
  }(function() {
    var a = "undefined" != typeof window ? window : this, e = a.Glider = function(e2, t2) {
      var o = this;
      if (e2._glider) return e2._glider;
      if (o.ele = e2, o.ele.classList.add("glider"), (o.ele._glider = o).opt = Object.assign({}, { slidesToScroll: 1, slidesToShow: 1, resizeLock: true, duration: 0.5, easing: function(e3, t3, o2, i, r) {
        return i * (t3 /= r) * t3 + o2;
      } }, t2), o.animate_id = o.page = o.slide = 0, o.arrows = {}, o._opt = o.opt, o.opt.skipTrack) o.track = o.ele.children[0];
      else for (o.track = document.createElement("div"), o.ele.appendChild(o.track); 1 !== o.ele.children.length; ) o.track.appendChild(o.ele.children[0]);
      o.track.classList.add("glider-track"), o.init(), o.resize = o.init.bind(o, true), o.event(o.ele, "add", { scroll: o.updateControls.bind(o) }), o.event(a, "add", { resize: o.resize });
    }, t = e.prototype;
    return t.init = function(e2, t2) {
      var o, i = this, r = 0, s = 0, l = (i.slides = i.track.children, [].forEach.call(i.slides, function(e3, t3) {
        e3.classList.add("glider-slide"), e3.setAttribute("data-gslide", t3);
      }), i.containerWidth = i.ele.clientWidth, i.settingsBreakpoint());
      t2 = t2 || l, "auto" !== i.opt.slidesToShow && void 0 === i.opt._autoSlide || (o = i.containerWidth / i.opt.itemWidth, i.opt._autoSlide = i.opt.slidesToShow = i.opt.exactWidth ? o : Math.max(1, Math.floor(o))), "auto" === i.opt.slidesToScroll && (i.opt.slidesToScroll = Math.floor(i.opt.slidesToShow)), i.itemWidth = i.opt.exactWidth ? i.opt.itemWidth : i.containerWidth / i.opt.slidesToShow, [].forEach.call(i.slides, function(e3) {
        e3.style.height = "auto", e3.style.width = i.itemWidth + "px", r += i.itemWidth, s = Math.max(e3.offsetHeight, s);
      }), i.track.style.width = r + "px", i.trackWidth = r, i.isDrag = false, i.preventClick = false, i.move = false, i.opt.resizeLock && i.scrollTo(i.slide * i.itemWidth, 0), (l || t2) && (i.bindArrows(), i.buildDots(), i.bindDrag()), i.updateControls(), i.emit(e2 ? "refresh" : "loaded");
    }, t.bindDrag = function() {
      function e2() {
        t2.mouseDown = void 0, t2.ele.classList.remove("drag"), t2.isDrag && (t2.preventClick = true), t2.isDrag = false;
      }
      var t2 = this;
      t2.mouse = t2.mouse || t2.handleMouse.bind(t2);
      function o() {
        t2.move = true;
      }
      var i = { mouseup: e2, mouseleave: e2, mousedown: function(e3) {
        e3.preventDefault(), e3.stopPropagation(), t2.mouseDown = e3.clientX, t2.ele.classList.add("drag"), t2.move = false, setTimeout(o, 300);
      }, touchstart: function(e3) {
        t2.ele.classList.add("drag"), t2.move = false, setTimeout(o, 300);
      }, mousemove: t2.mouse, click: function(e3) {
        t2.preventClick && t2.move && (e3.preventDefault(), e3.stopPropagation()), t2.preventClick = false, t2.move = false;
      } };
      t2.ele.classList.toggle("draggable", true === t2.opt.draggable), t2.event(t2.ele, "remove", i), t2.opt.draggable && t2.event(t2.ele, "add", i);
    }, t.buildDots = function() {
      var e2 = this;
      if (e2.opt.dots) {
        if ("string" == typeof e2.opt.dots ? e2.dots = document.querySelector(e2.opt.dots) : e2.dots = e2.opt.dots, e2.dots) {
          e2.dots.innerHTML = "", e2.dots.setAttribute("role", "tablist"), e2.dots.classList.add("glider-dots");
          for (var t2 = 0; t2 < Math.ceil(e2.slides.length / e2.opt.slidesToShow); ++t2) {
            var o = document.createElement("button");
            o.dataset.index = t2, o.setAttribute("aria-label", "Page " + (t2 + 1)), o.setAttribute("role", "tab"), o.className = "glider-dot " + (t2 ? "" : "active"), e2.event(o, "add", { click: e2.scrollItem.bind(e2, t2, true) }), e2.dots.appendChild(o);
          }
        }
      } else e2.dots && (e2.dots.innerHTML = "");
    }, t.bindArrows = function() {
      var o = this;
      o.opt.arrows ? ["prev", "next"].forEach(function(e2) {
        var t2 = o.opt.arrows[e2];
        (t2 = t2 && ("string" == typeof t2 ? document.querySelector(t2) : t2)) && (t2._func = t2._func || o.scrollItem.bind(o, e2), o.event(t2, "remove", { click: t2._func }), o.event(t2, "add", { click: t2._func }), o.arrows[e2] = t2);
      }) : Object.keys(o.arrows).forEach(function(e2) {
        e2 = o.arrows[e2];
        o.event(e2, "remove", { click: e2._func });
      });
    }, t.updateControls = function(e2) {
      var n = this, t2 = (e2 && !n.opt.scrollPropagate && e2.stopPropagation(), n.containerWidth >= n.trackWidth), a2 = (n.opt.rewind || (n.arrows.prev && (n.arrows.prev.classList.toggle("disabled", n.ele.scrollLeft <= 0 || t2), n.arrows.prev.setAttribute("aria-disabled", n.arrows.prev.classList.contains("disabled"))), n.arrows.next && (n.arrows.next.classList.toggle("disabled", Math.ceil(n.ele.scrollLeft + n.containerWidth) >= Math.floor(n.trackWidth) || t2), n.arrows.next.setAttribute("aria-disabled", n.arrows.next.classList.contains("disabled")))), n.slide = Math.round(n.ele.scrollLeft / n.itemWidth), n.page = Math.round(n.ele.scrollLeft / n.containerWidth), n.slide + Math.floor(Math.floor(n.opt.slidesToShow) / 2)), d = Math.floor(n.opt.slidesToShow) % 2 ? 0 : a2 + 1;
      1 === Math.floor(n.opt.slidesToShow) && (d = 0), n.ele.scrollLeft + n.containerWidth >= Math.floor(n.trackWidth) && (n.page = n.dots ? n.dots.children.length - 1 : 0), [].forEach.call(n.slides, function(e3, t3) {
        var o = e3.classList, e3 = o.contains("visible"), i = n.ele.scrollLeft, r = n.ele.scrollLeft + n.containerWidth, s = n.itemWidth * t3, l = s + n.itemWidth, s = ([].forEach.call(o, function(e4) {
          /^left|right/.test(e4) && o.remove(e4);
        }), o.toggle("active", n.slide === t3), a2 === t3 || d && d === t3 ? o.add("center") : (o.remove("center"), o.add([t3 < a2 ? "left" : "right", Math.abs(t3 - (!(t3 < a2) && d || a2))].join("-"))), Math.ceil(s) >= Math.floor(i) && Math.floor(l) <= Math.ceil(r));
        o.toggle("visible", s), s !== e3 && n.emit("slide-" + (s ? "visible" : "hidden"), { slide: t3 });
      }), n.dots && [].forEach.call(n.dots.children, function(e3, t3) {
        e3.classList.toggle("active", n.page === t3);
      }), e2 && n.opt.scrollLock && (clearTimeout(n.scrollLock), n.scrollLock = setTimeout(function() {
        clearTimeout(n.scrollLock), 0.02 < Math.abs(n.ele.scrollLeft / n.itemWidth - n.slide) && (n.mouseDown || n.trackWidth > n.containerWidth + n.ele.scrollLeft && n.scrollItem(n.getCurrentSlide()));
      }, n.opt.scrollLockDelay || 250));
    }, t.getCurrentSlide = function() {
      return this.round(this.ele.scrollLeft / this.itemWidth);
    }, t.scrollItem = function(e2, t2, o) {
      o && o.preventDefault();
      var i, r = this, s = e2, o = (++r.animate_id, r.slide), l = true === t2 ? (e2 = Math.round(e2 * r.containerWidth / r.itemWidth)) * r.itemWidth : ("string" == typeof e2 && (l = "prev" === e2, e2 = r.opt.slidesToScroll % 1 || r.opt.slidesToShow % 1 ? r.getCurrentSlide() : r.slide, l ? e2 -= r.opt.slidesToScroll : e2 += r.opt.slidesToScroll, r.opt.rewind && (i = r.ele.scrollLeft, e2 = l && !i ? r.slides.length : !l && i + r.containerWidth >= Math.floor(r.trackWidth) ? 0 : e2)), e2 = Math.max(Math.min(e2, r.slides.length), 0), r.slide = e2, r.itemWidth * e2);
      return r.emit("scroll-item", { prevSlide: o, slide: e2 }), r.scrollTo(l, r.opt.duration * Math.abs(r.ele.scrollLeft - l), function() {
        r.updateControls(), r.emit("animated", { value: s, type: "string" == typeof s ? "arrow" : t2 ? "dot" : "slide" });
      }), false;
    }, t.settingsBreakpoint = function() {
      var e2 = this, t2 = e2._opt.responsive;
      if (t2) {
        t2.sort(function(e3, t3) {
          return t3.breakpoint - e3.breakpoint;
        });
        for (var o = 0; o < t2.length; ++o) {
          var i = t2[o];
          if (a.innerWidth >= i.breakpoint) return e2.breakpoint !== i.breakpoint && (e2.opt = Object.assign({}, e2._opt, i.settings), e2.breakpoint = i.breakpoint, true);
        }
      }
      var r = 0 !== e2.breakpoint;
      return e2.opt = Object.assign({}, e2._opt), e2.breakpoint = 0, r;
    }, t.scrollTo = function(t2, o, i) {
      var r = this, s = (/* @__PURE__ */ new Date()).getTime(), l = r.animate_id, n = function() {
        var e2 = (/* @__PURE__ */ new Date()).getTime() - s;
        r.ele.scrollLeft = r.ele.scrollLeft + (t2 - r.ele.scrollLeft) * r.opt.easing(0, e2, 0, 1, o), e2 < o && l === r.animate_id ? a.requestAnimationFrame(n) : (r.ele.scrollLeft = t2, i && i.call(r));
      };
      a.requestAnimationFrame(n);
    }, t.removeItem = function(e2) {
      var t2 = this;
      t2.slides.length && (t2.track.removeChild(t2.slides[e2]), t2.refresh(true), t2.emit("remove"));
    }, t.addItem = function(e2) {
      this.track.appendChild(e2), this.refresh(true), this.emit("add");
    }, t.handleMouse = function(e2) {
      var t2 = this;
      t2.mouseDown && (t2.isDrag = true, t2.ele.scrollLeft += (t2.mouseDown - e2.clientX) * (t2.opt.dragVelocity || 3.3), t2.mouseDown = e2.clientX);
    }, t.round = function(e2) {
      var t2 = 1 / (this.opt.slidesToScroll % 1 || 1);
      return Math.round(e2 * t2) / t2;
    }, t.refresh = function(e2) {
      this.init(true, e2);
    }, t.setOption = function(t2, e2) {
      var o = this;
      o.breakpoint && !e2 ? o._opt.responsive.forEach(function(e3) {
        e3.breakpoint === o.breakpoint && (e3.settings = Object.assign({}, e3.settings, t2));
      }) : o._opt = Object.assign({}, o._opt, t2), o.breakpoint = 0, o.settingsBreakpoint();
    }, t.destroy = function() {
      function e2(t3) {
        t3.removeAttribute("style"), [].forEach.call(t3.classList, function(e3) {
          /^glider/.test(e3) && t3.classList.remove(e3);
        });
      }
      var t2 = this, o = t2.ele.cloneNode(true);
      t2.opt.skipTrack || (o.children[0].outerHTML = o.children[0].innerHTML), e2(o), [].forEach.call(o.getElementsByTagName("*"), e2), t2.ele.parentNode.replaceChild(o, t2.ele), t2.event(a, "remove", { resize: t2.resize }), t2.emit("destroy");
    }, t.emit = function(e2, t2) {
      e2 = new a.CustomEvent("glider-" + e2, { bubbles: !this.opt.eventPropagate, detail: t2 });
      this.ele.dispatchEvent(e2);
    }, t.event = function(e2, t2, o) {
      var i = e2[t2 + "EventListener"].bind(e2);
      Object.keys(o).forEach(function(e3) {
        i(e3, o[e3]);
      });
    }, e;
  });
})();
//# sourceMappingURL=carousel.build.js.map
