import { writable } from 'svelte/store';
import themesData from './themes.json';

export const themes = themesData.themes;

// Gets the current theme from the user's local storage or defaults to 'cream'
function getStoredTheme() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'cream';
    }
    return 'cream';
}

// Export the current theme for usage in components
export const currentTheme = writable(getStoredTheme());

// Initalize the theme when the app loads
export function initTheme() {
    if (typeof window === 'undefined') return;

    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
}

// This function will set the theme based on the theme name provided
export function setTheme(themeName) {
    if (typeof window === 'undefined') return;

    // Check if the theme exists in the themes object
    const theme = themes[themeName];
    // If the theme does not exist, do nothing
    if (!theme) return;

    // Set the CSS variables for the theme
    // -- This was originally all defined in app.css, but can now be set dynamically
    // -- I originally wanted to add gradient themes, but I could not get it to work.
    const root = document.documentElement;
    root.style.setProperty('--base', theme.colors.base);
    root.style.setProperty('--option', theme.colors.option);
    root.style.setProperty('--highlight', theme.colors.highlight);
    root.style.setProperty('--links', theme.colors.links);

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

    // Store the theme in local storage and update the currentTheme store
    localStorage.setItem('theme', themeName);
    currentTheme.set(themeName);
}