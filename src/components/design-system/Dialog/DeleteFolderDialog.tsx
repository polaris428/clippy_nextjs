'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteFolderDialog({ open, onClose, onConfirm }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">이 작업은 되돌릴 수 없습니다.</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>취소</Button>
                    <Button variant="destructive" onClick={onConfirm}>삭제</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
