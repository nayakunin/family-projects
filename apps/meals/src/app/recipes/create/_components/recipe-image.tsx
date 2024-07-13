import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { RecipeImage, RecipeImageFallback, RecipeImagePreview } from '@/module/recipes/image';

import { FormValues } from '../schema';

export const RecipeImageField = () => {
    const { control } = useFormContext<FormValues>();

    return (
        <FormField
            control={control}
            name="image"
            render={({ field }) => (
                <FormItem className="col-span-2">
                    <FormControl>
                        <RecipeImage image={field.value} onAddImage={console.log}>
                            <RecipeImageFallback />
                            <RecipeImagePreview />
                        </RecipeImage>
                    </FormControl>
                </FormItem>
            )}
        />
    );
};
