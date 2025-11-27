import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-zinc-900 rounded-xl',
    bordered: 'bg-zinc-900 border border-zinc-800 rounded-xl',
    elevated: 'bg-linear-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl shadow-lg',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
