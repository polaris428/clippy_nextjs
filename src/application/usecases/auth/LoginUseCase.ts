import { injectable, inject } from 'tsyringe';
import { User } from '@/types/auth/user';
import 'reflect-metadata';
import '@/infrastructure/di/container';

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

  async execute(decoded: DecodedIdToken): Promise<User | null> {
    const firebaseUid = decoded.uid;

    const existingUser = await this.userRepository.findByFirebaseUid(firebaseUid);
    return existingUser;
  }
}
