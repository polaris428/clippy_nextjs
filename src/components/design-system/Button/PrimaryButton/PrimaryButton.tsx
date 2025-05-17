'use client'; import React from 'react';
import styles from './PrimaryButton.module.css';

interface ButtonProps {
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const CDSButton = ({
  buttonText,
  onClick = () => { },
  disabled = false,
  fullWidth = true,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.text}>{buttonText}</span>
      {children}
    </button>
  );
};

export default CDSButton;
