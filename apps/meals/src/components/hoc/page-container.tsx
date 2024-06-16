import { cn } from '@/lib/utils';

export const PageContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <main className={cn('container mx-auto py-6', className)}>{children}</main>;
};
