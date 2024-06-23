import { produce } from 'immer';
import { BadgeX, Ellipsis, Lock, Shield } from 'lucide-react';
import invariant from 'tiny-invariant';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { permissions } from '@/schema';

import { FormValues } from '../shared/schema';

type User = FormValues['users']['selected'][number];

type UsersTableProps = {
    users: User[];
    currentUserRole: User['role'];
    onChange: (users: User[]) => void;
};

export const UsersTable = ({ onChange, users, currentUserRole }: UsersTableProps) => {
    const handlePermissionsChange = (id: User['id'], permission: User['permissions'][number]) => {
        onChange(
            produce(users, (draft) => {
                const user = draft.find((u) => u.id === id);
                invariant(user, 'User not found');
                const index = user.permissions.indexOf(permission);
                if (index === -1) {
                    user.permissions.push(permission);
                } else {
                    user.permissions.splice(index, 1);
                }
            }),
        );
    };

    const handleRemoveUser = (id: User['id']) => {
        onChange(users.filter((user) => user.id !== id));
    };

    const handleTransferOwnership = (newOnwerId: User['id']) => {
        onChange(
            produce(users, (draft) => {
                const oldOwner = draft.find((u) => u.role === 'owner');
                invariant(oldOwner, 'Owner not found');
                oldOwner.role = 'member';

                const newOwner = draft.find((u) => u.id === newOnwerId);
                invariant(newOwner, 'User not found');
                newOwner.role = 'owner';
            }),
        );
    };

    return (
        <Table className="mt-1">
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    <AvatarImage src={user.image || ''} />
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center text-sm font-bold">
                                        {user.name}
                                        {user.role === 'owner' && (
                                            <Badge variant="outline" className="ml-2">
                                                Owner
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-sm font-light">{user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="outline" className="rounded-full px-2">
                                        <Ellipsis />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Permissions
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {permissions.map((p) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={p}
                                                        className="cursor-pointer"
                                                        checked={user.permissions.includes(p)}
                                                        onClick={(e) => {
                                                            handlePermissionsChange(user.id, p);
                                                            e.preventDefault();
                                                        }}
                                                    >
                                                        {p}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem
                                        disabled={
                                            user.role === 'owner' && currentUserRole === 'owner'
                                        }
                                        onClick={() => handleTransferOwnership(user.id)}
                                    >
                                        <Shield className="mr-2 h-4 w-4" />
                                        Transfer ownership
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        disabled={user.role === 'owner'}
                                        onClick={() => handleRemoveUser(user.id)}
                                    >
                                        <BadgeX className="mr-2 h-4 w-4" />
                                        Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
