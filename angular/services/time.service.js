export class TimeService {
    constructor() {
        'ngInject';

        this.DURATION_IN_SECONDS = {
            epochs: ['year', 'month', 'day', 'hour', 'minute'],
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60
        }

    }

    getDuration(seconds) {
        let epoch, interval;

        for (var i = 0; i < this.DURATION_IN_SECONDS.epochs.length; i++) {
            epoch = this.DURATION_IN_SECONDS.epochs[i];
            interval = Math.floor(seconds / this.DURATION_IN_SECONDS[epoch]);
            if (interval >= 1) {
                return {
                    interval: interval,
                    epoch: epoch
                };
            }
        }

    }

    timeSince(date) {
        let seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds >= 60) {
            let duration = this.getDuration(seconds);
            let suffix = (duration.interval > 1 || duration.interval === 0) ? 's' : '';
            return duration.interval + ' ' + duration.epoch + suffix + ' ago';
        } else {
            return 'less minute ago'
        }
    }

    convertUTCDateToLocalDate(date) {
        let d = new Date(date);
        let newDate = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

        let offset = d.getTimezoneOffset() / 60;
        let hours = d.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    convert(d){
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp)
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year,d.month,d.date) :
                                NaN
        );
    }

    compare(a, b){
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
                (a>b)-(a<b) :
                NaN
        );
    }

    fancyTimeFormat(time){
        // Hours, minutes and seconds
        let hrs = ~~(time / 3600);
        let mins = ~~((time % 3600) / 60);
        let secs = time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }


}
