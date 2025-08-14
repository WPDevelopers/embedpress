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
})();
//# sourceMappingURL=carousel.build.js.map
