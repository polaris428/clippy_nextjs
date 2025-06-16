import { inject, injectable } from 'tsyringe';

import type { IUserRepository } from '@/domain/repositories/user/IUserRepository';
import { DecodedIdToken } from 'firebase-admin/auth';
import { extractNameFromEmail } from '@/lib/utils/extractNameFromEmail';
import { User } from '@/types/auth/user';

@injectable()
export class PostCreateUser {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(decoded: DecodedIdToken): Promise<User> {
    const firebaseUid = decoded.uid;
    const email = decoded.email ?? '';
    const name = email ? extractNameFromEmail(email) : 'anonymous';
    const profileImage = decoded.picture ?? null;
    const newUser = await this.userRepository.create({
      firebaseUid,
      email,
      name,
      profileImage,
    });

    return newUser;
  }
}
