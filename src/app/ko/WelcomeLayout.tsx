import WelcomeHeader from '@/components/Header/WelcomeHeader';
import WelcomeFooter from '@/components/Footer/WelcomeFooter';

type WelcomeLayoutProps = {
  children: React.ReactNode;
};

const WelcomeLayout = ({ children }: WelcomeLayoutProps) => {
  return (
    <>
      <WelcomeHeader />
      <main>{children}</main>
      <WelcomeFooter />
    </>
  );
};

export default WelcomeLayout;