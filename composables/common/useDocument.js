export const useDocument = (bytes, mimeType, fileName) => {
    const uint8Bytes = base64ToUint8Array(bytes);
    const blob = new Blob([uint8Bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const newWindow = window.open('', '_blank');

    if (newWindow) {
        newWindow.document.title = fileName;

        const iframe = newWindow.document.createElement('iframe');
        iframe.src = blobUrl;
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100vh';

        newWindow.document.body.style.margin = '0';
        newWindow.document.body.appendChild(iframe);
    }
};

export const downloadDocument = (bytes, mimeType, fileName) => {
    const uint8Bytes = base64ToUint8Array(bytes);
    const blob = new Blob([uint8Bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
};

const base64ToUint8Array = (base64) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};
