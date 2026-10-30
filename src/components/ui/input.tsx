import * as React from 'react';
import { inputClass } from './styles';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            inputClass,
            error ? 'border-error focus:ring-error/30' : 'border-border',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && props.id ? `${props.id}-error` : undefined}
          ref={ref}
          {...props}
        />
        {error && <p id={props.id ? `${props.id}-error` : undefined} className="mt-1.5 break-words text-xs text-red-700">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
