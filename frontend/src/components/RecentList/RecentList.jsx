import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../Card/Card';
import styles from './RecentList.module.css';

const RecentItem = ({ item }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch fresh stats
    api.getStats(item.shortCode)
      .then(setStats)
      .catch(() => setStats(item)); // Fallback to local data
  }, [item.shortCode]);

  const displayData = stats || item;

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <a href={displayData.shortUrl} target="_blank" rel="noopener noreferrer" className={styles.shortUrl}>
          {displayData.shortUrl?.replace(/^https?:\/\//, '')}
        </a>
        <span className={styles.longUrl} title={displayData.longUrl}>
          {displayData.longUrl?.replace(/^https?:\/\//, '')}
        </span>
      </div>
      <div className={styles.meta}>
        <span className={styles.clicks}>
          {displayData.clickCount || 0} clicks
        </span>
        <span className={styles.date}>
          {new Date(displayData.createdAt || Date.now()).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
};

export const RecentList = ({ items }) => {
  if (!items.length) return null;

  return (
    <Card className={styles.container}>
      <h3 className={styles.title}>Recent URLs</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <RecentItem key={item.shortCode} item={item} />
        ))}
      </div>
    </Card>
  );
};
