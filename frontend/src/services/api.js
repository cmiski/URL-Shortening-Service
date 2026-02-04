const API_BASE = '/api';

export const api = {
  shorten: async (longUrl) => {
    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.errors?.longUrl?.[0] || 'Failed to shorten URL');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  getStats: async (shortCode) => {
    try {
      const res = await fetch(`${API_BASE}/stats/${shortCode}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};
