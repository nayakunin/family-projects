import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import CreateGroupForm from '@/module/groups/create-form';
import { getCurrentUser } from '@/server/actions';

import { getGroups } from './actions';

export default async function Page() {
    const user = await getCurrentUser();
    const groups = await getGroups(user);

    if (groups.length === 0) {
        return (
            <div>
                <p>
                    You don't belong to any groups. Create a group or get invited to one to start
                    sharing meals.{' '}
                    <Dialog>
                        <DialogTrigger className="underline">Create Group</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="mb-2">Create Group</DialogTitle>
                                <CreateGroupForm user={user} />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </p>
            </div>
        );
    }

    return (
        <ul>
            {groups.map((group) => (
                <li key={group.id}>{group.name}</li>
            ))}
        </ul>
    );
}
