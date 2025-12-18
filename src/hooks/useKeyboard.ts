'use client';

import { useEffect, useCallback } from 'react';
import { Direction } from '@/types/game';

interface UseKeyboardProps {
    onMove: (direction: Direction) => void;
    enabled?: boolean;
}

export function useKeyboard({ onMove, enabled = true }: UseKeyboardProps): void {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Prevent default scrolling behavior for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                onMove('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                onMove('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                onMove('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                onMove('right');
                break;
        }
    }, [onMove, enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
