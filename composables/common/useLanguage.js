export const useLanguage = () => {
    const languages = useState('languages', () => []);
    const selectedLanguage = useState('selectedLanguage', () => ({ Id: 2, Code: "en", FnsCode: "enUS", Name: 'English' }));

    const setLanguages = (newLanguages = []) => {
        languages.value = newLanguages;

        const savedLocale = localStorage.getItem('locale');
        if (savedLocale) {
            const match = newLanguages.find(x => x.Id == savedLocale);
            if (match) {
                selectedLanguage.value = { Id: match.Id, Code: match.Code, FnsCode: match.FnsCode, Name: match.Name };
            }
        }
    };

    const setSelectedLanguage = async (language) => {
        selectedLanguage.value = language;
        localStorage.setItem('locale', language.Id);
    };

    return {
        languages,
        selectedLanguage,
        setLanguages,
        setSelectedLanguage,
    };
};
