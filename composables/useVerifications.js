import { useNuxtApp } from '#app';

export const useVerifications = (filters) => {
    const { $axios } = useNuxtApp();

    const payload = {
        Verified: filters.verified
    };
    return $axios.post('/verifications', payload);
};

export const usePersonDocs = (personId) => {
    const { $axios } = useNuxtApp();

    return $axios.get('/get-docs', {
        params: { personId }
    });
};

export const useDeleteDoc = (personDocId) => {
    const { $axios } = useNuxtApp();

    return $axios.post('/delete-doc', null, {
        params: { personDocId }
    });
};

export const useUploadDoc = (personId, file) => {
    const { $axios } = useNuxtApp();

    const formData = new FormData()
    formData.append('file', file)

    return $axios.post(`/upload-doc/${personId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const usePersonVerification = (personId) => {
    const { $axios } = useNuxtApp();

    return $axios.get('/person-verification', {
        params: { personId }
    });
};

export const modifyPersonVerification = (form) => {
    const { $axios } = useNuxtApp();
    const { formatGlobalDate } = useFormat();

    const payload = {
        MemberId: form.personId,
        PersonalIdentityNumber: form.personalIdentityNumber,
        PersonIdentityIssueDate: formatGlobalDate(form.personIdentityIssueDate),
        PersonIdentityExpiryDate: formatGlobalDate(form.personIdentityExpiryDate),
        PersonDocType: form.personDocType,
        Verified: form.verified
    };

    return $axios.post('/modify-person-verification', payload);
};

export const useUpdateDocType = (personDocId, personDocType) => {
    const { $axios } = useNuxtApp();

    const payload = {
        PersonDocId: personDocId,
        PersonDocType: personDocType
    };

    return $axios.post('/update-doc', payload);
};
