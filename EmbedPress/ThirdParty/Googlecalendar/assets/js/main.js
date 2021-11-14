(function(win) {
    jQuery(document).ready(function () {

        window.fullCalendars = [];

        var int_reg = /^\d+$/;

        function underscoreToUpper(s) {
            // event_limit ==> eventLimit
            return s.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        }

        // Because attributes are always strings, we need to cast them to appropriate types.
        function castAttrValue(value, defaultValue) {
            if (value === 'true') return true;
            if (value === 'false') return false;
            if (int_reg.test(value)) {
                return parseInt(value, 10);
            }
            if (!value && typeof defaultValue !== "undefined") {
                return defaultValue;
            }
            return value;
        }

        function getConfigBackgroundColor(config) {
            if ("eventBackgroundColor" in config) {
                return config.eventBackgroundColor;
            }
            if ("eventColor" in config) {
                return config.eventColor;
            }
            return false;
        }

        function padDatePart(d) {
            if (d < 10) return "0" + d.toString();
            return d;
        }

        function dateFormat(date) {
            return date.getFullYear() + "-" + padDatePart(date.getMonth() + 1) + "-" + padDatePart(date.getDate());
        }

        function castObjectAttributes(obj) {
            Object.keys(obj).forEach(function(key) {
                if (obj[key]) {
                    switch (typeof obj[key]) {
                        case 'string':
                            obj[key] = castAttrValue(obj[key]);
                            break;
                        case 'object':
                            if (obj[key].constructor === Object) {
                                castObjectAttributes(obj[key]);
                            }
                            break;
                    }
                }
            });
        }


        Array.prototype.forEach.call(document.querySelectorAll(".epgc-calendar-wrapper"), function(calendarWrapper, calendarCounter) {

            var errorEl = window.document.createElement("div");
            errorEl.className = "epgc-error-el";
            var loadingEl = window.document.createElement("div");
            loadingEl.className = "epgc-loading-el";

            var currentAllEvents = null;
            var fullCalendar = null;
            var $calendar = calendarWrapper.querySelector('.epgc-calendar');
            var $calendarFilter = calendarWrapper.querySelector('.epgc-calendar-filter');
            var errorAndLoadingParent = null; // will be set by FullCalendar, so is not available now.

            var selectedCalIds = null;
            var allCalendars = null;

            // Always present, gets set in PHP file.
            // Note: make sure you use the same defaults as get set in the PHP file!
            var isPublic = castAttrValue($calendar.getAttribute('data-public'), false);
            var filter = castAttrValue($calendar.getAttribute('data-filter'));
            var showEventPopup = castAttrValue($calendar.getAttribute('data-eventpopup'), true);
            var showEventLink = castAttrValue($calendar.getAttribute('data-eventlink'), false);
            var hidePassed = castAttrValue($calendar.getAttribute('data-hidepassed'), false);
            var hideFuture = castAttrValue($calendar.getAttribute('data-hidefuture'), false);
            var showEventDescription = castAttrValue($calendar.getAttribute('data-eventdescription'), false);
            var showEventLocation = castAttrValue($calendar.getAttribute('data-eventlocation'), false);
            var showEventAttendees = castAttrValue($calendar.getAttribute('data-eventattendees'), false);
            var showEventAttachments = castAttrValue($calendar.getAttribute('data-eventattachments'), false);
            var showEventCreator = castAttrValue($calendar.getAttribute('data-eventcreator'), false);
            var showEventCalendarname = castAttrValue($calendar.getAttribute('data-eventcalendarname'), false);

            var uncheckedCalendarIds = $calendarFilter && $calendarFilter.getAttribute("data-uncheckedcalendarids") ? JSON.parse($calendarFilter.getAttribute("data-uncheckedcalendarids")) : [];

            // fullCalendar locales are like this: nl-be OR es
            // The locale we get from WP are en_US OR en.
            var locale = 'en-us';
            // This one (data-locale) is set by WP and NOT by the user. User can set it in the fullCalendar config.
            if ($calendar.getAttribute('data-locale')) {
                locale = $calendar.getAttribute('data-locale').toLowerCase().replace("_", "-"); // en-us or en
            }

            // This can be overridden by shortcode attributes.
            var defaultConfig = {
                height: "auto",
                locale: locale,
                eventLimit: true
            };
            var dataConfig = $calendar.getAttribute("data-config") ? JSON.parse($calendar.getAttribute("data-config")) : {};

            // Cast booleans and int (we also get these as strings)
            castObjectAttributes(dataConfig);

            var config = Object.assign({}, defaultConfig);
            Object.keys(dataConfig).forEach(function(key) {
                var value = castAttrValue(dataConfig[key]);
                config[underscoreToUpper(key)] = value;
            });

            // New option for firstDay: +0, +1, +2, etc. instead of 0, 1, 2, etc. ==> FullCalendar expects day number (Sunday = 0), so translate it
            if (("firstDay" in config) && !int_reg.test(config.firstDay)) {
                config.firstDay = parseInt(moment().add(config.firstDay, 'd').format('d'), 10);
            }

            locale = config.locale;

            moment.locale(locale);

            // Users can set specific set of calendars
            // Only in widget set (data-calendarids)
            var thisCalendarids = $calendar.getAttribute('data-calendarids') ? JSON.parse($calendar.getAttribute('data-calendarids')) : [];
            // Only in shortcode
            // TODO: with new release this can be deleted I think.
            if ("calendarids" in config) {
                thisCalendarids = config.calendarids.split(",").map(function(item) {
                    return item.replace(" ", "");
                });
            }

            if (isPublic && thisCalendarids.length === 0) {
                console.error("If you set the 'public' property, you have to specify at least 1 calendar ID in the 'calendarids' property.");
            }

            function makeSureErrorAndLoadingParentExists() {
                if (!errorAndLoadingParent) {
                    errorAndLoadingParent = $calendar.querySelector(".fc-view-container");
                }
                return !!errorAndLoadingParent;
            }

            function clearError() {
                if (errorEl.parentNode) {
                    errorEl.parentNode.removeChild(errorEl);
                }
            }

            function clearLoading() {
                if (loadingEl.parentNode) {
                    loadingEl.parentNode.removeChild(loadingEl);
                }
            }

            function setError(msg) {
                clearLoading();
                if (makeSureErrorAndLoadingParentExists()) {
                    errorEl.innerText = msg;
                    errorAndLoadingParent.appendChild(errorEl);
                }
            }

            function setLoading(msg) {
                clearError();
                if (makeSureErrorAndLoadingParentExists()) {
                    loadingEl.innerText = msg;
                    errorAndLoadingParent.appendChild(loadingEl);
                }
            }

            function handleCalendarFilter(calendars) {

                allCalendars = calendars;

                // Make sure below happens once.
                if (selectedCalIds !== null) {
                    return;
                }

                selectedCalIds = Object.keys(calendars); // default all calendars selected
                if (uncheckedCalendarIds.length) {
                    var tmp = [];
                    selectedCalIds.forEach(function(key) {
                        if (uncheckedCalendarIds.indexOf(key) === -1) {
                            tmp.push(key);
                        }
                    });
                    selectedCalIds = tmp;
                }

                if (!filter) return;

                var selectBoxes = [];
                Object.keys(calendars).forEach(function(key, index) {
                    if (thisCalendarids.length && thisCalendarids.indexOf(key) === -1) {
                        return;
                    }
                    selectBoxes.push('<input id="id_' + calendarCounter + '_' + index + '" type="checkbox" ' + (uncheckedCalendarIds.indexOf(key) === -1 ? "checked" : "") + ' value="' + key + '" />'
                        + '<label for="id_' + calendarCounter + '_' + index + '">'
                        + '<span class="epgc-calendar-color" style="background-color:' + (getConfigBackgroundColor(config) || calendars[key].backgroundColor) + '"></span> ' + (calendars[key].summary || key)
                        + '</label>');
                });
                $calendarFilter.innerHTML = '<div class="epgc-calendar-filter-wrapper">' + selectBoxes.join("\n") + '</div>';
            }

            function getFilteredEvents() {
                var newEvents = [];
                currentAllEvents.forEach(function(item) {
                    if (selectedCalIds.indexOf(item.calId) > -1) {
                        newEvents.push(item);
                    }
                });
                return newEvents;
            }

            function setEvents() {
                var newEvents = getFilteredEvents();
                var calendarEvents = fullCalendar.getEvents();
                fullCalendar.batchRendering(function() {
                    calendarEvents.forEach(function(e) {
                        e.remove();
                    });
                });
                fullCalendar.batchRendering(function() {
                    newEvents.forEach(function(e) {
                        fullCalendar.addEvent(e);
                    });
                });
            }

            if ($calendarFilter) {
                $calendarFilter.addEventListener("change", function(e) {
                    selectedCalIds = Array.prototype.map.call(calendarWrapper.querySelectorAll(".epgc-calendar-filter-wrapper input[type='checkbox']:checked"), function(item) {
                        return item.value;
                    });
                    setEvents();
                });
            }

            var loadingTimer = null;

            // Add things no one can override.
            config = Object.assign(config, {
                loading: function(isLoading, view) {
                    if (isLoading) {
                        loadingTimer = setTimeout(function() {
                            setLoading(epgc_object.trans.loading);
                        }, 300);
                    } else {
                        if (loadingTimer) {
                            clearTimeout(loadingTimer);
                            loadingTimer = null;
                        }
                        clearLoading();
                    }
                },
                eventRender: function(info) {

                    if (showEventPopup) {
                        var texts = ['<span class="epgc-popup-draghandle dashicons dashicons-screenoptions"></span><div class="epgc-popup-row epgc-event-title"><div class="epgc-popup-row-icon"><span></span></div><div class="epgc-popup-row-value">' + info.event.title + '</div></div>'];

                        var date = config.timeZone ? moment.tz(info.event.start, config.timeZone).format("L") : info.event.start.toLocaleDateString();

                        texts.push('<div class="epgc-popup-row epgc-event-time"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-clock"></span></div><div class="epgc-popup-row-value">' + date + '<br>');
                        if (info.event.allDay) {
                            texts.push(epgc_object.trans.all_day + "</div></div>");
                        } else {
                            if (config.timeZone) {
                                // info.event.end can be null, for example when someone uses the same start and end time!
                                texts.push(moment.tz(info.event.start, config.timeZone).format("LT")
                                    + " - "
                                    + moment.tz((info.event.end || info.event.start), config.timeZone).format("LT") + "</div></div>");
                            } else {
                                // info.event.end can be null, for example when someone uses the same start and end time!
                                texts.push(info.event.start.toLocaleTimeString(locale, {
                                    timeStyle: "short"
                                }) + " - " + (info.event.end || info.event.start).toLocaleTimeString(locale, {
                                    timeStyle: "short"
                                }) + "</div></div>");
                            }
                        }
                        if (showEventDescription && info.event.extendedProps.description) {
                            texts.push('<div class="epgc-popup-row epgc-event-description"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-editor-alignleft"></span></div><div class="epgc-popup-row-value">' + info.event.extendedProps.description + '</div></div>');
                        }
                        if (showEventLocation && info.event.extendedProps.location) {
                            texts.push('<div class="epgc-popup-row epgc-event-location"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-location"></span></div><div class="epgc-popup-row-value">' + info.event.extendedProps.location + '</div></div>');
                        }
                        if (showEventAttendees && info.event.extendedProps.attendees && info.event.extendedProps.attendees.length) {
                            texts.push('<div class="epgc-popup-row epgc-event-attendees"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-groups"></span></div><div class="epgc-popup-row-value"><ul>' + info.event.extendedProps.attendees.map(function(attendee) {
                                return '<li>' + attendee.email + '</li>';
                            }).join('') + '</ul></div></div>');
                        }
                        if (showEventAttachments && info.event.extendedProps.attachments && info.event.extendedProps.attachments.length) {
                            texts.push('<div class="epgc-popup-row epgc-event-attachments"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-paperclip"></span></div><div class="epgc-popup-row-value"><ul>' + info.event.extendedProps.attachments.map(function(attachment) {
                                return '<li><a rel="noopener noreferrer" target="_blank" href="' + attachment.fileUrl + '">' + attachment.title + '</a></li>';
                            }).join('<br>') + '</ul></div></div>');
                        }
                        var hasCreator = showEventCreator && info.event.extendedProps.creator && (info.event.extendedProps.creator.email || info.event.extendedProps.creator.displayName);
                        if (showEventCalendarname || hasCreator) {
                            texts.push('<div class="epgc-popup-row epgc-event-calendarname-creator"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-calendar-alt"></span></div><div class="epgc-popup-row-value">');
                            if (showEventCalendarname) {
                                texts.push(allCalendars[info.event.extendedProps.calId].summary || info.event.extendedProps.calId);
                                if (hasCreator) {
                                    texts.push('<br>');
                                }
                            }
                            if (hasCreator) {
                                texts.push(epgc_object.trans.created_by + ': ' + (info.event.extendedProps.creator.displayName || info.event.extendedProps.creator.email));
                            }
                            texts.push('</div></div>');
                        }
                        if (showEventLink) {
                            texts.push('<div class="epgc-popup-row epgc-event-link"><div class="epgc-popup-row-icon"><span class="dashicons dashicons-external"></span></div><div class="epgc-popup-row-value"><a rel="noopener noreferrer" target="_blank" href="' + info.event.extendedProps.htmlLink + '">' + epgc_object.trans.go_to_event + '</a></div></div>');
                        }
                        info.el.setAttribute("data-tippy-content",  texts.join("\n"));
                        info.el.setAttribute("data-calendarid", info.event.extendedProps.calId);
                    }
                },
                events: function(arg, successCcallback, failureCallback) {
                    var start = arg.start;
                    var end = arg.end;
                    //var fStart = dateFormat(start);
                    var fStart = arg.startStr;
                    //var fEnd = dateFormat(end);
                    var fEnd = arg.endStr;

                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    formData.append("_ajax_nonce", epgc_object.nonce);
                    formData.append("action", "epgc_ajax_get_calendar");
                    formData.append("start", fStart);
                    formData.append("end", fEnd);
                    if ("timeZone" in arg && arg.timeZone) {
                        formData.append("timeZone", arg.timeZone);
                    }
                    formData.append("thisCalendarids", thisCalendarids.join(","));
                    if (isPublic) {
                        formData.append("isPublic", 1);
                    }
                    xhr.onload = function(eLoad) {
                        try {
                            var response = JSON.parse(this.response);
                            if ("error" in response) {
                                throw response;
                            }
                            var items = [];
                            if ("items" in response) {
                                // Merge calendar backgroundcolor and items
                                var calendars = response.calendars;
                                response.items.forEach(function(item) {
                                    // Check if we have this calendar - if we get cached items, but someone unselected
                                    // a calendar in the admin, we can get items for unselected calendars.
                                    if (!(item.calId in calendars)) return;
                                    if (item.bColor) {
                                        item.backgroundColor = item.bColor;
                                        item.textColor = item.fColor;
                                    } else if (!getConfigBackgroundColor(config)) {
                                        item.backgroundColor = calendars[item.calId].backgroundColor;
                                    }
                                    items.push(item);
                                });
                                currentAllEvents = items;
                                handleCalendarFilter(response.calendars);
                            }
                            successCcallback([]);
                            setEvents();
                        } catch (ex) {
                            setError(ex.errorDescription || ex.error || epgc_object.trans.unknown_error);
                            console.error(ex);
                            successCcallback([]);
                        } finally {
                            xhr = null;
                        }
                    };
                    xhr.onerror = function(eError) {
                        setError(eError.error || epgc_object.trans.request_error);
                        console.error(eError);
                        successCcallback([]);
                    };
                    xhr.open("POST", epgc_object.ajax_url);
                    xhr.send(formData);
                }
            });

            // Can be true, false, or numeric, even 0 meaning the same as true.
            if (hidePassed || hideFuture || hidePassed === 0 || hideFuture === 0) {
                config.validRange = {};
            }

            if (hidePassed === true || hidePassed === 0) {
                config.validRange.start = new Date();
            } else if (hidePassed) {
                config.validRange.start = moment().subtract(hidePassed, 'days').toDate();
            }
            if (hideFuture === true || hideFuture === 0) {
                config.validRange.end = new Date();
            } else if (hideFuture) {
                config.validRange.end = moment().add(hideFuture, 'days').toDate();
            }

            fullCalendar = new FullCalendar.Calendar($calendar, Object.assign({
                plugins: ['moment', 'momentTimezone', 'dayGrid', 'list', 'timeGrid'],
                defaultView: 'dayGridMonth',
                nowIndicator: true,
                columnHeader: true,
                columnHeaderFormat: {
                    weekday: 'short'
                }
            }, config));
            fullCalendar.render();
            // For debugging, so we have access to it from within the console.
            window.fullCalendars.push(fullCalendar);
        });

        var tippyArg = {
            target: "*[data-tippy-content]",
            allowHTML: true,
            theme: "epgc",
            interactive: true,
            appendTo: document.body,
            theme: 'light-border',
            onMount: function(instance) {
                Array.prototype.forEach.call(instance.popper.querySelectorAll("a"), function(a) {
                    if (!a.getAttribute("target")) {
                        a.setAttribute("target", "_blank");
                        a.setAttribute("rel", "noopener noreferrer");
                    }
                });
            }
        };

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            tippyArg.trigger = "click";
        }

        tippy.delegate("body", tippyArg);

        var startClientX = 0;
        var startClientY = 0;
        var popupElement = null;
        var popupElementStartX = 0;
        var popupElementStartY = 0;

        function onBodyMouseDown(e) {

            var el = e.target || e.srcElement;

            if (!el.classList.contains('epgc-popup-draghandle')) return;

            while (el) {
                if (el.getAttribute && el.hasAttribute("data-tippy-root")) {
                    popupElement = el;
                    break;
                }
                el = el.parentNode;
            }

            if (!popupElement) return;
            var transform = popupElement.style.transform.replace("translate(", "").replace(")", "").split(",");
            popupElementStartX = parseInt(transform[0].replace(" ", ""), 10);
            popupElementStartY = parseInt(transform[1].replace(" ", ""), 10);
            startClientX = e.clientX;
            startClientY = e.clientY;
            document.body.addEventListener("mousemove", onBodyMouseMove);
            document.body.addEventListener("mouseup", onBodyMouseUp);
        }

        function onBodyMouseMove(e) {
            popupElement.style.transform = "translate(" + (popupElementStartX + (e.clientX - startClientX)) + "px, " + (popupElementStartY + (e.clientY - startClientY)) + "px)";
        }

        function onBodyMouseUp() {
            document.body.removeEventListener("mousemove", onBodyMouseMove);
            document.body.removeEventListener("mouseup", onBodyMouseUp);
        }

        document.body.addEventListener("mousedown", onBodyMouseDown);
    });

}(this));
