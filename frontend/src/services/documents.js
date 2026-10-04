import apiClient from './api';

// Fetch list of documents accessible by current user/department
export async function fetchDocuments() {
    const response = await apiClient.get('/documents');
    return response.data;
}

// Request S3 Pre-signed URL and upload PDF directly to S3
export async function uploadDocument(file, visibility = 'PRIVATE') {
    // Step 1: Get presigned URL from Spring Boot API
    const presignResponse = await apiClient.post('/documents/presigned-url', {
        filename: file.name,
        contentType: file.type,
        visibility: visibility, // 'PUBLIC' or 'PRIVATE'
    });

    const { uploadUrl, s3Key } = presignResponse.data;

    // Step 2: Upload file directly to S3 (bypassing backend container)
    await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });

    // Step 3: Notify backend that upload completed so processing queue triggers
    const confirmResponse = await apiClient.post('/documents/confirm-upload', {
        s3Key,
        filename: file.name,
        visibility,
    });

    return confirmResponse.data;
}