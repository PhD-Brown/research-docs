import React from 'react';
import styles from './styles.module.css';

export default function UnderConstruction() {
  return (
    <div className={styles.constructionContainer}>
      <div className={styles.iconWrapper}>
        <span className={styles.pulseIcon}>🚀</span>
      </div>
      <div className={styles.textContent}>
        <h3 className={styles.title}>Under Construction</h3>
        <p className={styles.description}>
          This page is actively being developed. Core content is added progressively. 
          Check back soon for updates!
        </p>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
}
