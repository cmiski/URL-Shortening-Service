import styles from './Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className={styles.loader}></span> : children}
    </button>
  );
};
