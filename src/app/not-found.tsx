'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const bounds = ref.current?.getBoundingClientRect();
            if (!bounds) return;

            setMouse({
                x: e.clientX - bounds.left - bounds.width / 2,
                y: e.clientY - bounds.top - bounds.height / 2,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <motion.div
                ref={ref}
                className="relative w-[500px] h-[500px] mb-8"
                animate={{
                    x: mouse.x * 0.03,
                    y: mouse.y * 0.03,
                    scale: 1.03,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 14,
                }}
            >
                <Image
                    src="/img/404_error.svg"
                    alt="404 일러스트"
                    fill
                    className="object-contain"
                    priority
                />
            </motion.div>

            <a href="https://storyset.com/web">Web illustrations by Storyset</a>
            <h1 className="text-3xl font-bold mb-2">404 - 페이지를 찾을 수 없습니다</h1>
            <p className="text-gray-500 mb-6">
                요청하신 페이지가 존재하지 않거나 삭제되었어요.
            </p>
            <Link href="/" className="text-blue-500 underline text-sm">
                홈으로 돌아가기
            </Link>
        </div>
    );
}
