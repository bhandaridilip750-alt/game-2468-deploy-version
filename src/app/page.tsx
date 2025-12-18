'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import styles from './page.module.css';

const levels = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Perfect for beginners',
    color: '#4ade80',
    icon: '🌱',
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'A balanced challenge',
    color: '#fbbf24',
    icon: '⚡',
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'For puzzle masters',
    color: '#f87171',
    icon: '🔥',
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar showNewGame={false} />
      
      <main className={styles.main}>
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>2468</h1>
          <p className={styles.subtitle}>The Classic Number Puzzle</p>
        </motion.div>

        <motion.div
          className={styles.levelGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className={styles.selectTitle}>Select Difficulty</h2>
          
          <div className={styles.levels}>
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link href={`/game?level=${level.id}`} className={styles.levelCard}>
                  <div 
                    className={styles.levelIcon}
                    style={{ backgroundColor: level.color }}
                  >
                    {level.icon}
                  </div>
                  <h3 className={styles.levelName}>{level.name}</h3>
                  <p className={styles.levelDesc}>{level.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.features}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className={styles.featuresTitle}>Power-ups Available</h3>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>÷</span>
              <span>Divider</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>×2</span>
              <span>Doubler</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⇄</span>
              <span>Swapper</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
