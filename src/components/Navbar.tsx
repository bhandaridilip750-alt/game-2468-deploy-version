'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import styles from './styles/Navbar.module.css';

interface NavbarProps {
  showNewGame?: boolean;
  onNewGame?: () => void;
}

export function Navbar({ showNewGame = false, onNewGame }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.titleLink}>
        <h1 className={styles.title}>2468</h1>
      </Link>
      <div className={styles.actions}>
        {showNewGame && onNewGame && (
          <button className={styles.newGameBtn} onClick={onNewGame}>
            New Game
          </button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
