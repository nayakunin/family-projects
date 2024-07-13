import { Button } from '@/components/ui/button';

export const SubmitButton = ({ loading }: { loading: boolean }) => (
    <Button size="sm" form="recipe" type="submit" loading={loading}>
        Submit
    </Button>
);
