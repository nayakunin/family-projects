import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import { FormValues } from '../page';

export const ContentField = () => {
    const { control } = useFormContext<FormValues>();

    return (
        <FormField
            control={control}
            name="content"
            render={({ field }) => (
                <FormItem className="col-span-4 h-full">
                    <FormLabel>Recipe</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Recipe" className="min-h-80" {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    );
};
