'use client';

import { useRequest } from 'ahooks';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { Badge } from '../ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';

type AutocompleteOption<T> = {
    label: string;
    value: T;
};

type AutocompleteProps<T extends string | number> = {
    value: AutocompleteOption<T>[];
    placeholder?: string;
    throttle?: number;
    queryFn: (filter: string) => Promise<AutocompleteOption<T>[]>;
    onChange: (value: AutocompleteOption<T>[]) => void;
};

export function Autocomplete<T extends string | number>({
    value,
    placeholder,
    throttle,
    onChange,
    queryFn,
}: AutocompleteProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const { data: options = [] } = useRequest(() => queryFn(filter), {
        refreshDeps: [filter],
        throttleWait: throttle,
    });

    const handleRemove = React.useCallback(
        (id: T) => {
            onChange(value.filter((v) => v.value !== id));
        },
        [value, onChange],
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (input.value === '' && value.length > 0) {
                        const lastValue = value[value.length - 1];

                        if (lastValue) handleRemove(lastValue.value);
                    }
                }
                // This is not a default behaviour of the <input /> field
                if (e.key === 'Escape') {
                    input.blur();
                }
            }
        },
        [handleRemove],
    );

    const selectables = options.filter((option) => {
        return !value.some((v) => v.value === option.value);
    });

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div className="border-input ring-offset-background focus-within:ring-ring group rounded-md border text-sm focus-within:ring-2 focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {value.map(({ label, value }) => {
                        return (
                            <Badge key={label} variant="secondary">
                                {label}
                                <button
                                    className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRemove(value);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleRemove(value)}
                                >
                                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                                </button>
                            </Badge>
                        );
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={filter}
                        onValueChange={setFilter}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="placeholder:text-muted-foreground flex-1 bg-transparent px-3 py-2 outline-none"
                    />
                </div>
            </div>
            {open && selectables.length > 0 ? (
                <div className="relative mt-2">
                    <CommandList>
                        <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.label}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onSelect={() => onChange([...value, option])}
                                            className={'cursor-pointer'}
                                        >
                                            {option.label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </div>
                    </CommandList>
                </div>
            ) : null}
        </Command>
    );
}
