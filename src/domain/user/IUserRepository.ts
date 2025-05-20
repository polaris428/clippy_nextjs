import { User } from './User';

export interface IUserRepository {
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  create(data: {
    firebaseUid: string;
    email: string;
    name: string;
  }): Promise<User>;
  findOrCreate(data: {
    firebaseUid: string;
    email: string;
    name: string;
  }): Promise<User>;
}
