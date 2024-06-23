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
import { groupRoles, permissions, User } from '@/schema';

import { saveGroup } from './actions';
import { GroupName } from './group-name';
import { UsersPicker } from './users-picker';
import { UsersTable } from './users-table';

const formValuesSchema = z.object({
    name: z.string().min(5).max(255),
    users: z.object({
        query: z.string(),
        selected: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                role: z.enum(groupRoles),
                permissions: z.enum(permissions).array(),
                image: z.string().nullable(),
                email: z.string(),
            }),
        ),
    }),
});

export type FormValues = z.infer<typeof formValuesSchema>;

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

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(saveGroup)}>
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
