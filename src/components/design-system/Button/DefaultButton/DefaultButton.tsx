'use client';

import React from 'react';
import Link from 'next/link';
import styles from './DefaultButton.module.css';

interface CDSButtonProps {
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  as?: 'div' | 'link';
  href?: string;
}

const CDSButton = ({
  buttonText,
  onClick = () => { },
  disabled = false,
  fullWidth = true,
  children,
  as = 'div',
  href,
}: CDSButtonProps) => {
  const className = `${styles.button} ${fullWidth ? styles.fullWidth : ''} ${disabled ? styles.disabled : ''}`;

  if (as === 'link' && href) {
    return (
      <Link href={href} className={className} aria-disabled={disabled}>
        <span className={styles.text}>{buttonText}</span>
        {children}
      </Link>
    );
  }

  // ⛳ div 모드 (기본)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={className}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
    >
      <span className={styles.text}>{buttonText}</span>
      {children}
    </div>
  );
};

export default CDSButton;
