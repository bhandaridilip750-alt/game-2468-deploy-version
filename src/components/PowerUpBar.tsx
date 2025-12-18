'use client';

import { motion } from 'framer-motion';
import { PowerUpState, PowerUpMode, GameState } from '@/types/game';
import styles from './styles/PowerUpBar.module.css';

interface PowerUpBarProps {
  powerUps: PowerUpState;
  onActivate: (mode: PowerUpMode) => void;
  onUndo: () => void;
  onCancel: () => void;
  gameState: GameState;
}

export function PowerUpBar({ powerUps, onActivate, onUndo, onCancel, gameState }: PowerUpBarProps) {
  const isDisabled = gameState === 'over' || gameState === 'won';
  const isActiveMode = powerUps.activeMode !== 'none';

  return (
    <div className={styles.container}>
      {isActiveMode && (
        <motion.div 
          className={styles.activeIndicator}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>
            {powerUps.activeMode === 'divider' && '÷ Click a tile to divide by 2'}
            {powerUps.activeMode === 'doubler' && '×2 Click a tile to double'}
            {powerUps.activeMode === 'swapper' && (
              powerUps.selectedTileId 
                ? '⇄ Click another tile to swap'
                : '⇄ Click first tile to swap'
            )}
          </span>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        </motion.div>
      )}

      <div className={styles.powerUps}>
        <motion.button
          className={`${styles.powerUpBtn} ${powerUps.activeMode === 'divider' ? styles.active : ''}`}
          onClick={() => onActivate('divider')}
          disabled={isDisabled || powerUps.dividerLives <= 0 || (isActiveMode && powerUps.activeMode !== 'divider')}
          whileHover={powerUps.dividerLives > 0 ? { scale: 1.05 } : {}}
          whileTap={powerUps.dividerLives > 0 ? { scale: 0.95 } : {}}
        >
          <span className={styles.icon}>÷</span>
          <span className={styles.name}>Divider</span>
          <span className={styles.lives}>{powerUps.dividerLives}</span>
        </motion.button>

        <motion.button
          className={`${styles.powerUpBtn} ${powerUps.activeMode === 'doubler' ? styles.active : ''}`}
          onClick={() => onActivate('doubler')}
          disabled={isDisabled || powerUps.doublerLives <= 0 || (isActiveMode && powerUps.activeMode !== 'doubler')}
          whileHover={powerUps.doublerLives > 0 ? { scale: 1.05 } : {}}
          whileTap={powerUps.doublerLives > 0 ? { scale: 0.95 } : {}}
        >
          <span className={styles.icon}>×2</span>
          <span className={styles.name}>Doubler</span>
          <span className={styles.lives}>{powerUps.doublerLives}</span>
        </motion.button>

        <motion.button
          className={`${styles.powerUpBtn} ${powerUps.activeMode === 'swapper' ? styles.active : ''}`}
          onClick={() => onActivate('swapper')}
          disabled={isDisabled || powerUps.swapperLives <= 0 || (isActiveMode && powerUps.activeMode !== 'swapper')}
          whileHover={powerUps.swapperLives > 0 ? { scale: 1.05 } : {}}
          whileTap={powerUps.swapperLives > 0 ? { scale: 0.95 } : {}}
        >
          <span className={styles.icon}>⇄</span>
          <span className={styles.name}>Swapper</span>
          <span className={styles.lives}>{powerUps.swapperLives}</span>
        </motion.button>

        <motion.button
          className={styles.powerUpBtn}
          onClick={onUndo}
          disabled={isDisabled || powerUps.undoLives <= 0 || isActiveMode}
          whileHover={powerUps.undoLives > 0 ? { scale: 1.05 } : {}}
          whileTap={powerUps.undoLives > 0 ? { scale: 0.95 } : {}}
        >
          <span className={styles.icon}>↩</span>
          <span className={styles.name}>Undo</span>
          <span className={styles.lives}>{powerUps.undoLives}</span>
        </motion.button>
      </div>
    </div>
  );
}
