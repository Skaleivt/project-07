'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiMenu } from 'react-icons/fi';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import Link from 'next/link';
interface HeaderProps {
  isAuthenticated: boolean; // стан авторизації
}

export const Header = ({ isAuthenticated }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          🌿 Подорожники
        </Link>

        {/* Десктопна навігація */}
        <nav className={styles.navDesktop}>
          <a href="#">Головна</a>
          <a href="#">Історії</a>
          <a href="#">Мандрівники</a>

          {isAuthenticated && (
            <>
              <a href="#">Мій Профіль</a>
              <button className={styles.publishBtn}>
                Опублікувати історію
              </button>
            </>
          )}

          <div className={styles.authButtons}>
            {!isAuthenticated ? (
              <>
                <button className={styles.loginBtn}>Вхід</button>
                <button className={styles.registerBtn}>Реєстрація</button>
              </>
            ) : null}
          </div>
        </nav>

        {/* Кнопка мобільного меню */}
        <button className={styles.menuToggle} onClick={handleToggleMenu}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Мобільне меню через портал */}
      {isMenuOpen &&
        createPortal(
          <MobileMenu
            onClose={handleCloseMenu}
            isAuthenticated={isAuthenticated}
          />,
          document.body,
        )}
    </header>
  );
};
