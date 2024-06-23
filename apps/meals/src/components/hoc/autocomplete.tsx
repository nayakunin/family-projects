'use client';

import React from 'react';

import {
    Autocomplete as AutcompleteBase,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteItem,
    AutocompleteList,
    AutocompleteLoader,
    AutocompleteValue,
    AutocompleteWindow,
} from '@/components/ui/autocomplete';

type AutocompleteOption<T extends string | number> = {
    label: string;
    value: T;
    disabled?: boolean;
};

type AutocompleteProps<T extends string | number, O extends AutocompleteOption<T>> = {
    value: string;
    open: boolean;
    options?: O[];
    placeholder?: string;
    loading?: boolean;
    renderOption?: (option: O) => React.ReactNode;
    onClick: (value: T) => void;
    onChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
};

export function Autocomplete<T extends string | number, O extends AutocompleteOption<T>>({
    value,
    open,
    options = [],
    placeholder,
    loading,
    onClick,
    onChange,
    renderOption = (option) => option.label,
    onOpenChange,
}: AutocompleteProps<T, O>) {
    return (
        <AutcompleteBase>
            <AutocompleteValue
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onOpenChange(false)}
                onFocus={() => onOpenChange(true)}
            />
            {loading && <AutocompleteLoader />}
            <AutocompleteWindow open={open}>
                <AutocompleteContent>
                    <AutocompleteList>
                        {options.length === 0 && (
                            <AutocompleteEmpty>No results found</AutocompleteEmpty>
                        )}
                        {options.map((option) => (
                            <AutocompleteItem
                                key={option.label}
                                onClick={() => onClick(option.value)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {renderOption(option)}
                            </AutocompleteItem>
                        ))}
                    </AutocompleteList>
                </AutocompleteContent>
            </AutocompleteWindow>
        </AutcompleteBase>
    );
}
