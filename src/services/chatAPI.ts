import { apiClient } from '@/lib/api/config';

// 🔑 Get Stream chat token (backend decodes JWT)
export const getChatToken = async () => {
  try {
    const response = await apiClient.post('/api/chat/get-token');
    return response.data;
  } catch (error: any) {
    console.error('❌ getChatToken error:', error.response?.data || error.message);
    throw error;
  }
};

// 💬 Create chat channel (backend reads current user + targetId)
export const createChatChannel = async ({ targetId }: { targetId: string }) => {
  try {
    const response = await apiClient.post('/api/chat/create-channel', { targetId });
    return response.data;
  } catch (error: any) {
    console.error('❌ createChatChannel error:', error.response?.data || error.message);
    throw error;
  }
};

// 📜 Get chat channels for logged-in user
export const getUserChannels = async () => {
  try {
    const response = await apiClient.get('/api/chat/channels');
    return response.data.channels || [];
  } catch (error: any) {
    console.error('❌ getUserChannels error:', error.response?.data || error.message);
    throw error;
  }
};
