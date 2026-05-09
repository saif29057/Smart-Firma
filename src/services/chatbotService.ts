import api from './api';

export interface ChatMessage {
  id: number;
  message: string;
  response: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  timestamp?: string;
}

export interface ChatHistoryResponse {
  history: ChatMessage[];
}

export const chatbotService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    const response = await api.post('/chatbot/chat/', { message });
    return response.data;
  },

  async getHistory(): Promise<ChatMessage[]> {
    const response = await api.get('/chatbot/history/');
    return response.data.history;
  },

  async clearHistory(): Promise<void> {
    await api.delete('/chatbot/clear/');
  }
};
