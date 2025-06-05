import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-admin.json');

export function createAccessToken(userId: string): string {
  return jwt.sign(
    { userId }, // payload
    process.env.ACCESS_TOKEN_SECRET!, // 비밀키 (환경변수에 저장)
    {
      expiresIn: '15m', // access_token 유효기간
    }
  );
}

try {
  const raw = fs.readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(raw);

  if (!admin.apps.length && serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (err) {
  console.error('🔥 Failed to load firebase-admin.json:', err);
}
export const verifyIdToken = (token: string) => {
  return admin.auth().verifyIdToken(token);
};
