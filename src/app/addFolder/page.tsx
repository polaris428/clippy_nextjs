// SaveLinkPage.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useSaveLinkForm } from '@/hooks/link/useSaveLinkForm';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SaveLinkPage() {
    const folders = useAuthStore((s) => s.folders);
    const sharedFolders = useAuthStore((s) => s.sharedFolders);

    const {
        url,
        title,
        description,
        image,

        folderId,
        isLoading,
        isFetchingMeta,
        isMetadataFetched,
        setUrl,
        setTitle,
        setDescription,
        setFolderId,
        handleSubmit,
    } = useSaveLinkForm();

    return (
        <div className="max-w-4xl mx-auto py-14 px-8 space-y-8">
            <h1 className="text-3xl font-semibold">Add a new link</h1>

            {/* URL 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                    className="h-11 rounded-xl px-4"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                />
                {isFetchingMeta && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fetching metadata...
                    </div>
                )}
            </div>

            {/* 메타데이터 미리보기 */}
            {isMetadataFetched && (title || description || image) && (
                <div className="flex gap-6 border p-5 rounded-xl items-start bg-white">
                    <div className="flex-1 space-y-1">
                        <div className="text-xs text-muted-foreground mb-1">Preview from metadata</div>
                        <div className="font-semibold text-base break-words leading-tight">
                            {title}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                            {description}
                        </div>
                    </div>
                    {image && (
                        <img
                            src={image}
                            alt="preview"
                            className="w-48 h-32 object-cover rounded-xl border"
                        />
                    )}
                </div>
            )}

            {/* 제목 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                    className="h-11 rounded-xl px-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="크롤링된 제목 또는 수동 입력"
                />
            </div>

            {/* 설명 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                    className="rounded-xl px-4 py-3 overflow-auto max-h-40"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="크롤링된 설명 또는 수동 입력"
                />
            </div>

            {/* 폴더 선택 */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Select folder</label>
                <select
                    className="border rounded-xl p-3 w-full text-sm bg-white"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                >
                    <option value="">폴더를 선택하세요</option>
                    {folders.length > 0 && (
                        <optgroup label="내 폴더">
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </optgroup>
                    )}
                    {sharedFolders.length > 0 && (
                        <optgroup label="공유 폴더">
                            {sharedFolders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>



            {/* 저장/취소 버튼 */}
            <div className="flex justify-end gap-4 pt-6">
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() => history.back()}
                    className="rounded-full px-6 py-2 text-sm"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2 text-sm"
                    disabled={!isMetadataFetched || isLoading || !folderId}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </span>
                    ) : (
                        'Save'
                    )}
                </Button>
            </div>
        </div>
    );
}
