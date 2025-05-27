import { User } from '../../types/auth/user';

export interface IUserRepository {
  /*
   * Firebase UID로 유저 조회
   */
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  /*
   * 유저 생성
   */
  create(data: { firebaseUid: string; email: string; name: string; profileImage: string | null }): Promise<User>;
}
