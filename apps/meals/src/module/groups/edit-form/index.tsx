'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRequest } from 'ahooks';
import { useForm } from 'react-hook-form';
import invariant from 'tiny-invariant';
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
import { Skeleton } from '@/components/ui/skeleton';

import { FormValues, formValuesSchema } from '../shared/schema';
import { UsersPicker } from '../shared/users-picker';
import { getGroup, saveGroup } from './actions';
import { GroupName } from './group-name';
import { UsersTable } from './users-table';

type EditGroupFormProps = {
    groupId?: string;
    onSubmit: () => void;
};

export default function EditGroupForm({ groupId, onSubmit }: EditGroupFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValuesSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            users: {
                query: '',
                selected: [],
            },
        },
    });

    const groupReq = useRequest(
        async () => {
            if (!groupId) throw new Error('Group ID is required');

            return await getGroup(groupId);
        },
        {
            refreshDeps: [groupId],
            ready: !!groupId,
            onSuccess: (group) => {
                form.setValue('name', group.name);
                form.setValue('users', {
                    query: '',
                    selected: group.members.map((member) => ({
                        id: member.id,
                        name: member.name,
                        role: member.role,
                        permissions: member.permissions,
                        image: member.image,
                        email: member.email,
                    })),
                });
            },
        },
    );

    const handleSubmit = async (values: FormValues) => {
        invariant(groupReq.data, 'Group not found');
        await saveGroup(
            {
                name: values.name,
                users: values.users.selected.map((user) => ({
                    id: user.id,
                    role: user.role,
                    permissions: user.permissions,
                })),
            },
            groupReq.data,
        );
        onSubmit();
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
                                {groupReq.loading ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : (
                                    <GroupName
                                        form={form}
                                        field={field}
                                        defaultValue={groupReq.data?.name}
                                    />
                                )}
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
                                {groupReq.loading ? (
                                    <Skeleton className="h-40 w-full" />
                                ) : (
                                    <>
                                        <UsersPicker {...field} />
                                        <UsersTable
                                            currentUserRole="owner"
                                            users={field.value.selected}
                                            onChange={(selected) =>
                                                field.onChange({ ...field.value, selected })
                                            }
                                        />
                                    </>
                                )}
                            </FormControl>
                            <FormMessage>{form.formState.errors.users?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <Button type="submit">Save</Button>
            </form>
        </Form>
    );
}
