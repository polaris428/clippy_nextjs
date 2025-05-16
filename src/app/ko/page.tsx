import WelcomeLayout from '@/app/ko/WelcomeLayout';
import styles from './Welcome.module.css';

import LoginButton from './LoginButton';
import Image from 'next/image';

const Welcome = () => {
  return (
    <WelcomeLayout>
      <main className={styles.main}>
        <section className={styles.left}>
          <h1 className={styles.HomepageHero_Heading}>
            링크 저장을 넘어 <br />
            정리의 시작까지
          </h1>
          <p className={styles.HomepageHero_Subheading}>
            필요한 정보, 이제 흘려보내지 마세요. <br />
            언제든 저장하고, 분류하고, 다시 꺼내보세요.
          </p>
          {/* <CDSButton buttonText="무료로 사용하기" onClick={handleLogin} /> */}
          <LoginButton></LoginButton>
        </section>

        <section className={styles.right}>
          <div className="relative w-full h-full">
            <Image
              src="/img/welcome_illustration.svg"
              alt="예시 이미지"
              fill
              className="object-contain"
            />
          </div>
        </section>
      </main>
    </WelcomeLayout>
  );
};

export default Welcome;