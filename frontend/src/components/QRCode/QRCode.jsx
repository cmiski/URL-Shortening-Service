import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '../../context/ThemeContext';
import styles from './QRCode.module.css';

export const QRCode = ({ value }) => {
  const { theme } = useTheme();

  // Dark mode (default): #fcfcfc (white)
  // Light mode: #1d1d1f (dark gray)
  const fgColor = theme === 'dark' ? '#fcfcfc' : '#1d1d1f';

  return (
    <div className={styles.wrapper}>
      <div className={styles.code}>
        <QRCodeSVG
          value={value}
          size={128}
          level={"L"}
          bgColor={"transparent"}
          fgColor={fgColor}
        />
      </div>
      <span className={styles.label}>Scan to open on mobile</span>
    </div>
  );
};
