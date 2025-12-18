'use client';

import { Difficulty } from '@/types/game';
import styles from './styles/ScoreBoard.module.css';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  playerName: string;
  difficulty?: Difficulty;
}

const difficultyLabels = {
  easy: '4×4',
  medium: '5×5',
  hard: '6×6',
};

export function ScoreBoard({ score, bestScore, playerName, difficulty = 'easy' }: ScoreBoardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.playerInfo}>
        <span className={styles.greeting}>Hello, </span>
        <span className={styles.playerName}>{playerName}</span>
        <span className={styles.difficulty}>{difficultyLabels[difficulty]}</span>
      </div>
      <div className={styles.scores}>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>SCORE</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>BEST</span>
          <span className={styles.scoreValue}>{bestScore}</span>
        </div>
      </div>
    </div>
  );
}
