import { getUserDisplayName } from './auth.js';

export const defaultGreeting = 'Welcome!';

// Get personalised greeting based on the user's display name and the current context
export function getPersonalizedGreeting(baseGreeting = defaultGreeting, displayName = null) {
    // Get display name if not provided
    const name = displayName || getUserDisplayName();
    
    // Replace the placeholder with the user's display name if it exists
    if (name && baseGreeting.includes('{displayName}')) {
        return baseGreeting.replace('{displayName}', name);
    } else if (name) {
        // Otherwise, specific phrase for /tasks
        if (baseGreeting.includes('your tasks')) {
            return `Here are your tasks, ${name}!`;
        }
        // Specific phrase for /home 
        else if (baseGreeting.includes('Welcome')) {
            return `Welcome, ${name}!`;
        }
        // Generic case 
        else {
            return `${baseGreeting.replace('!', '')}, ${name}`;
        }
    } else {
        return baseGreeting;
    }
}

// Get a time-based greeting based on the current hour and user's display name
// This should never be seen, as the user should always have a display name if on a page that this would be called on
export function getTimeBasedGreeting(displayName = null) {
    const hour = new Date().getHours();
    const name = displayName || getUserDisplayName();
    const nameText = name ? `, ${name}` : '';
    
    if (hour < 12) {
        return `Good morning${nameText}!`;
    } else if (hour < 18) {
        return `Good afternoon${nameText}!`;
    } else {
        return `Good evening${nameText}!`;
    }
}

// Get a contextual greeting based on the current page or context
export function getContextualGreeting(context = 'default', displayName = null) {
    const name = displayName || getUserDisplayName();
    const nameText = name ? `, ${name}` : '';
    
    const contextGreetings = {
        default: `Welcome${nameText}!`,
        home: `Welcome${nameText}! What task would you like to add?`,
        tasks: `Here are your tasks${nameText}!`,
        login: 'Please log in to continue',
        register: 'Create an account to get started'
    };
    
    return contextGreetings[context] || contextGreetings.default;
}

// Export a simple function that components can call
export function generateGreeting(baseGreeting, context = 'default') {
    const displayName = getUserDisplayName();
    
    if (baseGreeting) {
        return getPersonalizedGreeting(baseGreeting, displayName);
    } else {
        return getContextualGreeting(context, displayName);
    }
}