import React from 'react'

export default function ProgressBar({
    value = 0,
    max = 100,
    label,
    statusText,
    variant = 'blue',
    className = ''
}) {
    const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

    const variants = {
        blue: 'bg-blue-600 dark:bg-blue-500',
        emerald: 'bg-emerald-600 dark:bg-emerald-500',
        amber: 'bg-amber-500',
    }

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {label || 'Progress'}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                    {statusText || `${percentage}%`}
                </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-workstation-850 overflow-hidden border border-slate-200/60 dark:border-slate-800">
                <div
                    className={`h-full transition-all duration-300 ease-out rounded-full ${variants[variant] || variants.blue}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}
