/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html', './**/*.html', './js/**/*.js'],
    theme: {
        extend: {
            colors: {
                offBlack: '#161513',
                offWhite: '#FCFCFC',
                outline: '#ECEBEB',
                labelColor: '#5E718E'
            },
        },
    },
    plugins: [],
};