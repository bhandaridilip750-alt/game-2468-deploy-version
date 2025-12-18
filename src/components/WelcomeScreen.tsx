'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './styles/WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onSubmit: (name: string) => void;
}

export function WelcomeScreen({ onSubmit }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={styles.modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h1 className={styles.title}>2468</h1>
        <p className={styles.subtitle}>The Classic Puzzle Game</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="playerName" className={styles.label}>
            Enter your name to start
          </label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={styles.input}
            autoFocus
            maxLength={20}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={!name.trim()}
          >
            Start Game
          </button>
        </form>

        <div className={styles.howToPlay}>
          <h3>How to Play</h3>
          <ul>
            <li>Use <strong>arrow keys</strong> or <strong>swipe</strong> to move tiles</li>
            <li>Tiles with the <strong>same number merge</strong> into one</li>
            <li>Create a <strong>2048</strong> tile to win!</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
