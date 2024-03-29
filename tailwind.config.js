/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './layouts/**/*.{js,ts,jsx,tsx}',
        './container/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontSize: {
                h1: '2.5rem',
                h2: '2rem',
                h3: '1.25rem',
                h4: '1rem',
                h5: '0.8rem',
                h6: '0.5rem',
            },
            lineHeight: {
                h1: '52px',
                h2: '42px',
                h3: '26px',
                h4: '20px',
                h5: '16px',
                h6: '12px',
            },
            colors: {
                primary: {
                    80: '#377DFF',
                    70: '#4C79CC',
                    10: '#EBF2FF',
                },
                secondary: {
                    80: '#3E4A60',
                    40: '#777E8B',
                    35: '#999FA9',
                    30: '#C7C8C9',
                    20: '#e8e8e8',
                    10: '#f4f4f4',
                },
                greenury: {
                    100: '#2DA26E',
                    50: '#D7F5E7',
                },
                orangury: {
                    100: '#D7F5E7',
                    50: '#FFDDD6',
                },
                yellury: {
                    100: '#FFAB00',
                    50: '#FFEECC',
                },
                redury: {
                    100: '#CC4526',
                    50: '#E5A292',
                },
            },

            fontFamily: {
                primary: 'Montserrat',
                secondary: 'sans-serif',
            },
            aspectRatio: {
                '9/16': '9 / 16',
            },
        },
        minWidth: {
            '1/2': '50%',
        },
        ripple: (theme) => ({
            colors: theme('colors'),
        }),
    },
    plugins: [require('tailwindcss-ripple')()],
};
