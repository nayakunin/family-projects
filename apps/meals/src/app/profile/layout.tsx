import { PageContainer } from '@/components/hoc/page-container';
import { PageHeader } from '@/components/hoc/page-header';

import { SidebarNav } from './components/sidebar-nav';

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/profile',
    },
    {
        title: 'Account',
        href: '/profile/account',
    },
    {
        title: 'Groups',
        href: '/profile/groups',
    },
    {
        title: 'Appearance',
        href: '/profile/appearance',
    },
    {
        title: 'Notifications',
        href: '/profile/notifications',
    },
    {
        title: 'Display',
        href: '/profile/display',
    },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <PageContainer>
            <PageHeader title="Account" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </PageContainer>
    );
}
