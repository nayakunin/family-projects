'use client';

import { useRequest } from 'ahooks';
import { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { User } from '@/schema';

import { getGroups, Group } from './actions';
import { EditGroupDialog } from './edit-group-dialog';

type GroupsTableProps = {
    user: User;
    groups: Group[];
};

export const GroupsTable = ({ user, groups }: GroupsTableProps) => {
    const [selectedGroup, setSelectedGroup] = useState<string>();
    const { data = groups, refresh } = useRequest(() => getGroups(user), {
        manual: true,
    });

    return (
        <>
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-end">Members</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((group) => (
                        <TableRow
                            key={group.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedGroup(group.id)}
                        >
                            <TableCell>{group.name}</TableCell>
                            <TableCell>{group.role}</TableCell>
                            <TableCell className="text-end">{group.userCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditGroupDialog
                groupId={selectedGroup}
                onClose={() => setSelectedGroup(undefined)}
                onSubmit={() => refresh()}
            />
        </>
    );
};
