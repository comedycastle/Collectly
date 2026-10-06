/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#2563EB',
                    secondary: '#64748B',
                    accent: '#06B6D4',
                    bg: '#F8FAFC',
                    surface: '#FFFFFF',
                    surfaceLight: '#F1F5F9',
                    border: '#E2E8F0',
                    text: '#0F172A',
                    muted: '#64748B',
                },
                darkBrand: {
                    primary: '#3B82F6',
                    accent: '#06B6D4',
                    bg: '#0F172A',
                    surface: '#1E293B',
                    surfaceLight: '#334155',
                    border: '#334155',
                    text: '#F8FAFC',
                    muted: '#94A3B8',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(135deg, #60A5FA 0%, #22D3EE 100%)',
                'glow-gradient': 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12), transparent 70%)',
                'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            },
            boxShadow: {
                'glow': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
                'accent-glow': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
                'card': '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
