/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' }
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                shimmer: 'shimmer 1s infinite',
                fadeIn: 'fadeIn 0.3s ease-out'
            }
        },
    },
    plugins: [],
}
