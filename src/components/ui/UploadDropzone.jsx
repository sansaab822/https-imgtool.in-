import React, { useRef, useState } from 'react'

export default function UploadDropzone({
    onFilesSelected,
    accept = 'image/jpeg, image/png, image/webp',
    multiple = true,
    title = 'Drop your images here',
    subtitle = 'or click to browse from device',
    formats = ['JPG', 'PNG', 'WebP'],
    maxFilesText = 'Batch processing supported · Zero server uploads',
    className = '',
    compact = false
}) {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files))
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files))
            e.target.value = '' // Reset so same file can be re-selected if needed
        }
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`drop-zone group relative cursor-pointer text-center transition-all duration-200 select-none ${
                isDragging ? 'active border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]' : ''
            } ${compact ? 'p-6' : 'p-8 sm:p-12'} ${className}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
                <div className={`rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200 shadow-sm ${
                    compact ? 'w-12 h-12 text-xl' : 'w-16 h-16 text-2xl'
                }`}>
                    <i className="fas fa-cloud-arrow-up" aria-hidden="true"></i>
                </div>

                <h3 className={`font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                    compact ? 'text-base' : 'text-lg sm:text-xl'
                }`}>
                    {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
                    {subtitle}
                </p>

                {formats && formats.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                        {formats.map((fmt) => (
                            <span
                                key={fmt}
                                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 dark:bg-workstation-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                            >
                                {fmt}
                            </span>
                        ))}
                    </div>
                )}

                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                    <i className="fas fa-shield-halved text-[10px]" aria-hidden="true"></i>
                    <span>{maxFilesText}</span>
                </div>
            </div>
        </div>
    )
}
