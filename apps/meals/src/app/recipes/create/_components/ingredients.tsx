import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useDialog } from '@/hooks/useDialog';

import { FormValues } from '../schema';
import { IngredientsPicker } from './ingredients-picker';
import { NewIngredientDialog } from './new-ingredient-dialog';

export const IngredientsField = () => {
    const form = useFormContext<FormValues>();
    const { control } = useFormContext<FormValues>();
    const newIngredientDialog = useDialog<string>();

    return (
        <>
            <FormField
                control={control}
                name="ingredients"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Ingredients</FormLabel>
                        <FormControl>
                            <IngredientsPicker
                                field={field}
                                onCreateNew={newIngredientDialog.open}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <NewIngredientDialog
                defaultValues={{ name: newIngredientDialog.state }}
                onClose={newIngredientDialog.close}
                open={newIngredientDialog.isOpen}
                onSubmit={(values) => {
                    form.setValue('ingredients.selected', [
                        ...form.getValues('ingredients.selected'),
                        values,
                    ]);
                }}
            />
        </>
    );
};
