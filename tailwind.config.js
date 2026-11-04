/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Design Tokens - Workstation Dark Theme
                workstation: {
                    950: '#070A11', // Deepest background
                    900: '#0B0F19', // Primary surface
                    850: '#111726', // Elevated card surface
                    800: '#172033', // Interactive hover / popover
                    750: '#1E2942', // Active borders / controls
                    700: '#2A3857', // Subtle dividers
                },
                // Design Tokens - Brand Primary & Accents
                brand: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    500: '#3B82F6',
                    600: '#2563EB', // Primary Brand Blue
                    700: '#1D4ED8',
                    indigo: '#4F46E5',
                    violet: '#7C3AED',
                },
                // Privacy & Verification Accents
                privacy: {
                    emerald: '#10B981',
                    emeraldDark: '#059669',
                    emeraldBg: 'rgba(16, 185, 129, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            boxShadow: {
                'workstation': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
                'workstation-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
                'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.3)',
                'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' }
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' }
                }
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
                fadeIn: 'fadeIn 0.25s ease-out',
                pulseSubtle: 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
