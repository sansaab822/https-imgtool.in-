import React from 'react'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    title,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]'

    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 hover:shadow-md hover:shadow-blue-600/40 focus-visible:ring-blue-500/50',
        secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-workstation-850 dark:hover:bg-workstation-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus-visible:ring-slate-400/40',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 hover:shadow-md hover:shadow-emerald-600/40 focus-visible:ring-emerald-500/50',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/30 hover:shadow-md hover:shadow-red-500/40 focus-visible:ring-red-400/50',
        outline: 'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-workstation-850 focus-visible:ring-slate-400/40',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-workstation-850 text-slate-600 dark:text-slate-300 focus-visible:ring-slate-400/40',
    }

    const sizeStyles = {
        sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
        md: 'text-sm px-4 py-2 gap-2 rounded-xl',
        lg: 'text-base px-6 py-3 gap-2.5 rounded-xl',
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            title={title}
            className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            )}
            {!loading && icon && iconPosition === 'left' && (
                <i className={`${icon} ${children ? 'text-xs' : 'text-sm'}`} aria-hidden="true"></i>
            )}
            {children}
            {!loading && icon && iconPosition === 'right' && (
                <i className={`${icon} ${children ? 'text-xs' : 'text-sm'}`} aria-hidden="true"></i>
            )}
        </button>
    )
}
