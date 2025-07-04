'use client';

import { BookmarkSimple } from 'phosphor-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  userImageUrl: string;
}

const Header = ({ userImageUrl }: HeaderProps) => {
  const [imgSrc, setImgSrc] = useState(userImageUrl);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white shrink-0">
      {/* 로고/타이틀 클릭 → /ko */}
      <Link
        href="/ko"
        className="flex items-center gap-2 font-semibold text-gray-800 text-lg"
      >
        <BookmarkSimple size={20} weight="fill" />
        Clippy
      </Link>

      <div className="flex items-center gap-3">
        <Image
          src={imgSrc}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full"
          onError={() => setImgSrc('/img/ic_logo.png')}
        />
      </div>
    </header>
  );
};

export default Header;
