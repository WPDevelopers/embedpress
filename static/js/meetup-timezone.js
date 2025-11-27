/**
 * EmbedPress Meetup Timezone Converter
 * 
 * Converts UTC timestamps to visitor's local timezone for Meetup embeds
 */
(function() {
    'use strict';

    /**
     * Format date according to the specified format string
     */
    function formatDate(date, format) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const replacements = {
            // Year
            'Y': date.getFullYear(),
            'y': String(date.getFullYear()).slice(-2),
            
            // Month
            'F': months[date.getMonth()],
            'M': monthsShort[date.getMonth()],
            'm': String(date.getMonth() + 1).padStart(2, '0'),
            'n': date.getMonth() + 1,
            
            // Day
            'd': String(date.getDate()).padStart(2, '0'),
            'j': date.getDate(),
            'D': daysShort[date.getDay()],
            'l': days[date.getDay()],
            
            // Time
            'H': String(date.getHours()).padStart(2, '0'),
            'h': String(date.getHours() % 12 || 12).padStart(2, '0'),
            'G': date.getHours(),
            'g': date.getHours() % 12 || 12,
            'i': String(date.getMinutes()).padStart(2, '0'),
            's': String(date.getSeconds()).padStart(2, '0'),
            'A': date.getHours() >= 12 ? 'PM' : 'AM',
            'a': date.getHours() >= 12 ? 'pm' : 'am',
        };

        let formatted = format;
        for (const [key, value] of Object.entries(replacements)) {
            formatted = formatted.replace(new RegExp(key, 'g'), value);
        }

        return formatted;
    }

    /**
     * Format time according to the specified format string
     */
    function formatTime(date, format) {
        return formatDate(date, format);
    }

    /**
     * Convert UTC timestamps to visitor's local timezone
     */
    function convertTimezones() {
        // Find all elements with visitor timezone data attribute
        const elements = document.querySelectorAll('[data-visitor-timezone="true"]');

        console.log('EmbedPress Meetup Timezone: Found ' + elements.length + ' elements to convert');

        elements.forEach(function(element) {
            const utcTimestamp = parseInt(element.getAttribute('data-utc-timestamp'), 10);
            
            if (!utcTimestamp || isNaN(utcTimestamp)) {
                return;
            }

            // Create date object from UTC timestamp
            const date = new Date(utcTimestamp * 1000);

            console.log('Converting timestamp:', utcTimestamp, 'to local date:', date.toString());

            // Check if this is a date element or time element
            const isDateElement = element.classList.contains('ep-event-date');
            const isTimeElement = element.classList.contains('ep-event-end-time');

            if (isDateElement) {
                // Format date and time
                const dateFormat = element.getAttribute('data-date-format') || 'F j, Y';
                const timeFormat = element.getAttribute('data-time-format') || 'g:i A';

                // Combine date and time format
                const formattedDate = formatDate(date, dateFormat);
                const formattedTime = formatTime(date, timeFormat);

                const newText = formattedDate + ', ' + formattedTime;
                console.log('Formatted date:', newText);
                element.textContent = newText;
            } else if (isTimeElement) {
                // Format time only (for end time)
                const timeFormat = element.getAttribute('data-time-format') || 'g:i A';
                element.textContent = formatTime(date, timeFormat);
            }
        });
    }

    // Convert on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertTimezones);
    } else {
        convertTimezones();
    }

    // Convert after AJAX load more
    document.addEventListener('embedpress:meetup:loaded', convertTimezones);
})();

