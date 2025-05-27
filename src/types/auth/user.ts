export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  profileImage: string | null;
  createdAt: Date;
}
