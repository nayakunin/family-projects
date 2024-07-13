import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { fullnessOptions } from '@/schema';

import { FormValues } from '../schema';

export const FullnessField = () => {
    const { control } = useFormContext<FormValues>();

    return (
        <FormField
            control={control}
            name="fullness"
            render={({ field }) => (
                <FormItem className="col-span-1">
                    <FormLabel>Fullness</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Fullness" />
                            </SelectTrigger>
                            <SelectContent>
                                {fullnessOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
