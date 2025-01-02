/** @type {import('tailwindcss').Config} */
const tailwindcssAnimate = require('tailwindcss-animate');

module.exports = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}', './src/index.css'],
    theme: {
        extend: {
            width: {
                'order-details': 'var(--order-details-width)', // Define a custom width class
                'navigation-sidebar': 'var(--navigation-sidebar-width)',
            },
            maxWidth: {
                'page-layout': 'var(--page-layout)',
            },
            fontFamily: {
                sans: [
                    'Inter',
                    'system-ui',
                    'Avenir',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    indigo: {
                        900: '#7B61FF',
                        800: '#8C7AFF',
                        700: '#9D93FF',
                        600: '#AEACFF',
                        500: '#BFC5FF',
                        400: '#D0DEFF',
                        300: '#E1F7FF',
                        200: '#F2F9FF',
                        100: '#F9FBFF',
                        50: '#FFFFFF',
                    },
                    green: {
                        900: '#94D42A',
                        800: '#A0DA4A',
                        700: '#ACDF69',
                        600: '#B8E589',
                        500: '#C4EBA9',
                        400: '#D0F1C9',
                        300: '#DCF7E9',
                        200: '#E8FDF9',
                        100: '#F4FEF4',
                        50: '#FFFFFF',
                    },
                    yellow: {
                        900: '#FABE06',
                        800: '#FBCC2C',
                        700: '#FCD852',
                        600: '#FDE378',
                        500: '#FDEF9E',
                        400: '#FEFAC4',
                        300: '#FEFCEA',
                        200: '#FFFEF5',
                        100: '#FFFFFA',
                        50: '#FFFFFF',
                    },
                    baltic: {
                        900: '#2C272D',
                        800: '#443D44',
                        700: '#5D545A',
                        600: '#756A71',
                        500: '#8E8188',
                        400: '#A6979F',
                        300: '#BFADB6',
                        200: '#F0DAE4',
                        100: '#F9EFF2',
                        50: '#FFF4F7',
                    },
                    moss: {
                        900: '#020202',
                        800: '#1A1A1A',
                        700: '#333333',
                        600: '#4D4D4D',
                        500: '#666666',
                        400: '#808080',
                        300: '#999999',
                        200: '#B3B3B3',
                        100: '#CCCCCC',
                        50: '#E6E6E6',
                    },
                    black: {
                        90: '#121212',
                        85: '#242424',
                        70: '#272727',
                        65: '#676767',
                        60: '#C2C2C2',
                    },
                    purple: {
                        90: '#7B61FF',
                    },
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    onyx: {
                        900: '#121212',
                        800: '#262626',
                        700: '#3A3A3A',
                        600: '#4E4E4E',
                        500: '#626262',
                        400: '#767676',
                        300: '#8A8A8A',
                        200: '#9E9E9E',
                        100: '#B3B3B3',
                        50: '#C7C7C7',
                    },
                    davy: {
                        900: '#555555',
                        800: '#6A6A6A',
                        700: '#7F7F7F',
                        600: '#949494',
                        500: '#A9A9A9',
                        400: '#BEBEBE',
                        300: '#D3D3D3',
                        200: '#E8E8E8',
                        100: '#FDFDFD',
                        50: '#FFFFFF',
                    },
                    charcoal: {
                        900: '#3E3E3E',
                        800: '#525252',
                        700: '#666666',
                        600: '#7A7A7A',
                        500: '#8E8E8E',
                        400: '#A2A2A2',
                        300: '#B6B6B6',
                        200: '#CACACA',
                        100: '#DEDEDE',
                        50: '#F2F2F2',
                        69: '#242424',
                    },
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
                sidebar: {
                    DEFAULT: '#121212',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: '#FFFFFF',
                    'primary-foreground':
                        'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground':
                        'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
                switchBackground: {
                    500: '#4b5669',
                },
                fontSize: {
                    sm: ['12px', '16px'], // Small font size with line height
                    md: ['14px', '20px'], // Medium font size with line height
                    lg: ['16px', '24px'], // Large font size with line height
                },
                lineHeight: {
                    tighter: '1.1',
                    relaxed: '1.7',
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
