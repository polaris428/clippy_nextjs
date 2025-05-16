export type LoginRequestBody = {
  name?: string; // 옵셔널 처리
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    firebaseUid: string;
  };
};