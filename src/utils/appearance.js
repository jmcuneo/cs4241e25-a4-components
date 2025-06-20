import { writable } from 'svelte/store';

export const themes = {
    light: {
        name: 'Light',
        class: '',
        colors: {
            base: '#f5eed0',
            option: '#000',
            highlight: '#ff5800',
            links: '#114D9C',
        }
    },
    dark: {
        name: 'Dark',
        class: 'dark-theme',
        colors: {
            base: '#1a1a1a',
            option: '#fff',
            highlight: '#ff6b35',
            links: '#4a9eff',
        }
    },
    inverted: {
        name: 'Inverted',
        class: 'inverted-theme',
        colors: {
            base: '#000',
            option: '#f5eed0',
            highlight: '#00a8ff',
            links: '#eb4d2c',
        }
    },
    highContrast: {
        name: 'High Contrast',
        class: 'high-contrast-theme',
        colors: {
            base: '#fff',
            option: '#000',
            highlight: '#ff0000',
            links: '#0000ff',
        }
    }
};

function getStoredTheme() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light';
    }
    return 'light';
}

export const currentTheme = writable(getStoredTheme());

export function setTheme(themeName) {
    if (typeof window === 'undefined') return;

    const theme = themes[themeName];

    if (!theme) return;

    Object.values(themes).forEach(t => {
        if (t.class) {
            document.documentElement.classList.remove(t.class);
        }
    });

    if (theme.class) {
        document.documentElement.classList.add(theme.class);
    }

    localStorage.setItem('theme', themeName);
    currentTheme.set(themeName);
}

export function toggleDarkMode() {
    const current = getStoredTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

export function initTheme() {
    if (typeof window === 'undefined') return;

    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
}