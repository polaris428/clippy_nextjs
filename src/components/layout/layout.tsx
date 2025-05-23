'use client';
import AppHeader from '@/components/Header/AppHeader';

type WelcomeLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: WelcomeLayoutProps) => {
    function setIsLinkModalOpen(arg0: boolean) {
        console.log(arg0)
    }
    return (
        <>
            <AppHeader
                onSaveClick={() => setIsLinkModalOpen(true)}
                userImageUrl="/img/avatar_me.png"
            />
            <main>{children}</main>

        </>
    );
};

export default AppLayout;