import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '../ui/button';

export type PageHeaderProps = {
    title?: ReactNode;
    subtitle?: ReactNode;
    extra?: ReactNode;
    onBack?: () => void;
};

export const PageHeader = ({ title, subtitle, extra, onBack }: PageHeaderProps) => {
    return (
        <section className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
                {onBack && (
                    <Button className="mr-3" variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft className="text-primary h-4 w-4" />
                    </Button>
                )}
                <h1 className="text-xl font-medium">{title}</h1>
                {subtitle && <span className="text-muted-foreground ml-2">{subtitle}</span>}
            </div>
            {extra && <div className="flex items-center">{extra}</div>}
        </section>
    );
};
