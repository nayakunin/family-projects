import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CreateIngredientForm, FormValues } from '@/module/ingredients/create-form';

type NewIngredientDialogProps = {
    open: boolean;
    defaultValues?: { name?: string };
    onClose: () => void;
    onSubmit: (values: FormValues) => void;
};

const FORM_ID = 'create-ingredient-form';

export const NewIngredientDialog = ({
    open,
    defaultValues,
    onClose,
    onSubmit,
}: NewIngredientDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new ingredient</DialogTitle>
                </DialogHeader>
                <CreateIngredientForm
                    id={FORM_ID}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                />
                <DialogFooter>
                    <Button type="submit" form={FORM_ID}>
                        Create
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
