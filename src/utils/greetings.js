import { getUserDisplayName } from './auth.js';

export const defaultGreeting = 'Welcome!';

export function getPersonalizedGreeting(baseGreeting = defaultGreeting, displayName = null) {
    // Get display name if not provided
    const name = displayName || getUserDisplayName();
    
    if (name && baseGreeting.includes('{displayName}')) {
        return baseGreeting.replace('{displayName}', name);
    } else if (name) {
        if (baseGreeting.includes('your tasks')) {
            return `Here are your tasks, ${name}!`;
        } else if (baseGreeting.includes('Welcome')) {
            return `Welcome, ${name}!`;
        } else {
            return `${baseGreeting.replace('!', '')}, ${name}`;
        }
    } else {
        return baseGreeting;
    }
}

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