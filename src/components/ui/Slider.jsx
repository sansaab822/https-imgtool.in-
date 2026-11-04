import React from 'react'

export default function Slider({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    helpText,
    className = '',
    id
}) {
    const inputId = id || `slider-${label?.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center justify-between text-xs">
                <label htmlFor={inputId} className="font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                </label>
                <span className="font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-workstation-850 px-2 py-0.5 rounded text-[11px] border border-slate-200 dark:border-slate-800">
                    {value}{unit}
                </span>
            </div>
            <input
                id={inputId}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="slider-range"
            />
            {helpText && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{helpText}</p>
            )}
        </div>
    )
}
