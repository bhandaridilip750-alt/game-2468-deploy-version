'use client';

import { useRef, useCallback } from 'react';
import { Direction } from '@/types/game';

interface UseSwipeProps {
    onSwipe: (direction: Direction) => void;
    threshold?: number;
}

interface UseSwipeReturn {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export function useSwipe({ onSwipe, threshold = 50 }: UseSwipeProps): UseSwipeReturn {
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
    }, []);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Check if swipe exceeds threshold
        if (Math.max(absDeltaX, absDeltaY) < threshold) {
            touchStartRef.current = null;
            return;
        }

        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            onSwipe(deltaX > 0 ? 'right' : 'left');
        } else {
            // Vertical swipe
            onSwipe(deltaY > 0 ? 'down' : 'up');
        }

        touchStartRef.current = null;
    }, [onSwipe, threshold]);

    return { onTouchStart, onTouchEnd };
}
