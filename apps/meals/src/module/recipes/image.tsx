'use client';

import { Image } from 'lucide-react';
import { ComponentPropsWithoutRef, createContext, ElementRef, forwardRef, useContext } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type RecipeImageProps = {
    image?: string | null;
    onAddImage?: () => void;
};

const recipeImageContext = createContext<RecipeImageProps | null>(null);

const useRecipeImage = () => {
    const context = useContext(recipeImageContext);
    if (!context) {
        throw new Error('useRecipeImage must be used within a RecipeImage');
    }
    return context;
};

export const RecipeImage = forwardRef<
    ElementRef<typeof Avatar>,
    ComponentPropsWithoutRef<typeof Avatar> & RecipeImageProps
>(({ className, image, onAddImage, ...rest }, ref) => {
    return (
        <recipeImageContext.Provider value={{ image, onAddImage }}>
            <Avatar
                ref={ref}
                className={cn(
                    'h-64 w-64 rounded-md',
                    {
                        'cursor-pointer': !!onAddImage,
                    },
                    className,
                )}
                onClick={() => onAddImage?.()}
                {...rest}
            />
        </recipeImageContext.Provider>
    );
});

export const RecipeImageFallback = forwardRef<
    ElementRef<typeof AvatarFallback>,
    ComponentPropsWithoutRef<typeof AvatarFallback>
>(({ children, className, ...rest }, ref) => {
    return (
        <AvatarFallback ref={ref} className={cn('rounded-none', className)} {...rest}>
            {children ? children : <Image className="h-10 w-10" />}
        </AvatarFallback>
    );
});

export const RecipeImagePreview = forwardRef<
    ElementRef<typeof AvatarImage>,
    ComponentPropsWithoutRef<typeof AvatarImage>
>(({ className, ...rest }, ref) => {
    const { image } = useRecipeImage();
    return <AvatarImage ref={ref} className={cn(className)} src={image ?? ''} {...rest} />;
});
