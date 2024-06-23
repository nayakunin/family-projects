'use client';

import { useRequest } from 'ahooks';
import { Command as CommandPrimitive } from 'cmdk';
import { Loader2, X } from 'lucide-react';
import React, { ReactNode, useRef, useState } from 'react';

import { Badge } from '../ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Input } from '../ui/input';

type AutocompleteOption<T> = {
    label: string;
    value: T;
};

type AutocompleteProps<T extends string | number> = {
    value: AutocompleteOption<T>['value'][];
    placeholder?: string;
    throttle?: number;
    queryFn: (filter: string) => Promise<AutocompleteOption<T>[]>;
    onChange: (value: AutocompleteOption<T>['value'][]) => void;
};

type SearchWindowProps<T extends string | number> = {
    open: boolean;
    options: AutocompleteOption<T>[];
    onAdd: (value: T) => void;
};

const SearchWindow = <T extends string | number>({
    open,
    options,
    onAdd,
}: SearchWindowProps<T>) => {
    if (!open) return null;

    return (
        <div className="relative mt-2">
            <CommandList className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                <CommandEmpty>No Results</CommandEmpty>
                <CommandGroup className="h-full overflow-auto">
                    {options.map((option) => (
                        <CommandItem
                            key={option.label}
                            className="cursor-pointer"
                            onSelect={() => onAdd(option.value)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            {option.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </div>
    );
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
    const { data: options = [], loading } = useRequest(() => queryFn(filter), {
        refreshDeps: [filter],
        throttleWait: throttle,
    });
    const [labelsCache, setLabelsCache] = useState<Map<T, string>>(new Map());

    const handleAdd = React.useCallback(
        (id: T) => {
            setLabelsCache((prev) =>
                prev.set(id, options.find((o) => o.value === id)?.label || ''),
            );
            onChange([...value, id]);
        },
        [options, value, onChange],
    );

    const handleRemove = React.useCallback(
        (id: T) => {
            onChange(value.filter((v) => v !== id));
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

                        if (lastValue) handleRemove(lastValue);
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

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div className="border-input ring-offset-background focus-within:ring-ring group rounded-md border text-sm focus-within:ring-2 focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {value.length !== 0 && (
                        <div className="flex flex-wrap gap-2 p-2">
                            {value.map((id) => (
                                <Badge key={id} variant="secondary">
                                    {labelsCache.get(id)}
                                    <button
                                        className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRemove(id);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleRemove(id)}
                                    >
                                        <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        className="placeholder:text-muted-foreground flex-1 bg-transparent px-3 py-2 outline-none"
                        value={filter}
                        placeholder={placeholder}
                        onValueChange={setFilter}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                    />
                    {loading && (
                        <div className="fade-in-10 fade-out-50 animate-in py-2 pr-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    )}
                </div>
            </div>
            <SearchWindow open={open} options={options} onAdd={handleAdd} />
        </Command>
    );
}
