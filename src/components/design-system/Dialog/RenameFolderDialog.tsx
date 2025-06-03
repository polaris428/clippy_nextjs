'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface Props {
    folderId: string;
    initialName: string;
    open: boolean;
    onClose: () => void;
    onConfirm: (newName: string) => void;
}

export default function RenameFolderDialog({
    folderId,
    initialName,
    open,
    onClose,
    onConfirm,
}: Props) {
    const [name, setName] = useState(initialName);


    useEffect(() => {
        if (open) setName(initialName);
    }, [initialName, open]);
    console.log(folderId)
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>폴더 이름 변경</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">새 이름</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="폴더 이름을 입력하세요"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        취소
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm(name.trim());
                        }}
                        disabled={!name.trim()}
                    >
                        저장
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
