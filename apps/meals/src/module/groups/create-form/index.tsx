'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { User } from '@/schema';

import { FormValues, formValuesSchema } from '../shared/schema';
import { UsersPicker } from '../shared/users-picker';
import { saveGroup } from './actions';
import { GroupName } from './group-name';
import { UsersTable } from './users-table';

export default function CreateGroupForm({ user }: { user: User }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValuesSchema),
        defaultValues: {
            name: '',
            users: {
                query: '',
                selected: [
                    {
                        id: user.id,
                        name: user.name,
                        role: 'owner',
                        image: user.image,
                        email: user.email,
                        permissions: ['read', 'write', 'delete'],
                    },
                ],
            },
        },
    });

    const handleSubmit = async (values: FormValues) => {
        await saveGroup({
            name: values.name,
            users: values.users.selected.map((user) => ({
                id: user.id,
                role: user.role,
                permissions: user.permissions,
            })),
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <GroupName form={form} field={field} />
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
                            <FormLabel>Members</FormLabel>
                            <FormControl className="space-y-2">
                                <>
                                    <UsersPicker {...field} />
                                    <UsersTable
                                        users={field.value.selected}
                                        onChange={(selected) =>
                                            field.onChange({ ...field.value, selected })
                                        }
                                    />
                                </>
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
