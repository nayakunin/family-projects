import { getCurrentUser } from '@/server/actions';

export default async function Page() {
    const user = await getCurrentUser();

    return <div>{JSON.stringify(user)}</div>;
}
