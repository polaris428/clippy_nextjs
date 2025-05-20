import { verifyIdToken } from '@/lib/firebase';
import { getOrCreateUser } from '@/lib/services/userService';
import { getUserFoldersOrCreateDefault } from '@/lib/services/folderService';

export async function handleLoginRequest(token: string) {
  try {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const name = decoded.name || decoded.displayName || 'Unnamed';
    const email = decoded.email || '';

    const user = await getOrCreateUser(firebaseUid, email, name);
    const folders = await getUserFoldersOrCreateDefault(
      user.id,
      user.name || '기본'
    );

    return { user, folders };
  } catch (err) {
    console.error('❌ handleLoginRequest 실패:', err);
    throw new Error('Invalid token or failed to process login.');
  }
}
