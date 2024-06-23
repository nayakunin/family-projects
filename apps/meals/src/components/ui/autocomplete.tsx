import { Loader2 } from 'lucide-react';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { Input } from './input';

export const Autocomplete = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('relative overflow-visible bg-transparent', className)}
            {...props}
        >
            {children}
        </div>
    ),
);

export const AutocompleteValue = forwardRef<ElementRef<'input'>, ComponentPropsWithoutRef<'input'>>(
    ({ className, ...props }, ref) => <Input ref={ref} className={cn('', className)} {...props} />,
);

export const AutocompleteLoader = forwardRef<
    ElementRef<typeof Loader2>,
    ComponentPropsWithoutRef<typeof Loader2>
>(({ className, ...props }, ref) => (
    <Loader2
        ref={ref}
        className={cn(
            'absolute right-3 top-2.5 h-5 w-5 shrink-0 animate-spin opacity-30',
            className,
        )}
        {...props}
    />
));

export const AutocompleteWindow = forwardRef<
    ElementRef<'div'>,
    ComponentPropsWithoutRef<'div'> & { open?: boolean }
>(({ className, children, open, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'relative -bottom-2',
            {
                hidden: !open,
            },
            className,
        )}
        {...props}
    >
        {children}
    </div>
));

export const AutocompleteContent = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    ),
);

export const AutocompleteList = forwardRef<ElementRef<'ul'>, ComponentPropsWithoutRef<'ul'>>(
    ({ className, children, ...props }, ref) => (
        <ul ref={ref} className={cn('h-full overflow-auto', className)} {...props}>
            {children}
        </ul>
    ),
);

export const AutocompleteEmpty = forwardRef<ElementRef<'li'>, ComponentPropsWithoutRef<'li'>>(
    ({ className, children, ...props }, ref) => (
        <li ref={ref} className={cn('p-3 text-center', className)} {...props}>
            {children}
        </li>
    ),
);

export const AutocompleteItem = forwardRef<ElementRef<'li'>, ComponentPropsWithoutRef<'li'>>(
    ({ className, children, ...props }, ref) => (
        <li ref={ref} className={cn('hover:bg-muted/50 cursor-pointer p-3', className)} {...props}>
            {children}
        </li>
    ),
);
