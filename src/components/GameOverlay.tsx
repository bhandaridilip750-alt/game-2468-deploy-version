'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game';
import styles from './styles/GameOverlay.module.css';

interface GameOverlayProps {
  gameState: GameState;
  score: number;
  onNewGame: () => void;
  onContinue?: () => void;
}

export function GameOverlay({ gameState, score, onNewGame, onContinue }: GameOverlayProps) {
  if (gameState === 'playing') return null;

  const isWin = gameState === 'won';

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={styles.content}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <h2 className={`${styles.title} ${isWin ? styles.winTitle : styles.overTitle}`}>
            {isWin ? '🎉 You Win!' : 'Game Over'}
          </h2>
          
          <p className={styles.score}>
            {isWin ? 'You reached 2048!' : 'No more moves!'}
          </p>
          
          <div className={styles.finalScore}>
            <span className={styles.scoreLabel}>Final Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>

          <div className={styles.buttons}>
            {isWin && onContinue && (
              <button
                className={styles.continueButton}
                onClick={onContinue}
              >
                Keep Playing
              </button>
            )}
            <button
              className={styles.newGameButton}
              onClick={onNewGame}
            >
              New Game
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
