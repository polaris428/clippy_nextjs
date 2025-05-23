import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';
import { User } from '@/domain/user/User';
import { IUserRepository } from '@/domain/user/IUserRepository';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  /*
   * Firebase UID로 유저 조회
   */
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) return null;

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };
  }

  /*
   * 유저 생성
   */
  async create(data: { firebaseUid: string; email: string; name: string; profileImage: string | null }): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      profileImage: user.profileImage,
    };
  }
}
