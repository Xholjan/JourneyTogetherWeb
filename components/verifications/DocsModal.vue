<!-- <script setup>
import { ref } from 'vue';
import { MimeType } from '~/utils/enums/mimeType';
import { DocType } from '~/utils/enums/docType';

const emit = defineEmits(['close'])
const { $tt } = useNuxtApp();
const isLoading = ref(false);
const items = ref(null);
const file = ref(null)
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

onMounted(async () => {
    await getDocs();
});

const getDocs = async () => {
    isLoading.value = true;
    items.value = await usePersonDocs(props.person?.personId);
    isLoading.value = false;
};

const view = async (doc) => {
    useDocument(doc.Doc, Object.keys(MimeType).find(key => MimeType[key] === doc.DocType), doc.Name);
};

const download = async (doc) => {
    downloadDocument(doc.Doc, Object.keys(MimeType).find(key => MimeType[key] === doc.DocType), doc.Name);
};

const deleteDoc = async (doc) => {
    await useDeleteDoc(doc.PersonDocId);
    await getDocs();
};

const onFileChange = (e) => {
    const target = e.target;
    if (target.files && target.files.length > 0) {
        file.value = target.files[0];
    }
};
const onDocTypeChange = async (personDocId, personDocType) => {
    await useUpdateDocType(personDocId, personDocType);
    await getDocs();
};

const submit = async () => {
    if (!file.value) return null;
    const res = await useUploadDoc(props.person?.personId, file.value);
    if (res) {
        file.value = null;
        await getDocs();
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
                            <h5 class="modal-title">{{ $tt(393) }}:&nbsp;</h5>
                            <h5 class="modal-title text-muted">{{ props.person.name }}</h5>
                            <button type="button" class="btn-close clickable" @click="close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="items && items.length > 0">
                                <div v-for="(item, index) in items" :key="item.PersonDocId"
                                    class="row align-items-center">
                                    <div class="col-12 col-md-5 d-flex align-items-center text-truncate-container pb-1">
                                        <span class="text-muted">{{ index + 1 }} |&nbsp;</span>
                                        <span class="truncate-text">{{ item.Name }}</span>
                                    </div>
                                    <div class="col-12 col-md-7 d-flex justify-content-end align-items-center">
                                        <select v-model="item.PersonDocType" class="form-select form-select-sm no-arrow"
                                            @change="onDocTypeChange(item.PersonDocId, item.PersonDocType)">
                                            <option v-for="option in docTypeOptions" :key="option.value"
                                                :value="option.value">
                                                {{ option.label }}
                                            </option>
                                        </select>

                                        <button class="btn btn-sm btn-hover-primary" @click="download(item)">
                                            <i class="fad fa-download"></i>
                                        </button>
                                        <button class="btn btn-sm btn-hover-primary" @click="view(item)">
                                            <i class="fad fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-hover-danger" @click="deleteDoc(item)">
                                            <i class="fad fa-trash"></i>
                                        </button>
                                    </div>
                                    <hr class="mt-3" />
                                </div>
                            </div>
                            <div v-else>
                                <div class="row">
                                    <div class="col-12 m-0 d-flex align-items-center">
                                        <span class="text-muted w-100 text-center">{{ $tt(49) }}</span>
                                    </div>
                                </div>
                            </div>
                            <input type="file" id="fileUpload" class="d-none" accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                                @change="onFileChange" />
                            <div class="row">
                                <div class="col-4 m-0">
                                    <label for="fileUpload" class="btn btn-outline-primary">
                                        {{ $tt(395) }}
                                    </label>
                                </div>
                                <div class="col-8 m-0 d-flex align-items-center justify-content-end">
                                    <h6 v-if="file" class="m-0 wrap-text">{{ file.name }}</h6>
                                    <h6 v-else class="m-0 text-muted">{{ $tt(396) }}</h6>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer user-select-none">
                            <div class="col-12 m-0 text-end">
                                <button :disabled="!file" @click="submit" class="btn btn-sm btn-outline-success me-2">
                                    {{ $tt(397) }}
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
