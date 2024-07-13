import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { FormValues } from '../page';

export const CaloriesField = () => {
    const { control } = useFormContext<FormValues>();

    return (
        <FormField
            control={control}
            name="calories"
            render={({ field }) => (
                <FormItem className="col-span-1">
                    <FormLabel>Calories</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Calories" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
