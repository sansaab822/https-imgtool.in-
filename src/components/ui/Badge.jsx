import React from 'react'

export default function Badge({
    children,
    variant = 'neutral',
    icon,
    size = 'md',
    className = ''
}) {
    const variants = {
        primary: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40',
        emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40',
        amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40',
        indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/40',
        purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-900/40',
        neutral: 'bg-slate-100 text-slate-700 dark:bg-workstation-850 dark:text-slate-300 border-slate-200 dark:border-slate-800',
    }

    const sizes = {
        sm: 'text-[10px] px-2 py-0.5 rounded gap-1',
        md: 'text-xs px-2.5 py-1 rounded-full gap-1.5',
        lg: 'text-sm px-3.5 py-1.5 rounded-full gap-2',
    }

    return (
        <span className={`inline-flex items-center font-medium border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}>
            {icon && <i className={icon} aria-hidden="true"></i>}
            <span>{children}</span>
        </span>
    )
}
