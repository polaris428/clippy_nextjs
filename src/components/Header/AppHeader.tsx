'use client';

import { BookmarkSimple } from 'phosphor-react';
import { useState } from 'react';
import Image from 'next/image';
interface HeaderProps {
  onSaveClick: () => void;
  userImageUrl: string;
}

const Header = ({ onSaveClick, userImageUrl }: HeaderProps) => {
  const [imgSrc, setImgSrc] = useState(userImageUrl);
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
        <BookmarkSimple size={20} weight="fill" />
        Clippy
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSaveClick}
          className="bg-blue-100 text-sm text-blue-900 font-medium px-4 py-1.5 rounded-full hover:bg-blue-200 transition"
        >
          Save Link
        </button>
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
