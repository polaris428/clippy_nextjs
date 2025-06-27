import * as admin from 'firebase-admin';
import logger from './logger/logger';

try {
  const credentialJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!credentialJson) throw new Error('FIREBASE_ADMIN_CREDENTIAL is not defined');

  const serviceAccount = JSON.parse(credentialJson as string);
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (err) {
  logger.error({ err }, '🔥 Failed to initialize firebase-admin with env credential:');
}

export const verifyIdToken = (token: string) => {
  return admin.auth().verifyIdToken(token);
};
