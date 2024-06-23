import { useRequest } from 'ahooks';
import { produce } from 'immer';

import { Autocomplete } from '@/components/hoc/autocomplete2';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { FormValues } from '.';
import { findUsers } from './actions';

type Users = FormValues['users'];

type UsersPickerProps = {
    value: Users;
    onChange: (user: Users) => void;
};

type UserOptionProps = {
    user: Pick<Users['selected'][number], 'name' | 'image' | 'email'>;
};

const UserOption = ({ user }: UserOptionProps) => (
    <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
            <AvatarFallback>{user.name[0]}</AvatarFallback>
            <AvatarImage src={user.image || ''} />
        </Avatar>
        <div className="flex flex-col items-start">
            <div className="flex items-center text-sm font-bold">{user.name}</div>
            <div className="text-sm font-light">{user.email}</div>
        </div>
    </div>
);

export const UsersPicker = ({ value, onChange }: UsersPickerProps) => {
    const userOptionsReq = useRequest(
        async () => {
            const result = await findUsers(
                value.query,
                value.selected.map((user) => user.id),
            );

            return result.map((user) => ({
                image: user.image,
                email: user.email,
                label: user.name,
                value: user.id,
                disabled: value.selected.some((selected) => selected.id === user.id),
            }));
        },
        {
            refreshDeps: [value.query],
        },
    );

    const handleQueryChange = (query: string) => {
        onChange(
            produce(value, (draft) => {
                draft.query = query;
            }),
        );
    };

    const handleUserClick = (id: string) => {
        onChange(
            produce(value, (draft) => {
                const user = userOptionsReq.data?.find((user) => user.value === id);
                if (!user) return;

                draft.selected.push({
                    id,
                    name: user.label,
                    image: user.image,
                    email: user.email,
                    role: 'member',
                    permissions: ['read'],
                });
            }),
        );
    };

    return (
        <Autocomplete
            placeholder="Search users by email"
            value={value.query}
            options={userOptionsReq.data}
            loading={userOptionsReq.loading}
            renderOption={(option) => (
                <UserOption
                    user={{
                        email: option.email,
                        image: option.image,
                        name: option.label,
                    }}
                />
            )}
            onChange={handleQueryChange}
            onClick={handleUserClick}
        />
    );
};
