import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { buttonBaseClass, primaryButtonTone } from './styles';

const buttonVariants = cva(
  buttonBaseClass,
  {
    variants: {
      variant: {
        primary: primaryButtonTone,
        secondary: 'bg-[#f1f4f6] text-[#182129] hover:bg-[#e8edf1]',
        outline: 'border border-border bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
        ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        destructive: 'bg-error text-white hover:bg-error-600 active:bg-error-700',
        accent: 'bg-accent text-primary-900 hover:bg-accent-300 active:bg-accent-400 font-semibold',
      },
      size: {
        sm: 'min-h-11 px-3 text-xs',
        md: 'h-12 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
