import React from 'react'

export default function NumberInput({
    label,
    value,
    onChange,
    min = 0,
    max = 9999,
    step = 1,
    unit = '',
    className = '',
    id
}) {
    const inputId = id || `num-${label?.toLowerCase().replace(/\s+/g, '-')}`

    const handleDecrement = () => {
        onChange(Math.max(min, Number(value) - step))
    }

    const handleIncrement = () => {
        onChange(Math.min(max, Number(value) + step))
    }

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-workstation-900 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 overflow-hidden">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    aria-label="Decrease value"
                    className="w-8 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-workstation-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <i className="fas fa-minus text-[10px]"></i>
                </button>
                <div className="flex-1 flex items-center justify-center px-1">
                    <input
                        id={inputId}
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full text-center font-mono text-sm font-semibold bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 p-0"
                    />
                    {unit && (
                        <span className="text-xs text-slate-400 font-mono pr-1 select-none">{unit}</span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={value >= max}
                    aria-label="Increase value"
                    className="w-8 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-workstation-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <i className="fas fa-plus text-[10px]"></i>
                </button>
            </div>
        </div>
    )
}
