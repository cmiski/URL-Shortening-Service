import styles from './Input.module.css';

export const Input = ({
  label,
  error,
  className = '',
  rightElement,
  ...props
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          className={`${styles.input} ${error ? styles.hasError : ''}`}
          {...props}
        />
        {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
