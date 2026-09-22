import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-full whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700',
        secondary: 'bg-gray-100 text-gray-700',
        primary: 'bg-primary-100 text-primary-700',
        accent: 'bg-accent-100 text-accent-700',
        success: 'bg-success-50 text-success-700 border border-success-200',
        warning: 'bg-warning-50 text-warning-700 border border-warning-200',
        error: 'bg-error-50 text-error-700 border border-error-200',
        info: 'bg-info-50 text-info-600 border border-info-200',
        outline: 'border border-border text-gray-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

import { AUCTION_STATUSES } from '@/lib/constants';

export function AuctionStatusBadge({ status, className }: { status: string; className?: string }) {
  const statusConfig = AUCTION_STATUSES.find(s => s.value === status);
  const variantMap: Record<string, BadgeProps['variant']> = {
    info: 'info', success: 'success', warning: 'warning',
    neutral: 'default', error: 'error', accent: 'accent',
  };
  const variant = variantMap[statusConfig?.color || 'neutral'] || 'default';
  const isLive = status === 'LIVE';
  return (
    <Badge variant={variant} className={cn(isLive ? 'status-live' : '', className)}>
      {statusConfig?.label || status}
    </Badge>
  );
}
