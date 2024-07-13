import { useRequest } from 'ahooks';
import { X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { getGroups } from '../actions';
import { FormValues } from '../schema';

export const GroupPicker = () => {
    const { data: userGroups = [] } = useRequest(getGroups);
    const { control } = useFormContext<FormValues>();

    return (
        <FormField
            control={control}
            name="group"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        {!field.value.open ? (
                            <Button
                                variant="link"
                                size="sm"
                                className="h-10"
                                onClick={() =>
                                    field.onChange({
                                        ...field.value,
                                        open: true,
                                    })
                                }
                            >
                                Add to a group
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Select
                                    value={field.value.id}
                                    onValueChange={(val) =>
                                        field.onChange({
                                            ...field.value,
                                            id: val,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userGroups.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <X
                                    className="text-primary-500 hover:text-primary-600 h-4 w-4 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange({ open: false });
                                    }}
                                />
                            </div>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
