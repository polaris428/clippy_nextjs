import { injectable, inject } from 'tsyringe';
import { verifyIdToken } from '@/lib/firebase';
import { User } from '@/domain/user/User';
import 'reflect-metadata';
import '@/infrastructure/di/container';
import type { IUserRepository } from '@/domain/user/IUserRepository';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';

@injectable()
export class LoginWithFirebase { constructor(@inject('IUserRepository') private userRepository: IUserRepository, @inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute(token: string): Promise<User> {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const existingUser = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (existingUser) return existingUser;

    const newUser = await this.userRepository.create({
      firebaseUid,
      email: decoded.email ?? '',
      name: decoded.name ?? 'anonymous',
    });

    await this.folderRepository.createFolder(newUser.id, '기본 폴더');
    return newUser;
  }
}
