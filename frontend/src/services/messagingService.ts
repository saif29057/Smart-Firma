import api from './api';

export interface Message {
  id: number;
  sender_username: string;
  recipient_username: string;
  subject: string;
  content?: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MessageDetail extends Message {
  sender: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  recipient: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface SendMessageData {
  recipient_id: number;
  subject: string;
  content: string;
}

export const messagingService = {
  async getInbox(): Promise<Message[]> {
    const response = await api.get('/messaging/inbox/');
    return response.data;
  },

  async getSentMessages(): Promise<Message[]> {
    const response = await api.get('/messaging/sent/');
    return response.data;
  },

  async sendMessage(messageData: SendMessageData): Promise<MessageDetail> {
    const response = await api.post('/messaging/send/', messageData);
    return response.data;
  },

  async getMessageDetail(messageId: number): Promise<MessageDetail> {
    const response = await api.get(`/messaging/${messageId}/`);
    return response.data;
  },

  async deleteMessage(messageId: number): Promise<void> {
    await api.delete(`/messaging/${messageId}/delete/`);
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/messaging/unread/count/');
    return response.data.unread_count;
  }
};
