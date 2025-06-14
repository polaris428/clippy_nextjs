import { injectable, inject } from 'tsyringe';
import { User } from '@/types/auth/user';
import 'reflect-metadata';
import '@/infrastructure/di/container';
import { extractNameFromEmail } from '@/lib/utils/extractNameFromEmail';

import type { IUserRepository } from '@/domain/repositories/user/IUserRepository';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import { DecodedIdToken } from 'firebase-admin/auth';
@injectable()
export class LoginUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository,
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute(decoded: DecodedIdToken): Promise<User> {
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
