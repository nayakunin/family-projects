'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRequest } from 'ahooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Autocomplete } from '@/components/hoc/autocomplete';
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

import { findUsers, saveGroup, validateGroupName } from './actions';

const formValuesSchema = z.object({
    name: z.string().min(5).max(255),
    users: z.array(z.string()),
});

type FormValues = z.infer<typeof formValuesSchema>;

export default function FormComponent() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValuesSchema),
        defaultValues: {
            name: '',
            users: [],
        },
    });

    const [name] = form.watch(['name']);

    useRequest(() => validateGroupName(name), {
        refreshDeps: [name],
        ready: name !== '',
        onSuccess: (valid) => {
            if (!valid) {
                form.setError('name', { message: 'Name is already taken' });
            }
        },
    });

    const handleSubmit = async (values: FormValues) => {
        await saveGroup(values.name, values.users);
    };

    return (
        <Form {...form}>
            <form className="max-w-80 space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Name" />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Users</FormLabel>
                            <FormControl>
                                <Autocomplete
                                    {...field}
                                    placeholder="Search users"
                                    queryFn={async (query) => {
                                        if (query === '') return [];

                                        const result = await findUsers(query);

                                        return result.map((user) => ({
                                            value: user.id,
                                            label: user.name,
                                        }));
                                    }}
                                    throttle={500}
                                />
                            </FormControl>
                            <FormMessage>{form.formState.errors.users?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    );
}
