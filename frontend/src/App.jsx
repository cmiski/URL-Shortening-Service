import { useState, useRef } from 'react';
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Card } from './components/Card/Card';
import { RecentList } from './components/RecentList/RecentList';
import { QRCode } from './components/QRCode/QRCode';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { Hero } from './components/Hero/Hero';
import { useRecentUrls } from './hooks/useRecentUrls';
import { useToast } from './context/ToastContext';
import { api } from './services/api';
import styles from './App.module.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formRef = useRef(null);
  const { recentUrls, addRecent } = useRecentUrls();
  const { addToast } = useToast();

  const handleStart = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.shorten(longUrl);
      setResult(data);
      addRecent({ ...data, createdAt: new Date().toISOString() });
      setLongUrl('');
      addToast('URL Shortened Successfully!', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      try {
        await navigator.clipboard.writeText(result.shortUrl);
        addToast('Copied to clipboard!', 'success');
      } catch (err) {
        addToast('Failed to copy', 'error');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: 'Shortened URL',
          url: result.shortUrl
        });
      } catch (err) {
        // Ignored
      }
    }
  };

  return (
    <div className="container">
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logoWrapper}>
            <div className={styles.statusDot}></div>
            <h1 className={styles.logo}>SHORTsee</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <Hero onStart={handleStart} />

      <main className={styles.main}>
        <section className={styles.shortenerSection} ref={formRef}>
          <form onSubmit={handleShorten} className={styles.form}>
            <Input
              placeholder="Paste a long link to shorten..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              error={error}
              autoFocus={false} /* Disable autoFocus so page stays at top */
              className={`${styles.inputOverrides} glass-input`}
              rightElement={
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={!longUrl.trim()}
                >
                  Shorten
                </Button>
              }
            />
          </form>
        </section>

        {result && (
          <section className={styles.resultSection}>
            <Card className={`${styles.resultCard} glass`}>
              <div className={styles.cardContent}>
                <div className={styles.linkInfo}>
                  <span className={styles.label}>Your short link</span>
                  <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className={styles.shortLink}>
                    {result.shortUrl}
                  </a>
                </div>

                <div className={styles.qrWrapper}>
                  <QRCode value={result.shortUrl} />
                </div>
              </div>

              <div className={styles.actions}>
                <Button variant="secondary" onClick={handleCopy} className={styles.actionBtn}>
                  Copy Link
                </Button>
                <Button variant="secondary" onClick={() => window.open(result.shortUrl, '_blank')} className={styles.actionBtn}>
                  Open
                </Button>
                {navigator.share && (
                  <Button variant="secondary" onClick={handleShare} className={styles.actionBtn}>
                    Share
                  </Button>
                )}
              </div>
            </Card>
          </section>
        )}

        <RecentList items={recentUrls} />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <a href="https://github.com/cmiski" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            Created by cmiski
          </a>
          <span className={styles.version}>v3.0.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
