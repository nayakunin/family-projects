import { useRequest } from 'ahooks';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';

import { validateGroupName } from '../shared/actions';
import { FormValues } from '../shared/schema';

type GroupNameProps = {
    field: ControllerRenderProps<FormValues, 'name'>;
    form: UseFormReturn<FormValues>;
    defaultValue?: string;
};

export const GroupName = ({ form, field, defaultValue }: GroupNameProps) => {
    useRequest(() => validateGroupName(field.value), {
        refreshDeps: [field.value],
        ready: field.value !== defaultValue,
        onSuccess: (valid) => {
            if (!valid) {
                form.setError('name', { message: 'Name is already taken' });
            }
        },
    });

    return <Input {...field} placeholder="Name" />;
};
