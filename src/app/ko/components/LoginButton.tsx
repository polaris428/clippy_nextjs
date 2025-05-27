'use client';

import { PrimaryButton } from "@/components/design-system";
import { useLogin } from '@/hooks/user/useLogin';

export default function LoginButton() {
  const { login, loading } = useLogin();

  return (
    <PrimaryButton
      buttonText="무료로 사용하기"
      onClick={login}
      disabled={loading}
    />
  );
}
