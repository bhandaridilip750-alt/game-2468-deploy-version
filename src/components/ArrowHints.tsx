'use client';

import styles from './styles/ArrowHints.module.css';

export function ArrowHints() {
  return (
    <div className={styles.container}>
      <div className={styles.hint}>
        <span className={styles.label}>Use</span>
        <div className={styles.arrows}>
          <div className={styles.arrowRow}>
            <kbd className={styles.key}>↑</kbd>
          </div>
          <div className={styles.arrowRow}>
            <kbd className={styles.key}>←</kbd>
            <kbd className={styles.key}>↓</kbd>
            <kbd className={styles.key}>→</kbd>
          </div>
        </div>
        <span className={styles.label}>or swipe</span>
      </div>
    </div>
  );
}
