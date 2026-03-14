export const useFormat = () => {
    const formatDecimal = (value) => {
        return value?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) || '0.00';
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(num)) return '';
        return num.toLocaleString('en-US');
    };

    const formatPercentage = (value) => {
        if (value == null || isNaN(value)) return '0';

        let num = Number(value);
        let rounded = Math.round(num * 100) / 100;

        let str = rounded.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

        if (str.endsWith('.0') || str.endsWith(',0')) {
            str = str.slice(0, -2);
        }

        return str;
    };

    const formatDate = (date, withTime = null) => {
        const d = new Date(date);

        const pad = n => n.toString().padStart(2, '0');

        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();

        if (withTime == null) {
            return `${year}/${month}/${day}`;
        }

        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());

        if (!withTime)
            return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        else if (withTime)
            return `${hours}:${minutes}:${seconds} ${year}/${month}/${day}`;
    };

    const formatMatchDate = (date) => {
        const d = new Date(date);

        const pad = n => n.toString().padStart(2, '0');

        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());

        return `${hours}:${minutes} ${year}/${month}/${day}`;
    };

    const formatTicketDate = (date, withSec = false) => {
        const d = new Date(date);

        const pad = n => n.toString().padStart(2, '0');

        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());

        if (withSec == false)
            return `${hours}:${minutes} ${day}/${month}/${year}`;
        else
            return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
        const d = new Date(date);

        const pad = n => n.toString().padStart(2, '0');

        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());

        return `${hours}:${minutes}:${seconds}`;
    };

    const formatGlobalDate = (date) => {
        const nd = new Date(date);
        nd.setHours(0, 0, 0, 0);
        const utcDate = new Date(nd.getTime() - (nd.getTimezoneOffset() * 60000));
        return utcDate;
    };

    const formatNowDate = (date) => {
        const nd = new Date(date);
        const utcDate = new Date(nd.getTime() - (nd.getTimezoneOffset() * 60000));
        return utcDate;
    };

    return {
        formatDecimal,
        formatNumber,
        formatPercentage,
        formatDate,
        formatMatchDate,
        formatTicketDate,
        formatTime,
        formatGlobalDate,
        formatNowDate
    };
};