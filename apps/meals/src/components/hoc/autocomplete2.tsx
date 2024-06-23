'use client';

import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandInputWrapper,
    CommandItem,
    CommandList,
} from '../ui/command';

type AutocompleteOption<T> = {
    label: string;
    value: T;
    disabled?: boolean;
};

type AutocompleteProps<T extends string | number, O extends AutocompleteOption<T>> = {
    value: string;
    options?: O[];
    placeholder?: string;
    loading?: boolean;
    renderOption?: (option: O) => React.ReactNode;
    onClick: (value: AutocompleteOption<T>['value']) => void;
    onChange: (value: string) => void;
};

type SearchWindowProps<T extends string | number, O extends AutocompleteOption<T>> = {
    open: boolean;
    options: O[];
    renderOption?: (option: O) => React.ReactNode;
    onAdd: (value: T) => void;
};

const SearchWindow = <T extends string | number, O extends AutocompleteOption<T>>({
    open,
    options,
    onAdd,
    renderOption = (option) => option.label,
}: SearchWindowProps<T, O>) => {
    if (!open) return null;

    return (
        <div className="relative -bottom-2">
            <CommandList className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                <CommandEmpty>No Results</CommandEmpty>
                <CommandGroup className="h-full overflow-auto">
                    {options.map((option) => (
                        <CommandItem
                            key={option.label}
                            className={cn('cursor-pointer', {
                                'cursor-not-allowed': option.disabled,
                            })}
                            onSelect={() => onAdd(option.value)}
                            disabled={option.disabled}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            {renderOption(option)}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </div>
    );
};

export function Autocomplete<T extends string | number, O extends AutocompleteOption<T>>({
    value,
    options = [],
    placeholder,
    loading,
    onClick,
    onChange,
    renderOption,
}: AutocompleteProps<T, O>) {
    const [open, setOpen] = useState(false);

    return (
        <Command className="relative overflow-visible bg-transparent">
            <div className="border-input ring-offset-background focus-within:ring-ring group rounded-md border text-sm focus-within:ring-2 focus-within:ring-offset-2">
                <CommandInputWrapper
                    className="border-b-0"
                    after={
                        loading ? (
                            <Loader2 className="h-5 w-5 shrink-0 animate-spin opacity-30" />
                        ) : null
                    }
                >
                    <CommandInput
                        value={value}
                        placeholder={placeholder}
                        onValueChange={onChange}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                    />
                </CommandInputWrapper>
            </div>
            <SearchWindow
                open={open}
                options={options}
                onAdd={onClick}
                renderOption={renderOption}
            />
        </Command>
    );
}
