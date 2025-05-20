import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';
import { User } from '@/domain/user/User';
import { IUserRepository } from '@/domain/user/IUserRepository';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  /**
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
      createdAt: user.createdAt,
    };
  }

  /**
   * 유저 생성
   */
  async create(data: {
    firebaseUid: string;
    email: string;
    name: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  /**
   * 유저 정보가 없으면 생성, 있으면 그대로 반환
   * (로그인용 upsert 대체 가능)
   */
  async findOrCreate(data: {
    firebaseUid: string;
    email: string;
    name: string;
  }): Promise<User> {
    const existingUser = await this.findByFirebaseUid(data.firebaseUid);
    if (existingUser) return existingUser;

    return await this.create(data);
  }
}
