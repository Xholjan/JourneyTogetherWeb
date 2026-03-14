import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

export const useCountryPrefixes = () => {
    const prefixes = Array.from(
        new Set(
            getCountries().map(
                (code) => `+${getCountryCallingCode(code)}`
            )
        )
    ).sort((a, b) => a.localeCompare(b))

    return {
        prefixes,
    }
}
