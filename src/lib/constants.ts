// Game constants

// Grid sizes per difficulty
export const GRID_SIZES = {
    easy: 4,
    medium: 5,
    hard: 6,
} as const;

// Default grid size (easy mode)
export const GRID_SIZE = 4;

// Win condition
export const WIN_SCORE = 2048;

// Power-up lives per difficulty
export const POWER_UP_LIVES = {
    easy: 3,
    medium: 2,
    hard: 1,
} as const;

// Storage keys
export const STORAGE_KEYS = {
    GAME_STATE: '2468_game_state',
    BEST_SCORE: '2468_best_score',
    PLAYER_NAME: '2468_player_name',
} as const;

// Tile colors
export function getTileColor(value: number): { background: string; text: string } {
    const colors: Record<number, { background: string; text: string }> = {
        2: { background: '#eee4da', text: '#776e65' },
        4: { background: '#ede0c8', text: '#776e65' },
        8: { background: '#f2b179', text: '#f9f6f2' },
        16: { background: '#f59563', text: '#f9f6f2' },
        32: { background: '#f67c5f', text: '#f9f6f2' },
        64: { background: '#f65e3b', text: '#f9f6f2' },
        128: { background: '#edcf72', text: '#f9f6f2' },
        256: { background: '#edcc61', text: '#f9f6f2' },
        512: { background: '#edc850', text: '#f9f6f2' },
        1024: { background: '#edc53f', text: '#f9f6f2' },
        2048: { background: '#edc22e', text: '#f9f6f2' },
        4096: { background: '#3c3a32', text: '#f9f6f2' },
        8192: { background: '#3c3a32', text: '#f9f6f2' },
    };

    return colors[value] || { background: '#3c3a32', text: '#f9f6f2' };
}
