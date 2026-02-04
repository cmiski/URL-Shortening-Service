import { Button } from '../Button/Button';
import styles from './Hero.module.css';

export const Hero = ({ onStart }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          v3.0 Now Live
        </div>
        <h1 className={styles.headline}>
          URLs made short.<br />
          <span className={styles.gradientText}>Life made simple.</span>
        </h1>
        <p className={styles.subtext}>
          Transform long, ugly links into clean, shareable assets.
          Blazing fast redirects with enterprise-grade reliability.
        </p>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0.02s</span>
            <span className={styles.statLabel}>Latency</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Free</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>∞</span>
            <span className={styles.statLabel}>Unlimited</span>
          </div>
        </div>

        <div className={styles.cta}>
          <Button variant="primary" size="lg" onClick={onStart} className={styles.startBtn}>
            Start Shortening
          </Button>
          <span className={styles.hint}>No credit card required</span>
        </div>
      </div>
    </section>
  );
};
