import styles from './Toast.module.css';

export const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
    </div>
  );
};
