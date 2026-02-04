import { useState, useEffect } from 'react';

export const useRecentUrls = () => {
  const [recentUrls, setRecentUrls] = useState(() => {
    try {
      const saved = localStorage.getItem('recentUrls');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('recentUrls', JSON.stringify(recentUrls));
  }, [recentUrls]);

  const addRecent = (urlData) => {
    setRecentUrls(prev => {
      // Remove duplicates
      const filtered = prev.filter(u => u.shortCode !== urlData.shortCode);
      // Add new to top, limit to 10
      return [urlData, ...filtered].slice(0, 10);
    });
  };

  return { recentUrls, addRecent };
};
