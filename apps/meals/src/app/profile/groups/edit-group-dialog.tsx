'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditGroupForm from '@/module/groups/edit-form';

type EditGroupDialogProps = {
    groupId?: string;
    onClose: () => void;
    onSubmit: () => void;
};

export const EditGroupDialog = ({ groupId, onClose, onSubmit }: EditGroupDialogProps) => (
    <Dialog
        open={!!groupId}
        onOpenChange={(val) => {
            if (!val) onClose();
        }}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Group</DialogTitle>
            </DialogHeader>
            <EditGroupForm
                groupId={groupId}
                onSubmit={() => {
                    onSubmit();
                    onClose();
                }}
            />
        </DialogContent>
    </Dialog>
);
