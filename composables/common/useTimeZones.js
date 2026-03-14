export const useTimeZones = () => {
    const timezones = useState('timezones', () => []);

    const setTimeZones = (newTimeZones = []) => {
        timezones.value = newTimeZones;

        const stored = Number(localStorage.getItem('timezone'));
        const hasStored = Number.isFinite(stored);

        if (!hasStored) {
            localStorage.setItem('timezone', 0);
            return;
        }

        const exists = newTimeZones.some(tz => tz.id === stored);
        if (!exists) {
            localStorage.setItem('timezone', 0);
        }
    };

    return {
        timezones,
        setTimeZones,
    };
};
