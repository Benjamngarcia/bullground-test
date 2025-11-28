import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'glassmorphic';
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

  if (variant === 'glassmorphic') {
    return (
      <div
        className={`relative rounded-xl ${className}`}
        style={{
          backgroundColor: '#292929',
          opacity: '70%',
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.18)',
          boxShadow: '0 10px 10px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(50px)',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
