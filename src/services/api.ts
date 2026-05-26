const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  trace: async (qrCode: string) => {
    const res = await fetch(`${API_BASE}/trace/${qrCode}`);
    return res.json();
  },
  // future endpoints
};
