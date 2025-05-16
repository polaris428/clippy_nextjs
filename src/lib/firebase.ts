import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-admin.json');



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

