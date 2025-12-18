'use client';

import { motion } from 'framer-motion';
import { Tile as TileType, PowerUpMode } from '@/types/game';
import { getTileColor } from '@/lib/constants';
import styles from './styles/Tile.module.css';

interface TileProps {
  tile: TileType;
  cellSize: number;
  gap: number;
  isClickable?: boolean;
  isSelected?: boolean;
  activeMode?: PowerUpMode;
  onClick?: () => void;
}

// Animation timing
const SLIDE_DURATION = 0.15;

export function Tile({ 
  tile, 
  cellSize, 
  gap, 
  isClickable = false,
  isSelected = false,
  activeMode = 'none',
  onClick,
}: TileProps) {
  const { background, text } = getTileColor(tile.value);
  
  // Calculate position in pixels
  const x = tile.col * (cellSize + gap);
  const y = tile.row * (cellSize + gap);

  // Previous position for merge animation
  const prevX = tile.previousPosition ? tile.previousPosition.col * (cellSize + gap) : x;
  const prevY = tile.previousPosition ? tile.previousPosition.row * (cellSize + gap) : y;

  // Determine font size based on number of digits
  const digits = tile.value.toString().length;
  let fontSize = cellSize * 0.45;
  if (digits === 3) fontSize = cellSize * 0.38;
  else if (digits === 4) fontSize = cellSize * 0.32;
  else if (digits >= 5) fontSize = cellSize * 0.26;

  // Determine if this tile can be clicked for the current power-up
  const canClick = isClickable && (
    (activeMode === 'divider' && tile.value > 2) ||
    (activeMode === 'doubler') ||
    (activeMode === 'swapper')
  );

  // Shake animation for tiles when power-up is active
  const shakeAnimation = isClickable && !isSelected ? {
    rotate: [0, -2, 2, -2, 2, 0],
    scale: [1, 1.02, 1, 1.02, 1],
  } : {};

  return (
    <motion.div
      className={`${styles.tile} ${canClick ? styles.clickable : ''} ${isSelected ? styles.selected : ''}`}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: background,
        color: text,
        fontSize: `${fontSize}px`,
      }}
      initial={
        tile.isNew 
          ? { scale: 0, opacity: 0, x, y }
          : tile.previousPosition
          ? { x: prevX, y: prevY, scale: 1, opacity: 1 }
          : { x, y, scale: 1, opacity: 1 }
      }
      animate={{ 
        x, 
        y, 
        scale: isSelected ? 1.08 : 1, 
        opacity: 1,
        ...shakeAnimation,
      }}
      transition={{
        x: { duration: SLIDE_DURATION, ease: [0.33, 1, 0.68, 1] },
        y: { duration: SLIDE_DURATION, ease: [0.33, 1, 0.68, 1] },
        scale: { 
          duration: tile.isNew ? 0.2 : 0.15,
          delay: tile.isMerged ? SLIDE_DURATION : 0,
          ease: 'easeOut',
        },
        opacity: { duration: 0.15 },
        rotate: isClickable ? {
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 0.8,
        } : { duration: 0 },
      }}
      onClick={canClick ? onClick : undefined}
      whileHover={canClick ? { scale: 1.1 } : {}}
      whileTap={canClick ? { scale: 0.95 } : {}}
    >
      <span className={styles.value}>{tile.value}</span>
      
      {tile.isMerged && (
        <motion.div
          className={styles.mergePulse}
          initial={{ scale: 1, opacity: 0 }}
          animate={{ 
            scale: [1, 1.4, 1.1],
            opacity: [0.7, 0.4, 0],
          }}
          transition={{ 
            duration: 0.3,
            delay: SLIDE_DURATION,
            ease: 'easeOut',
          }}
          style={{ backgroundColor: background }}
        />
      )}

      {isSelected && (
        <motion.div
          className={styles.selectedRing}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
}
