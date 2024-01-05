import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from 'lib/utils/tailwind';
import { CheckIcon, MinusIcon } from 'lucide-react';
import React from 'react';

interface ICheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, ICheckboxProps>(
  ({ className, indeterminate, ...props }, ref) => {
    indeterminate && console.log('indeterminate:', indeterminate);

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          className
        )}
        {...props}
      >
        {indeterminate ? (
          <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
          >
            <MinusIcon className='h-4 w-4' />
          </CheckboxPrimitive.Indicator>
        ) : (
          <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
          >
            <CheckIcon className='h-4 w-4' />
          </CheckboxPrimitive.Indicator>
        )}
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
