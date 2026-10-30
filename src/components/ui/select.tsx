import * as React from 'react';
import { inputClass } from './styles';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
        <select
          className={cn(
            inputClass, 'appearance-none pr-9',
            error ? 'border-error' : 'border-border',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && props.id ? `${props.id}-error` : undefined}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <p id={props.id ? `${props.id}-error` : undefined} className="mt-1.5 break-words text-xs text-red-700">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
