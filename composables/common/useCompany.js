export const useCompany = () => {
    const company = useState('company', () => 'Dashboard');

    const setCompany = (newCompany) => {
        company.value = newCompany;
    };

    return {
        company,
        setCompany,
    };
};
