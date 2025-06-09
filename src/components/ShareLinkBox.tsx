import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareLinkBoxProps {
  title: string;
  description?: string;
  url: string;
}

export function ShareLinkBox({ title, description, url }: ShareLinkBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err)
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold leading-none">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-white">
        <p className="text-sm text-blue-600 underline truncate max-w-[calc(100%-80px)]">{url}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 h-8"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              복사
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
