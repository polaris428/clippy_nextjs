import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './client';
import logger from '../logger/logger';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    return result.user;
  } catch (err) {
    logger.error({ err }, '로그인 실패:');
    return null;
  }
};
