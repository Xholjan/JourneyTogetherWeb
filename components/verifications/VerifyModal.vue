<!-- <script setup>;
import { ref } from 'vue';
import { DocType } from '~/utils/enums/docType';

const emit = defineEmits(['close', 'refresh'])
const { $tt } = useNuxtApp();
const isLoading = ref(false);
const shown = ref(true);

const docTypeOptions = Object.entries(DocType).map(([key, value]) => ({
    label: key,
    value
}));

const props = defineProps({
    person: {
        type: Object,
        required: true
    }
});

const form = ref({
    personId: props.person?.personId,
    personIdentityIssueDate: null,
    personIdentityExpiryDate: null,
    personalIdentityNumber: null,
    personDocType: 1,
    verified: false
});

onMounted(async () => {
    await getPersonVerification();
});

const getPersonVerification = async () => {
    isLoading.value = true;
    const res = await usePersonVerification(props.person?.personId);

    form.value.personIdentityIssueDate = res.PersonIdentityIssueDate ? new Date(res.PersonIdentityIssueDate) : null;
    form.value.personIdentityExpiryDate = res.PersonIdentityExpiryDate ? new Date(res.PersonIdentityExpiryDate) : null;

    form.value.personalIdentityNumber = res.PersonalIdentityNumber;
    form.value.personDocType = res.PersonDocType ?? 0;
    form.value.verified = res.Verified;

    isLoading.value = false;
};

const submit = async () => {
    var res = await modifyPersonVerification(form.value);
    if (res) {
        emit('refresh', true);
        await close();
    }
};

const close = async () => {
    shown.value = false;
    emit('close')
};
</script>

<template>
    <Teleport to="body">
        <div v-if="shown" @click.stop>
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show" tabindex="-1" style="display: block;" role="dialog">
                <div class="modal-dialog modal-bottom modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ $tt(392) }}:&nbsp;</h5>
                            <h5 class="modal-title text-muted">{{ props.person.name }}</h5>
                            <button type="button" class="btn-close clickable" @click="close">
                            </button>
                        </div>
                        <div class="modal-body p-10">
                            <div class="row pb-2">
                                <div class="col-6 d-flex align-items-center">{{ $tt(398) }}:</div>
                                <div class="col-6">
                                    <input v-model="form.personalIdentityNumber" class="form-control" tabindex="1" />
                                </div>
                            </div>
                            <div class="row pb-2">
                                <div class="col-6 d-flex align-items-center">{{ $tt(399) }}:</div>
                                <div class="col-6">
                                    <CommonBaseDatePicker v-model="form.personIdentityIssueDate" :enableTime="false"
                                        :clearable="true" :autoApply="true" teleport="body">
                                    </CommonBaseDatePicker>
                                </div>
                            </div>

                            <div class="row pb-2">
                                <div class="col-6 d-flex align-items-center">{{ $tt(400) }}:</div>
                                <div class="col-6">
                                    <CommonBaseDatePicker v-model="form.personIdentityExpiryDate" :enableTime="false"
                                        :clearable="true" :autoApply="true" teleport="body">
                                    </CommonBaseDatePicker>
                                </div>
                            </div>
                            <div class="row pb-2">
                                <div class="col-6 d-flex align-items-center">
                                    <label class="form-label">{{ $tt(410) }}:</label>
                                </div>
                                <div class="col-6">
                                    <select v-model="form.personDocType" class="form-select form-select-sm no-arrow">
                                        <option v-for="option in docTypeOptions" :key="option.value"
                                            :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 d-flex align-items-center">
                                    <label class="form-label">{{ $tt(351) }}:</label>
                                </div>
                                <div class="col-6">
                                    <div class=" form-control text-end" @click="form.verified = !form.verified">
                                        <input type="checkbox" class="form-check-input" v-model="form.verified"
                                            tabindex="11" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer user-select-none">
                            <div class="col-12 m-0 text-end">
                                <button @click="submit" class="btn btn-sm btn-outline-success me-2">
                                    {{ $tt(32) }}
                                </button>
                                <button @click="close" class="btn btn-sm btn-outline-danger">
                                    {{ $tt(125) }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template> -->
