'use client';

import WelcomeLayout from '@/app/ko/WelcomeLayout';
import LoginButton from './LoginButton';
import Image from 'next/image';
import Onboarding from './components/Onboarding';

export default function Welcome() {
  return (
    <WelcomeLayout>
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        {/* 히어로 섹션 */}
        <section className="flex flex-col md:flex-row items-center justify-between mt-4 gap-12">
          {/* 왼쪽 텍스트 영역 */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              링크 저장을 넘어 <br />
              정리의 시작까지
            </h1>

            <p className="text-gray-600 text-xl md:text-2xl leading-relaxed">
              필요한 정보, 이제 흘려보내지 마세요. <br />
              언제든 저장하고, 분류하고, 다시 꺼내보세요.
            </p>

            <div className="mt-6">
              <LoginButton />
            </div>
          </div>

          {/* 오른쪽 이미지 영역 */}
          <div className="flex-1 relative w-full h-64 md:h-80">
            <Image
              src="/img/welcome_illustration.svg"
              alt="예시 이미지"
              fill
              priority
              className="object-contain"
            />
          </div>
        </section>
      </main>

      {/* 온보딩 가이드 섹션 */}
      <Onboarding />
    </WelcomeLayout>
  );
}
