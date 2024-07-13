import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { FormValues } from '../schema';

export const TitleField = () => {
    const { control } = useFormContext<FormValues>();

    return (
        <FormField
            control={control}
            name="title"
            render={({ field }) => (
                <FormItem className="col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
