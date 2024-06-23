import { useRequest } from 'ahooks';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';

import { FormValues } from '.';
import { validateGroupName } from './actions';

type GroupNameProps = {
    field: ControllerRenderProps<FormValues, 'name'>;
    form: UseFormReturn<FormValues>;
};

export const GroupName = ({ form, field }: GroupNameProps) => {
    useRequest(() => validateGroupName(field.value), {
        refreshDeps: [field.value],
        ready: field.value !== '',
        onSuccess: (valid) => {
            if (!valid) {
                form.setError('name', { message: 'Name is already taken' });
            }
        },
    });

    return <Input {...field} placeholder="Name" />;
};
