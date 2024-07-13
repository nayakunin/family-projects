import { useState } from 'react';

type UseDialogProps<T> = {
    defaultOpen?: boolean;
};

export const useDialog = <T>({ defaultOpen = false }: UseDialogProps<T> = {}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [state, setState] = useState<T>();

    const open = (state: T) => {
        setState(state);
        setIsOpen(true);
    };
    const close = () => {
        setState(undefined);
        setIsOpen(false);
    };
    const toggle = (state?: T) =>
        setIsOpen((prev) => {
            if (state) {
                setState(state);
            }
            return !prev;
        });

    return {
        isOpen,
        state,
        open,
        close,
        toggle,
    };
};
