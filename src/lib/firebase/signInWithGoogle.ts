// src/lib/firebase/signInWithGoogle.ts
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './client';

export const signInWithGoogle = async ()=> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
  
    return result.user;
  } catch (err) {
    console.error('로그인 실패:', err);
    return null;
  }
};
