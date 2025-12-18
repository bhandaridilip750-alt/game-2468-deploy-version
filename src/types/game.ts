// Game type definitions

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameState = 'playing' | 'won' | 'over';
export type PowerUpMode = 'none' | 'divider' | 'doubler' | 'swapper';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  previousPosition?: Position;
}

export type Grid = (Tile | null)[][];

export interface MoveResult {
  grid: Grid;
  scoreGained: number;
  moved: boolean;
  tiles: Tile[];
}

export interface PowerUpState {
  dividerLives: number;
  doublerLives: number;
  swapperLives: number;
  undoLives: number;
  activeMode: PowerUpMode;
  selectedTileId: string | null;
}

export interface GameData {
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameState: GameState;
  playerName: string;
  hasWonBefore: boolean;
  difficulty: Difficulty;
  powerUps: PowerUpState;
}

export function getDefaultPowerUps(difficulty: Difficulty): PowerUpState {
  const lives = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 2 : 1;
  return {
    dividerLives: lives,
    doublerLives: lives,
    swapperLives: lives,
    undoLives: lives,
    activeMode: 'none',
    selectedTileId: null,
  };
}

export const DEFAULT_POWER_UPS: PowerUpState = {
  dividerLives: 3,
  doublerLives: 3,
  swapperLives: 3,
  undoLives: 3,
  activeMode: 'none',
  selectedTileId: null,
};
