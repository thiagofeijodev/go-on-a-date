import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

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
