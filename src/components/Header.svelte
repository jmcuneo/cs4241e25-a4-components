<script>
    import { onMount } from 'svelte';
    import { getUserDisplayName } from '../utils/auth.js';
    import * as greetings from '../utils/greetings.js';
    import Settings from './Settings.svelte';
    import { currentTheme } from '../utils/appearance.js';

    export let greeting = '';
    export let showRegister = false;
    export let showLogin = false;
    export let showSettings = true;
    export let authRequired = false;
    export let navigateTo;

    let displayName = '';
    let currentGreeting = '';
    let settingsComponent;

    // Set the logo path based on theme (if a dark theme use Magnolia-white, otherwise use Magnolia)
    $: logoPath = ($currentTheme === 'charcoal' || $currentTheme === 'midnight')
      ? '/media/Magnolia-white.png'
      : '/media/Magnolia.png'

    // Get the greeting when the component is nounted
    onMount(() => {
      // Get the user's display name
        displayName = getUserDisplayName();
        // Update their greeting based on greetings.js
        updateGreeting();
    })

    // Function to update the greeting. Use personalized if possible, otherwise default to time-based greeting
    function updateGreeting() {
        if (greeting) {
            currentGreeting = greetings.getPersonalizedGreeting(greeting, displayName);
        } else {
          // This should never happen, as it would only occur if a non-logged in user visits a locked page
            currentGreeting = greetings.getTimeBasedGreeting(displayName)
        }
    }

    // Close settings when clicking outside of the settings component
    function handleSettingsClose() {
        if (settingsComponent) {
            settingsComponent.closeSettings();
        }
    }

    $: if (displayName !== undefined || greeting) {
        updateGreeting();
    }
</script>

<!-- If click outside of settings window, close the settings window -->
<svelte:window on:click={handleSettingsClose} />

<!-- Header of the page -->
<header class="app-header">
  <div class="header-top">
    <div class="header-logo" style="display: flex; align-items: center;">
      <img id="logo" src={logoPath} alt="Magnolia" style="height: 50px; width: auto; margin-right: 10px;">
      <h1>Magnolia</h1>
    </div>

    <!-- Settings Menu -->
    {#if showSettings}
      <div class="settings-container">
        <Settings bind:this={settingsComponent} {authRequired}/>
      </div>
    {/if}
  </div>

  <!-- Greetings -->
  <div class="header-greeting" style="display: flex; align-items: center;">
    <span class="greeting">
      {currentGreeting}
      <!-- For non-authenticated pages, allows for registration and logging in -->
      {#if showRegister}
        or <a href="/register" on:click|preventDefault={() => navigateTo && navigateTo('register')}>register</a> here
    {/if}
    {#if showLogin}
        If you already have an account, please <a href="/login" on:click|preventDefault={() => navigateTo && navigateTo('login')}>login</a> to continue.
    {/if}
    </span>
  </div>
</header>
<hr class="header-divider">

<!-- CSS -->
<style>
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .header-logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .header-logo h1 {
    margin: 0;
    margin-left: 10px;
    color: var(--option);
    font-size: 1.8rem;
  }

  #logo {
    height: 50px;
    width: auto;
  }

  .settings-container {
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .header-greeting {
    margin-top: 0.5rem;
    width: 100%;
  }

  .greeting {
    color: var(--option);
    font-size: 1rem;
    line-height: 1.4;
    display: block;
  }

  .greeting a {
    color: var(--links);
    text-decoration: none;
  }

  .greeting a:hover {
    color: var(--highlight);
    text-decoration: underline;
  }

  .header-divider {
    border: none;
    height: 1px;
    background-color: var(--option);
    margin: 0;
    opacity: 0.3;
  }

  /* Desktop layout - greeting on the same line */
  @media (min-width: 768px) {
    .app-header {
      padding: 1rem 0;
    }
    
    .header-top {
      align-items: center;
    }
    
    .header-greeting {
      margin-top: 0;
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .greeting {
      font-size: 1rem;
    }
    
    .header-logo h1 {
      font-size: 1.8rem;
    }
  }

  /* Large desktop layout - more spacing */
  @media (min-width: 1024px) {
    
    .greeting {
      font-size: 1.1rem;
    }
    
    .header-logo h1 {
      font-size: 2rem;
    }
  }

  /* Small mobile devices */
  @media (max-width: 480px) {
    .app-header {
      padding: 0.75rem;
    }
    
    .header-logo h1 {
      font-size: 1.5rem;
      margin-left: 8px;
    }
    
    #logo {
      height: 40px;
    }
    
    .greeting {
      font-size: 0.9rem;
    }
    
    .header-greeting {
      margin-top: 0.75rem;
    }
  }

  /* Very small devices */
  @media (max-width: 320px) {
    .header-logo h1 {
      font-size: 1.3rem;
      margin-left: 6px;
    }
    
    #logo {
      height: 35px;
    }
    
    .greeting {
      font-size: 0.85rem;
    }
  }
</style>