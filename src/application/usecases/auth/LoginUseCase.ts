import { injectable, inject } from 'tsyringe';
import { verifyIdToken } from '@/lib/firebase';
import { User } from '@/domain/user/User';
import 'reflect-metadata';
import '@/infrastructure/di/container';
import { extractNameFromEmail } from '@/lib/utils/extractNameFromEmail';

import type { IUserRepository } from '@/domain/user/IUserRepository';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';

@injectable()
export class LoginUseCase {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository, @inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute(token: string): Promise<User> {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const existingUser = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (existingUser) return existingUser;

    const email = decoded.email ?? '';
    const name = email ? extractNameFromEmail(email) : 'anonymous';
    const profileImage = decoded.picture ?? null;

    const newUser = await this.userRepository.create({
      firebaseUid,
      email,
      name,
      profileImage,
    });

    await this.folderRepository.createFolder(newUser.id, name + ' 개인 폴더');
    return newUser;
  }
}
