import React from 'react'

export default function IconButton({
    icon,
    onClick,
    title,
    size = 'md',
    variant = 'secondary',
    active = false,
    disabled = false,
    className = '',
    ...props
}) {
    const base = 'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 disabled:opacity-40 disabled:cursor-not-allowed select-none'

    const sizeStyles = {
        sm: 'w-7 h-7 text-xs rounded-lg',
        md: 'w-9 h-9 text-sm rounded-xl',
        lg: 'w-11 h-11 text-base rounded-xl',
    }

    const variantStyles = {
        primary: active
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 hover:bg-blue-600 hover:text-white',
        secondary: active
            ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm'
            : 'bg-slate-100 text-slate-700 dark:bg-workstation-850 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-workstation-800',
        danger: active
            ? 'bg-red-600 text-white shadow-sm'
            : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-600 hover:text-white',
        ghost: active
            ? 'bg-slate-200 dark:bg-workstation-800 text-blue-600 dark:text-blue-400'
            : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-workstation-800 hover:text-slate-900 dark:hover:text-white',
    }

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            title={title}
            aria-label={title}
            className={`${base} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.secondary} ${className}`}
            {...props}
        >
            <i className={icon} aria-hidden="true"></i>
        </button>
    )
}
