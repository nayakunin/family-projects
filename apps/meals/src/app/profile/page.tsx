import { getCurrentUser } from '@/server/actions';

export default async function Account() {
    const user = await getCurrentUser();

    return <div>{JSON.stringify(user)}</div>;
}
