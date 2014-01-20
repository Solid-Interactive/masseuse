define(function () {
    'use strict';

    /**
     * @namespace formatters
     */
    return {
        booleantoenabled : booleantoenabled,
        dollars: dollars,
        equals: equals,
        existsOr: existsOr,
        humanize: {
            read : read,
            publish : publish
        },
        includes: includes,
        joinWithComma: joinWithComma,
        jsonAsString: jsonAsString,
        limit: limit,
        pluralize: pluralize,
        prefix : prefix,
        prettyDate: prettyDate,
        prettyDateNoTime : prettyDateNoTime,
        prettyFileSize: prettyFileSize,
        secondsToTime: secondsToTime,
        spaceBefore: spaceBefore,
        spaceAfter: spaceAfter,
        suffix: suffix,
        withColon: withColon,
        withComma : withComma,
        withForwardSlash: withForwardSlash
    };

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function withComma(value) {
        return value + ', ';
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {*|string|join|join|join}
     */
    function joinWithComma(value) {
        return value.join(', ');
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @param arg
     * @returns {string}
     */
    function pluralize(value, arg) {
        switch (value) {
        case 0 :
            return value + ' ' + arg + 's';
        case 1 :
            return value + ' ' + arg;
        default:
            return value + ' ' + arg + 's';
        }
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function withForwardSlash(value) {
        return value + ' / ';
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function withColon(value) {
        return value + ' : ';
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function spaceAfter(value) {
        return value + ' ';
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function spaceBefore(value) {
        return ' ' + value;
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function prettyFileSize(value) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
            i;
        value = parseInt(value, 10);
        if (value === 0) {
            return '0 Bytes';
        }
        i = Math.floor(Math.log(value) / Math.log(1024));
        return Math.round(value / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    /**
     * @memberof formatters
     * @instance
     * @param dateStr
     * @returns {string}
     */
    function prettyDate(dateStr) {
        var date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    /**
     * @memberof formatters
     * @instance
     * @param dateStr
     * @returns {string}
     */
    function prettyDateNoTime(dateStr) {
        var dateString = new Date(dateStr);
        return (dateString.getMonth() + 1) + '/' + dateString.getDate() + '/' + dateString.getFullYear();
    }

    /**
     * @memberof formatters
     * @instance
     * @param secs
     * @returns {string}
     */
    function secondsToTime(secs) {
        var SECONDS_IN_MINUTE = 60,
            SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60,
            HOUR = 'hr',
            MINUTE = 'min',
            SECOND = 'sec',
            hours = Math.floor(secs / SECONDS_IN_HOUR),
            divisor_for_minutes = secs % SECONDS_IN_HOUR,
            minutes = Math.floor(divisor_for_minutes / SECONDS_IN_MINUTE),
            divisor_for_seconds = divisor_for_minutes % SECONDS_IN_MINUTE,
            seconds = Math.ceil(divisor_for_seconds),
            time = [];

        if (0 !== hours) { time.push(pluralize(hours, HOUR)); }
        if (0 !== minutes) { time.push(pluralize(minutes, MINUTE)); }
        if (0 !== seconds) { time.push(pluralize(seconds, SECOND)); }

        return time.join(' ');
    }

    /**
     * @memberof formatters
     * @instance
     * @param amount
     * @returns {string}
     */
    function dollars(amount) {
        return '$' + ((amount / 100).toFixed(2));
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @param args
     * @returns {boolean}
     */
    function equals(value, args) {
        return (value == args);
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @param args
     * @returns {*}
     */
    function existsOr(value, args) {
        return value ? value : args;
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @param args
     * @returns {Array|string|*|Blob|slice|slice}
     */
    function limit(value, args) {
        return value.slice(0, args);
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function read(value) {
        return (value) ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function publish(value) {
        return (value) ? value.charAt(0).toLowerCase() + value.slice(1) : '';
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {*}
     */
    function jsonAsString(value) {
        return JSON.stringify(value, null, 4);
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */
    function booleantoenabled(value) {
        return value ? 'Enabled' : 'Disabled';
    }

    /**
     * @memberof formatters
     * @instance
     * @returns {boolean}
     */
    function includes() {
        var args = Array.prototype.slice.call(arguments),
            stringToCompare = args.shift();

        if (args.indexOf(stringToCompare) != -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @param pref
     * @returns {*}
     */
    function prefix(value, pref) {
        return pref + value;
    }

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @param suff
     * @returns {*}
     */
    function suffix(value, suff) {
        return suff + value;
    }
});