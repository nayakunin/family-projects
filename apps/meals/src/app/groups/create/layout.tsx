import { PageContainer } from '@/components/hoc/page-container';
import { PageHeader } from '@/components/hoc/page-header';

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <PageContainer>
            <PageHeader title="Create group" />
            {children}
        </PageContainer>
    );
}
