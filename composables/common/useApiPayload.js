export const useApiPayload = (filters = {}, extra = {}) => {
    const { $auth } = useNuxtApp();
    const user = isRef($auth?.user) ? $auth.user.value : $auth?.user;
    if (!filters.dateFrom && !filters.dateTo) {
        const { formatGlobalDate } = useFormat();
        const storedDateFrom = localStorage.getItem('date-from');
        const storedDateTo = localStorage.getItem('date-to');
        const dateFrom = storedDateFrom ? new Date(storedDateFrom) : new Date();
        const dateTo = storedDateTo ? new Date(storedDateTo) : new Date();
        return {
            DateFrom: formatGlobalDate(dateFrom),
            DateTo: formatGlobalDate(dateTo),
            PersonId: user.PersonId,
            ...extra,
        };
    }
    else {
        return {
            DateFrom: filters.dateFrom,
            DateTo: filters.dateTo,
            PersonId: user.PersonId,
            ...extra,
        };
    }
};