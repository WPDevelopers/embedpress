(function() {
  "use strict";
  /**
   * @package     EmbedPress
   * @author      EmbedPress <help@embedpress.com>
   * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
   * @license     GPLv2 or later
   * @since       1.7.0
   */
  (function($) {
    wp.i18n.__;
    $(document).on("click", ".embedpress-plugin-notice-dismissible.is-dismissible", function() {
      var data = {
        action: "embedpress_notice_dismiss",
        security: EMBEDPRESS_ADMIN_PARAMS.nonce
      };
      $.post(EMBEDPRESS_ADMIN_PARAMS.ajaxurl, data, function() {
      });
    });
  })(jQuery);
  const rengeControls = document.querySelectorAll(".range-control");
  const adToggleSwitch = document.querySelector(".sponsored-active_btn");
  const videoBtn = document.querySelector(".btn-video");
  const imgBtn = document.querySelector(".btn-img");
  const videoBtnBody = document.querySelector(".video-body");
  const imgBtnBody = document.querySelector(".img-body");
  const videoPlayBtn = document.querySelector(".video-play_btn");
  const videoPopPup = document.querySelector(".popup-video-wrap");
  const closePopPup = document.querySelector(".close-video_btn");
  const slideLink = document.querySelector(".sponsored-floating_quick-links_wrapper");
  const floatingQuckLinks = document.querySelector(".sponsored-floating_quick-links");
  const activeIcon = document.querySelector(".active-icon");
  const closeIcon = document.querySelector(".close-icon");
  rengeControls == null ? void 0 : rengeControls.forEach((rangeControl) => {
    const minus = rangeControl.querySelector(".range_negative");
    const plus = rangeControl.querySelector(".range_positive");
    const input = rangeControl.querySelector(".range__value");
    minus.addEventListener("click", function() {
      let v = parseInt(input.value);
      if (v > 0) {
        input.value = v - 1;
      }
    });
    plus.addEventListener("click", function() {
      input.value = parseInt(input.value) + 1;
    });
  });
  videoBtn == null ? void 0 : videoBtn.addEventListener("click", function() {
    if (adToggleSwitch) {
      this.classList.add("sponsored-active_btn");
      imgBtn.classList.remove("sponsored-active_btn");
      videoBtnBody.classList.add("toggle-active");
      imgBtnBody.classList.remove("toggle-active");
    }
  });
  imgBtn == null ? void 0 : imgBtn.addEventListener("click", function() {
    if (adToggleSwitch) {
      this.classList.add("sponsored-active_btn");
      videoBtn.classList.remove("sponsored-active_btn");
      imgBtnBody.classList.add("toggle-active");
      videoBtnBody.classList.remove("toggle-active");
    }
  });
  videoPlayBtn == null ? void 0 : videoPlayBtn.addEventListener("click", function() {
    videoPopPup.classList.add("popup-active");
  });
  closePopPup == null ? void 0 : closePopPup.addEventListener("click", function() {
    videoPopPup.classList.remove("popup-active");
  });
  activeIcon == null ? void 0 : activeIcon.addEventListener("click", function() {
    slideLink.classList.add("sponsored-link_active");
    this.classList.remove("sponsored-link_active");
    closeIcon.classList.add("sponsored-link_active");
  });
  closeIcon == null ? void 0 : closeIcon.addEventListener("click", function() {
    slideLink.classList.remove("sponsored-link_active");
    this.classList.remove("sponsored-link_active");
    activeIcon.classList.add("sponsored-link_active");
  });
  floatingQuckLinks == null ? void 0 : floatingQuckLinks.addEventListener("click", function() {
    slideLink.classList.remove("sponsored-link_active");
    activeIcon.classList.add("sponsored-link_active");
    closeIcon.classList.remove("sponsored-link_active");
  });
  /**
   * @package     EmbedPress
   * @author      EmbedPress <help@embedpress.com>
   * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
   * @license     GPLv2 or later
   * @since       1.7.0
   */
  (function($) {
    var __ = wp.i18n.__;
    var addQueryArgs = wp.url.addQueryArgs;
    $(document).on("click", ".embedpress-license-activation-btn", function(e) {
      e.preventDefault();
      let $this = $(this);
      const licensesKey = $("#embedpress-pro-license-key").val();
      if (licensesKey) {
        $this.attr("disabled", "disabled");
        $this.html(__("Sending Request.....", "embedpress"));
      }
      $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {
          // Your data to be sent in the request body
          action: "embedpress/license/activate",
          _nonce: embedpressLicenseData.nonce,
          //
          license_key: licensesKey
        },
        success: function(response) {
          var _a;
          if (!response.success) {
            $this.html(__("Active License", "embedpress"));
            $this.removeAttr("disabled");
            $(".embedpress-toast__message.toast__message--error p").text((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.message);
            $(".toast__message--error").addClass("show-toast");
            setTimeout(() => {
              $(".toast__message--error").removeClass("show-toast");
            }, 2e3);
          } else if (response.data.license === "valid") {
            activationMessage();
          } else if (response.data.license === "required_otp") {
            $this.html(__("Verification Required", "embedpress"));
            $("#valid-license-key-message").removeClass("hidden");
            $("#email-placeholder").text(response.data.customer_email);
            $("#embedpress-pro-license-key").attr("disabled", "disabled");
            $(".embedpress-toast__message.toast__message--success p").text("Verification Code Sent successfully");
            $(".toast__message--success").addClass("show-toast");
            setTimeout(() => {
              $(".toast__message--success").removeClass("show-toast");
            }, 2e3);
            $("#otp-varify-form").removeClass("hidden");
          }
        },
        error: function(xhr, status, error) {
          console.error("Error:", status, error);
        }
      });
    });
    $(document).on("click", ".embedpress-verification-activation-btn", function(e) {
      e.preventDefault();
      let $this = $(this);
      const licensesKey = $("#embedpress-pro-license-key").val();
      const otpCode = $("#embedpress-pro-verification-key").val();
      $("#invalid-verification-key-message").addClass("hidden");
      if (licensesKey) {
        $this.attr("disabled", "disabled");
        $this.html(__("Verifying.....", "embedpress"));
      }
      $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {
          // Your data to be sent in the request body
          action: "embedpress/license/submit-otp",
          _nonce: embedpressLicenseData.nonce,
          //
          license: licensesKey,
          otp: otpCode
        },
        success: function(response) {
          var _a;
          console.log("Success:", response);
          if (!response.success) {
            $this.html("Verify");
            $this.removeAttr("disabled");
            $(".embedpress-toast__message.toast__message--error p").text((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.message);
            $(".toast__message--error").addClass("show-toast");
            setTimeout(() => {
              $(".toast__message--error").removeClass("show-toast");
            }, 2e3);
          } else {
            $this.html(__("Verified", "embedpress"));
            activationMessage();
          }
        },
        error: function(xhr, status, error) {
          console.error("Error:", status, error);
        }
      });
    });
    $(document).on("click", "#resend-license-verification-key", function(e) {
      e.preventDefault();
      $(this);
      const licensesKey = $("#embedpress-pro-license-key").val();
      $("#resend-license-verification-key").text(__("Resending", "embedpress"));
      $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {
          // Your data to be sent in the request body
          action: "embedpress/license/resend-otp",
          _nonce: embedpressLicenseData.nonce,
          //
          license: licensesKey
        },
        success: function(response) {
          var _a;
          console.log("Success:", response);
          if (!response.success) {
            $(".embedpress-toast__message.toast__message--error p").text((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.message);
            $(".toast__message--error").addClass("show-toast");
            setTimeout(() => {
              $(".toast__message--error").removeClass("show-toast");
            }, 2e3);
          } else {
            $(".embedpress-toast__message.toast__message--success p").text("Verification Code Resent Successfully.");
            $(".toast__message--success").addClass("show-toast");
            setTimeout(() => {
              $(".toast__message--success").removeClass("show-toast");
            }, 2e3);
          }
          $("#resend-license-verification-key").text(__("Resend", "embedpress"));
        },
        error: function(xhr, status, error) {
          console.error("Error:", status, error);
        }
      });
    });
    $(document).on("click", ".embedpress-license-deactivation-btn", function(e) {
      e.preventDefault();
      let $this = $(this);
      const licensesKey = $("#embedpress-pro-license-key").val();
      $("#embedpress-pro-verification-key").val();
      console.log(licensesKey);
      if (licensesKey) {
        $this.attr("disabled", "disabled");
        $this.html(__("Deactivating.....", "embedpress"));
      }
      $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {
          // Your data to be sent in the request body
          action: "embedpress/license/deactivate",
          _nonce: embedpressLicenseData.nonce
          //
        },
        success: function(response) {
          console.log("Success:", response);
          if (response.success) {
            deactivationMessage();
          }
        },
        error: function(xhr, status, error) {
          console.error("Error:", status, error);
        }
      });
    });
    function activationMessage() {
      var currentUrl = window.location.href;
      var newUrl = addQueryArgs(currentUrl, {
        success: true,
        message: __("License has been activated", "embedpress")
      });
      window.location.href = newUrl;
    }
    function deactivationMessage() {
      var currentUrl = window.location.href;
      var newUrl = addQueryArgs(currentUrl, {
        success: true,
        message: __("License has been deactivated", "embedpress")
      });
      window.location.href = newUrl;
    }
  })(jQuery);
})();
//# sourceMappingURL=admin-common.build.js.map
