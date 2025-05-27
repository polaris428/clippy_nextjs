'use client';
import StartGuideCard from './StartGuideCard';

import { useEffect, useRef, useState } from 'react';

const guides = [
    {
        title: '폴더 만들기',
        description: '링크를 폴더로 분류하세요.',
        imageSrc: '/img/folder.png',
    },
    {
        title: '링크 저장',
        description: '브라우저에서 한 번에 링크 저장.',
        imageSrc: '/img/save.png',
    },
    {
        title: '태그 관리 (개발 중)',
        description: '태그로 검색과 분류를 손쉽게.',
        imageSrc: '/img/tags.png',
    },
    {
        title: '팀원 초대',
        description: '링크를 함께 관리하세요.',
        imageSrc: '/img/invite.png',
    },
    {
        title: '언제 어디서나',
        description: '기기 관계없이 접근 가능.',
        imageSrc: '/img/globe.png',
    },
];


export default function StartGuideSection() {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="max-w-5xl mx-auto py-12 px-4"
        >
            <h2 className="text-2xl font-bold text-center mb-10">Clippy 소개</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((item, idx) => (
                    <StartGuideCard key={item.title} {...item} visible={visible} delay={idx * 100} />
                ))}
            </div>
        </section>
    );
}
