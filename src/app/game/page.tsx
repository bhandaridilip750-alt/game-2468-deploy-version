'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useSwipe } from '@/hooks/useSwipe';
import { Navbar } from '@/components/Navbar';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameBoard } from '@/components/GameBoard';
import { GameOverlay } from '@/components/GameOverlay';
import { PowerUpBar } from '@/components/PowerUpBar';
import { ArrowHints } from '@/components/ArrowHints';
import { Difficulty } from '@/types/game';
import styles from './page.module.css';

function GameContent() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level') as Difficulty | null;

  const {
    tiles,
    score,
    bestScore,
    gameState,
    playerName,
    isLoading,
    powerUps,
    difficulty,
    gridSize,
    executeMove,
    undo,
    newGame,
    continueGame,
    setPlayerName,
    setDifficulty,
    activatePowerUp,
    handleTileClick,
    cancelPowerUp,
  } = useGame();

  // Set difficulty from URL on mount
  useEffect(() => {
    if (levelParam && ['easy', 'medium', 'hard'].includes(levelParam)) {
      if (levelParam !== difficulty) {
        setDifficulty(levelParam);
      }
    }
  }, [levelParam, difficulty, setDifficulty]);

  // Keyboard controls
  useKeyboard({
    onMove: executeMove,
    enabled: gameState === 'playing' && !isLoading && powerUps.activeMode === 'none',
  });

  // Touch/swipe controls
  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipe: executeMove,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Navbar showNewGame onNewGame={newGame} />
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!playerName) {
    return (
      <div className={styles.page}>
        <Navbar showNewGame={false} />
        <div className={styles.namePrompt}>
          <h2>Enter Your Name</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
            if (input.value.trim()) {
              setPlayerName(input.value.trim());
            }
          }}>
            <input 
              name="name" 
              type="text" 
              placeholder="Your name" 
              autoFocus 
              maxLength={20}
              className={styles.nameInput}
            />
            <button type="submit" className={styles.startButton}>Start Game</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar showNewGame onNewGame={newGame} />
      
      <main className={styles.main}>
        <ScoreBoard
          score={score}
          bestScore={bestScore}
          playerName={playerName}
          difficulty={difficulty}
        />

        <div className={styles.gameArea}>
          <GameBoard
            tiles={tiles}
            gridSize={gridSize}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            activeMode={powerUps.activeMode}
            selectedTileId={powerUps.selectedTileId}
            onTileClick={handleTileClick}
          />
          
          <GameOverlay
            gameState={gameState}
            score={score}
            onNewGame={newGame}
            onContinue={continueGame}
          />
        </div>

        <PowerUpBar
          powerUps={powerUps}
          onActivate={activatePowerUp}
          onUndo={undo}
          onCancel={cancelPowerUp}
          gameState={gameState}
        />

        <ArrowHints />
      </main>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
