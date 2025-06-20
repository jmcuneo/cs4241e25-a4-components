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
    export let navigateTo;

    let displayName = '';
    let currentGreeting = '';
    let settingsComponent;

    $: logoPath = ($currentTheme === 'charcoal' || $currentTheme === 'midnight')
      ? 'src/assets/Magnolia-white.png'
      : 'src/assets/Magnolia.png'

    onMount(() => {
        displayName = getUserDisplayName();
        updateGreeting();
    })

    function updateGreeting() {
        if (greeting) {
            currentGreeting = greetings.getPersonalizedGreeting(greeting, displayName);
        } else {
            currentGreeting = greetings.getTimeBasedGreeting(displayName)
        }
    }

    function handleSettingsToggle(e) {
      if (settingsComponent) {
        settingsComponent.toggleSettings(e);
      }
    }

    function handleSettingsClose() {
        if (settingsComponent) {
            settingsComponent.closeSettings();
        }
    }

    $: if (displayName !== undefined || greeting) {
        updateGreeting();
    }
</script>

<svelte:window on:click={handleSettingsClose} />

<!-- Header of the page -->
<header class="app-header">
  <div class="header-top">
    <div class="header-logo" style="display: flex; align-items: center;">
      <img id="logo" src={logoPath} alt="Magnolia" style="height: 50px; width: auto; margin-right: 10px;">
      <h1>Magnolia</h1>
    </div>

    {#if showSettings}
      <div class="settings-container">
        <Settings bind:this={settingsComponent}/>
      </div>
    {/if}
  </div>

  <div class="header-greeting" style="display: flex; align-items: center;">
    <span class="greeting">
      {currentGreeting}
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

<style>
  .app-header {
    background-color: var(--base);
    color: var(--option);
    padding: 1rem;
  }

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