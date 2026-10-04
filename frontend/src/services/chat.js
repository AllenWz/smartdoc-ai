import apiClient from './api';

export async function sendChatMessage(prompt, conversationId = null) {
    const response = await apiClient.post('/chat', {
        prompt,
        conversationId,
    });
    return response.data; // Returns { answer: "...", sources: [...], conversationId: "..." }
}

export async function askQuestion(documentId, question) {
    // Your chat implementation (e.g., API call to api-service/bedrock)
    const response = await fetch(`/api/v1/documents/${documentId}/chat`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        throw new Error('Failed to send question');
    }

    return await response.json();
}