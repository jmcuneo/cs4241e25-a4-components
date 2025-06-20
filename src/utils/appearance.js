import { writable } from 'svelte/store';

export const themes = {
    radiance: {
        name: 'Radiance',
        class: 'high-contrast-theme',
        colors: {
            base: '#fff',
            option: '#000',
            highlight: '#ff0000',
            links: '#0000ff',
        }
    },
    cream: {
        name: 'Cream',
        class: '',
        colors: {
            base: '#f5eed0',
            option: '#000',
            highlight: '#ff5800',
            links: '#114D9C',
        }
    },
    sunset: {
        name: 'Sunset',
        class: 'sunset-theme',
        colors: {
            base: '#512889',
            option: '#fff',
            highlight: '#ED872D',
            links: '#C66F44'
        }
    },
    charcoal: {
        name: 'Charcoal',
        class: 'dark-theme',
        colors: {
            base: '#1a1a1a',
            option: '#fff',
            highlight: '#ff6b35',
            links: '#4a9eff',
        }
    },
    midnight: {
        name: 'Midnight',
        class: 'inverted-theme',
        colors: {
            base: '#000',
            option: '#f5eed0',
            highlight: '#00a8ff',
            links: '#eb4d2c',
        }
    }
};

function getStoredTheme() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'cream';
    }
    return 'cream';
}

export const currentTheme = writable(getStoredTheme());

export function initTheme() {
    if (typeof window === 'undefined') return;

    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
}

export function applyGradientTheme(themeName, gradientCSS) {
    if (typeof window === 'undefined') return;
    
    // Create or update a style element for gradients
    let gradientStyle = document.getElementById('gradient-theme-styles');
    if (!gradientStyle) {
        gradientStyle = document.createElement('style');
        gradientStyle.id = 'gradient-theme-styles';
        document.head.appendChild(gradientStyle);
    }
    
    if (themeName === 'sunset') {
        gradientStyle.textContent = `
            .sunset-theme {
                background: ${gradientCSS} !important;
                background-attachment: fixed !important;
            }
        `;
    } else {
        gradientStyle.textContent = '';
    }
}

// Update the setTheme function to handle gradients
export function setTheme(themeName) {
    if (typeof window === 'undefined') return;

    const theme = themes[themeName];
    if (!theme) return;

    // Remove existing theme classes
    Object.values(themes).forEach(t => {
        if (t.class) {
            document.documentElement.classList.remove(t.class);
        }
    });

    // Add new theme class
    if (theme.class) {
        document.documentElement.classList.add(theme.class);
    }

    // Handle special gradient themes
    if (themeName === 'sunset') {
        applyGradientTheme(themeName, 'linear-gradient(135deg, #512889 0%, #784072 25%, #9F585B 50%, #C66F44 75%, #ED872D 100%)');
    } else {
        applyGradientTheme('', ''); // Clear gradients for non-gradient themes
    }

    localStorage.setItem('theme', themeName);
    currentTheme.set(themeName);
}