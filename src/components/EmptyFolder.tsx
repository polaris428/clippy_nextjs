'use client';

import Image from 'next/image';

export default function EmptyFolder() {
  return (
    <div className="flex flex-col items-center justify-center text-gray-500 py-16">
      <Image
        src="/img/empty-folder.svg"
        alt="Empty folder illustration"
        width={300}
        height={300}
        className="mb-6"
      />
      <p className="text-lg font-medium">이 폴더에는 아직 링크가 없습니다.</p>
    </div>
  );
}
