import React from 'react'

export default function Tabs({
    tabs,
    activeTab,
    onChange,
    size = 'md',
    className = ''
}) {
    return (
        <div className={`flex items-center p-1 bg-slate-100 dark:bg-workstation-850 rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg select-none ${
                            size === 'sm' ? 'text-xs py-1.5 px-2.5' : 'text-xs sm:text-sm py-2 px-3'
                        } ${
                            isActive
                                ? 'bg-white dark:bg-workstation-950 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        {tab.icon && <i className={tab.icon} aria-hidden="true"></i>}
                        <span>{tab.label}</span>
                        {tab.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
