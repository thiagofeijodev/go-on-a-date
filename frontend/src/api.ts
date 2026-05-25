import axios from 'axios';

// In production, set VITE_API_URL to your backend URL e.g. https://api.yourdomain.com
// In development with the Vite proxy active, leave it unset and the proxy handles /api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

export interface RespondPayload {
  inviterEmail: string;
  selectedDate: string;
  selectedTime: string;
  foodType: string;
}

export const inviteApi = {
  respond: (payload: RespondPayload) => api.post('/respond', payload),
};

// Encode inviter info into a URL-safe base64 token
export interface InviteData {
  email: string;
  start: string;
  end: string;
}

export function encodeInvite(data: InviteData): string {
  return btoa(JSON.stringify(data));
}

export function decodeInvite(token: string): InviteData | null {
  try {
    return JSON.parse(atob(token)) as InviteData;
  } catch {
    return null;
  }
}
