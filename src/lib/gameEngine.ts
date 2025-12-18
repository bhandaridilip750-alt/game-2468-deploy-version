// Pure game logic functions - no React dependencies

import { Tile, Direction, MoveResult, Position, Difficulty } from '@/types/game';
import {
    GRID_SIZES,
    WIN_SCORE
} from './constants';

// Generate unique ID for tiles using timestamp + random for uniqueness
let tileIdCounter = 0;
export function generateTileId(): string {
    return `tile-${Date.now()}-${++tileIdCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

// Reset tile ID counter (useful for new games)
export function resetTileIdCounter(): void {
    tileIdCounter = 0;
}

// Create a new tile at given position
export function createTile(row: number, col: number, value: number = 2, isNew: boolean = false): Tile {
    return {
        id: generateTileId(),
        value,
        row,
        col,
        isNew,
        isMerged: false,
    };
}

// --- ROBUST SPAWN LOGIC ---

// Get spawn value based on dynamic mathematical difficulty scalar
export function getSpawnValue(difficulty: Difficulty, currentScore: number, tiles: Tile[]): number {
    // Easy mode remains simple: mostly 2s, rare 4s
    if (difficulty === 'easy') {
        return Math.random() < 0.1 ? 4 : 2;
    }

    // --- Mathematical Difficulty Model ---

    // 1. Calculate Effective Score (Score + High Tile Bonus)
    // This prevents hoarding high tiles without merging
    const maxTile = getMaxTileValue(tiles);
    const effectiveScore = currentScore + (maxTile * 20);

    // 2. Calculate Difficulty Scalar (D)
    // Logarithmic scale: 10->1, 100->2, 1000->3, 10000->4
    // Clamped max difficulty to avoid infinite scaling breaking things
    const D = Math.min(Math.log10(Math.max(10, effectiveScore + 1)), 7);

    // 3. Calculate Weights based on D
    // 2 Tile: Dominant early, decays linearly
    const w2 = Math.max(1, 100 - 20 * D);

    // 4 Tile: Ramps aggressively as you prove competence
    const w4 = Math.max(1, 5 + 30 * D);

    // 8 Tile: Starts appearing around D=3 (Score ~1000)
    const w8 = Math.max(0, (D - 3) * 25);

    // 16 Tile: Punishment tier, appears around D=5 (Score ~100,000) - Very late game
    const w16 = Math.max(0, (D - 5) * 15);

    // 4. Normalize and Select
    const totalWeight = w2 + w4 + w8 + w16;
    const rand = Math.random() * totalWeight;

    if (rand < w2) return 2;
    if (rand < w2 + w4) return 4;
    if (rand < w2 + w4 + w8) return 8;
    return 16;
}

// Get random empty position from tiles array
export function getRandomEmptyPosition(tiles: Tile[], gridSize: number): Position | null {
    const occupiedPositions = new Set(tiles.map(t => `${t.row},${t.col}`));
    const emptyPositions: Position[] = [];

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!occupiedPositions.has(`${row},${col}`)) {
                emptyPositions.push({ row, col });
            }
        }
    }

    if (emptyPositions.length === 0) return null;
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
}

// Spawn a new tile based on difficulty and score
export function spawnTile(tiles: Tile[], difficulty: Difficulty, currentScore: number): Tile | null {
    const gridSize = GRID_SIZES[difficulty];
    const position = getRandomEmptyPosition(tiles, gridSize);
    if (!position) return null;

    const value = getSpawnValue(difficulty, currentScore, tiles);
    return createTile(position.row, position.col, value, true);
}

// Initialize game with 2 random tiles
export function initializeTiles(difficulty: Difficulty): Tile[] {
    resetTileIdCounter();
    const tiles: Tile[] = [];

    // Initial tiles are always 2 for fairness at start
    const gridSize = GRID_SIZES[difficulty];

    const pos1 = getRandomEmptyPosition(tiles, gridSize);
    if (pos1) tiles.push(createTile(pos1.row, pos1.col, 2, true));

    const pos2 = getRandomEmptyPosition(tiles, gridSize);
    if (pos2) tiles.push(createTile(pos2.row, pos2.col, 2, true));

    return tiles;
}

// Get tile at position
function getTileAt(tiles: Tile[], row: number, col: number): Tile | undefined {
    return tiles.find(t => t.row === row && t.col === col);
}

// Check if position is within grid bounds
function isWithinBounds(pos: Position, gridSize: number): boolean {
    return pos.row >= 0 && pos.row < gridSize && pos.col >= 0 && pos.col < gridSize;
}

// Build traversal orders based on direction
function buildTraversals(direction: Direction, gridSize: number): { rows: number[]; cols: number[] } {
    const rows: number[] = [];
    const cols: number[] = [];

    for (let i = 0; i < gridSize; i++) {
        rows.push(i);
        cols.push(i);
    }

    if (direction === 'down') rows.reverse();
    if (direction === 'right') cols.reverse();

    return { rows, cols };
}

// Find the farthest position a tile can move to
function findFarthestPosition(
    tiles: Tile[],
    tile: Tile,
    vector: { row: number; col: number },
    gridSize: number
): { farthestPos: Position; nextTile: Tile | undefined } {
    let previous: Position = { row: tile.row, col: tile.col };
    let current: Position = { row: tile.row + vector.row, col: tile.col + vector.col };

    while (isWithinBounds(current, gridSize) && !getTileAt(tiles, current.row, current.col)) {
        previous = current;
        current = { row: current.row + vector.row, col: current.col + vector.col };
    }

    const nextTile = isWithinBounds(current, gridSize) ? getTileAt(tiles, current.row, current.col) : undefined;

    return { farthestPos: previous, nextTile };
}

// Move tiles in a direction
export function move(tiles: Tile[], direction: Direction, gridSize: number): MoveResult {
    let newTiles = tiles.map(t => ({
        ...t,
        isNew: false,
        isMerged: false,
        previousPosition: { row: t.row, col: t.col } as Position,
    }));

    let scoreGained = 0;
    let moved = false;

    const vectors = {
        up: { row: -1, col: 0 },
        down: { row: 1, col: 0 },
        left: { row: 0, col: -1 },
        right: { row: 0, col: 1 },
    };

    const vector = vectors[direction];
    const traversals = buildTraversals(direction, gridSize);

    for (const row of traversals.rows) {
        for (const col of traversals.cols) {
            const tile = getTileAt(newTiles, row, col);
            if (!tile) continue;

            const { farthestPos, nextTile } = findFarthestPosition(newTiles, tile, vector, gridSize);

            if (nextTile && nextTile.value === tile.value && !nextTile.isMerged) {
                const mergedValue = tile.value * 2;
                scoreGained += mergedValue;
                moved = true;

                const originalPos = tile.previousPosition || { row: tile.row, col: tile.col };

                newTiles = newTiles.filter(t => t.id !== tile.id && t.id !== nextTile.id);
                newTiles.push({
                    id: generateTileId(),
                    value: mergedValue,
                    row: nextTile.row,
                    col: nextTile.col,
                    isNew: false,
                    isMerged: true,
                    previousPosition: originalPos,
                });
            } else if (farthestPos.row !== tile.row || farthestPos.col !== tile.col) {
                moved = true;
                const tileIndex = newTiles.findIndex(t => t.id === tile.id);
                if (tileIndex !== -1) {
                    newTiles[tileIndex] = {
                        ...newTiles[tileIndex],
                        row: farthestPos.row,
                        col: farthestPos.col,
                    };
                }
            }
        }
    }

    return {
        grid: [],
        scoreGained,
        moved,
        tiles: newTiles,
    };
}

// Check if there are any possible moves
export function canMove(tiles: Tile[], gridSize: number): boolean {
    if (tiles.length < gridSize * gridSize) return true;

    for (const tile of tiles) {
        const directions: Position[] = [
            { row: tile.row - 1, col: tile.col },
            { row: tile.row + 1, col: tile.col },
            { row: tile.row, col: tile.col - 1 },
            { row: tile.row, col: tile.col + 1 },
        ];

        for (const pos of directions) {
            if (isWithinBounds(pos, gridSize)) {
                const adjacent = getTileAt(tiles, pos.row, pos.col);
                if (adjacent && adjacent.value === tile.value) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Check if game is over
export function isGameOver(tiles: Tile[], gridSize: number): boolean {
    return !canMove(tiles, gridSize);
}

// Check if player has won (has a 2048 tile)
export function hasWon(tiles: Tile[]): boolean {
    return tiles.some(tile => tile.value >= WIN_SCORE);
}

// Get the maximum tile value
export function getMaxTileValue(tiles: Tile[]): number {
    if (tiles.length === 0) return 0;
    return Math.max(...tiles.map(t => t.value));
}
