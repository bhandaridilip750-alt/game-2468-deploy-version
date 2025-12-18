'use client';

import { useMemo, useState, useEffect } from 'react';
import { Tile as TileType, PowerUpMode } from '@/types/game';
import { Tile } from './Tile';
import styles from './styles/GameBoard.module.css';

interface GameBoardProps {
  tiles: TileType[];
  gridSize: number;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  activeMode?: PowerUpMode;
  selectedTileId?: string | null;
  onTileClick?: (tileId: string) => void;
}

// Calculate board dimensions based on screen width and grid size
function useBoardSize(gridSize: number) {
  const [dimensions, setDimensions] = useState({
    boardSize: 480,
    gap: 12,
    cellSize: 111,
  });

  useEffect(() => {
    function calculateSize() {
      const screenWidth = window.innerWidth;
      const padding = 16;
      
      // Desktop max size - increased for larger grids
      const maxBoardSize = gridSize === 4 ? 520 : gridSize === 5 ? 560 : 600;
      const boardSize = Math.min(maxBoardSize, screenWidth - padding * 2);
      
      // Smaller gap for larger grids to maximize cell size
      const gap = Math.max(
        4, // Minimum gap 4px
        Math.floor(boardSize * (gridSize <= 4 ? 0.025 : gridSize === 5 ? 0.02 : 0.015))
      );
      
      const totalGaps = gap * (gridSize + 1);
      const cellSize = Math.floor((boardSize - totalGaps) / gridSize);
      
      setDimensions({ boardSize, gap, cellSize });
    }

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [gridSize]);

  return dimensions;
}

export function GameBoard({ 
  tiles, 
  gridSize,
  onTouchStart, 
  onTouchEnd,
  activeMode = 'none',
  selectedTileId,
  onTileClick,
}: GameBoardProps) {
  const { boardSize, gap, cellSize } = useBoardSize(gridSize);
  const isSelectionMode = activeMode !== 'none';

  // Generate background grid cells
  const backgroundCells = useMemo(() => {
    const cells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        cells.push(
          <div
            key={`cell-${row}-${col}`}
            className={styles.cell}
            style={{
              width: cellSize,
              height: cellSize,
              left: gap + col * (cellSize + gap),
              top: gap + row * (cellSize + gap),
            }}
          />
        );
      }
    }
    return cells;
  }, [cellSize, gap, gridSize]);

  return (
    <div
      className={`${styles.boardWrapper} ${isSelectionMode ? styles.selectionMode : ''}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className={styles.board}
        style={{ width: boardSize, height: boardSize }}
      >
        <div className={styles.gridBackground}>
          {backgroundCells}
        </div>

        <div 
          className={styles.tilesContainer}
          style={{
            left: gap,
            top: gap,
          }}
        >
          {tiles.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              cellSize={cellSize}
              gap={gap}
              isClickable={isSelectionMode}
              isSelected={tile.id === selectedTileId}
              activeMode={activeMode}
              onClick={() => onTileClick?.(tile.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
