'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RouterRedirector({ to }: { to: string }) {
    const router = useRouter();

    useEffect(() => {
        router.push(to);
    }, [to]);

    return null;
}
