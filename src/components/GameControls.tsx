'use client';

import styles from './styles/GameControls.module.css';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function GameControls({ onNewGame, onUndo, canUndo }: GameControlsProps) {
  return (
    <div className={styles.container}>
      <button 
        className={styles.button} 
        onClick={onNewGame}
        aria-label="Start new game"
      >
        New Game
      </button>
      <button
        className={`${styles.button} ${styles.undoButton}`}
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last move"
      >
        ↩ Undo
      </button>
    </div>
  );
}
