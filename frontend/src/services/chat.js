import apiClient from './api';

export async function sendChatMessage(prompt, conversationId = null) {
    const response = await apiClient.post('/chat', {
        prompt,
        conversationId,
    });
    return response.data; // Returns { answer: "...", sources: [...], conversationId: "..." }
}