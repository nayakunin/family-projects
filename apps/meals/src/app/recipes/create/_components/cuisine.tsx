import { useRequest } from 'ahooks';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Autocomplete } from '@/module/recipes/autocomplete';
import { getCuisines } from '@/server/actions';

import { FormValues } from '../schema';

export const CuisineField = () => {
    const form = useFormContext<FormValues>();
    const { control } = useFormContext<FormValues>();
    const [cuisinesQuery] = form.watch(['cuisines.query']);

    const { data: cuisines = [], loading: cuisinesLoading } = useRequest(
        async () => {
            return (await getCuisines(cuisinesQuery)).map((ingredient) => ({
                label: ingredient.label,
                value: ingredient.id,
            }));
        },
        {
            refreshDeps: [cuisinesQuery],
            ready: !!cuisinesQuery,
        },
    );

    return (
        <FormField
            control={control}
            name="cuisines"
            render={({ field }) => (
                <FormItem className="col-span-2">
                    <FormLabel>Cuisines</FormLabel>
                    <FormControl>
                        <>
                            <Autocomplete
                                placeholder="Cuisines"
                                value={field.value.query}
                                open={field.value.open}
                                options={cuisines}
                                loading={cuisinesLoading}
                                onChange={(query) =>
                                    field.onChange({
                                        ...field.value,
                                        query,
                                    })
                                }
                                onOpenChange={(open) => field.onChange({ ...field.value, open })}
                                onClick={(id) => {
                                    field.onChange({
                                        ...field.value,
                                        selected: [...field.value.selected, id],
                                    });
                                }}
                                onClickCreate={console.log}
                            />
                            <div>
                                {field.value.selected.map((id) => (
                                    <div key={id}>{id}</div>
                                ))}
                            </div>
                        </>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
