import { DefaultValues, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export type FormValues = {
    name: string;
    color?: string;
};

type CreateIngredientFormProps = {
    id: string;
    defaultValues?: DefaultValues<FormValues>;
    onSubmit: (values: FormValues) => void;
};

export const CreateIngredientForm = ({
    id,
    defaultValues = {
        name: '',
    },
    onSubmit,
}: CreateIngredientFormProps) => {
    const form = useForm<FormValues>({
        defaultValues,
    });

    return (
        <Form {...form}>
            <form id={id} className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
