import { useRequest } from 'ahooks';
import { ControllerRenderProps } from 'react-hook-form';

import { Autocomplete } from '@/module/recipes/autocomplete';
import { getIngredients } from '@/server/actions';

import { FormValues } from '../schema';

type IngredientsPickerProps = {
    field: ControllerRenderProps<FormValues, 'ingredients'>;
    onCreateNew: (name: string) => void;
};

export const IngredientsPicker = ({ field, onCreateNew }: IngredientsPickerProps) => {
    const { data: ingredients = [], loading: ingredientsLoading } = useRequest(
        async () => {
            return (await getIngredients(field.value.query)).map((ingredient) => ({
                label: ingredient.label,
                value: ingredient.id,
            }));
        },
        {
            refreshDeps: [field.value.query],
            ready: field.value.open && field.value.query !== '',
        },
    );

    return (
        <>
            <Autocomplete
                placeholder="Ingredients"
                value={field.value.query}
                open={field.value.open}
                options={ingredients}
                loading={ingredientsLoading}
                onChange={(query) => field.onChange({ ...field.value, query })}
                onOpenChange={(open) => field.onChange({ ...field.value, open })}
                onClick={(id) => {
                    field.onChange({
                        ...field.value,
                        selected: [...field.value.selected, id],
                    });
                }}
                onClickCreate={onCreateNew}
            />
            <div>
                {field.value.selected.map(({ name }) => (
                    <div key={name}>{name}</div>
                ))}
            </div>
        </>
    );
};
