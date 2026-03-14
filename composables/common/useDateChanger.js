export const useDateChanger = (dateFrom, dateTo) => {
    localStorage.setItem('date-from', dateFrom);
    localStorage.setItem('date-to', dateTo);
}
