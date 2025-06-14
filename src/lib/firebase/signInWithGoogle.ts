// src/lib/firebase/signInWithGoogle.ts
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './client';
import logger from '../logger/logger';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    return result.user;
  } catch (err) {
    logger.error('로그인 실패:', err);
    return null;
  }
};
