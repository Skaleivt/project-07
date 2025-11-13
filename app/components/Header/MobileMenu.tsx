'use client';

import { FiX } from 'react-icons/fi';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  onClose: () => void;
  isAuthenticated: boolean;
}

export const MobileMenu = ({ onClose, isAuthenticated }: MobileMenuProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.logo}>🌿 Подорожники</div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        <nav className={styles.nav}>
          <a href="#" onClick={onClose}>
            Головна
          </a>
          <a href="#" onClick={onClose}>
            Історії
          </a>
          <a href="#" onClick={onClose}>
            Мандрівники
          </a>

          {isAuthenticated && (
            <>
              <a href="#" onClick={onClose}>
                Мій Профіль
              </a>
              <button className={styles.publishBtn} onClick={onClose}>
                Опублікувати історію
              </button>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {!isAuthenticated ? (
            <>
              <button className={styles.loginBtn} onClick={onClose}>
                Вхід
              </button>
              <button className={styles.registerBtn} onClick={onClose}>
                Реєстрація
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
