<script>
    import { onMount } from 'svelte';
    import { getUserDisplayName } from '../utils/auth.js';
    import swal from 'sweetalert';

    export let greeting = 'Welcome!';
    export let showLogout = true;
    export let showRegister = false;
    export let showLogin = false;
    export let showSettings = true;
    export let navigateTo;

    let displayName = '';
    let settingsVisible = false;
    let baseGreeting = '';

    function genGreeting(displayName, greeting) {
        if (displayName && greeting.includes('{displayName}')) {
            return greeting.replace('{displayName}', displayName);
        } else if (displayName) {
            // If we have a display name but no placeholder, prepend it
            return `Welcome, ${displayName}, to Magnolia. ${greeting.replace(/^Welcome[^!]*!?\s*/, '')}`;
        } else {
            return greeting;
        }
    }

    onMount(() => {
        displayName = getUserDisplayName();
    });

    $: baseGreeting = genGreeting(displayName, greeting);

    function toggleSettings(e) {
        e.stopPropagation();
        settingsVisible = !settingsVisible;
    }

    function closeSettings() {
        settingsVisible = false;
    }

    async function changeDisplayName() {
        const currentName = getUserDisplayName() || '';
        const newName = prompt('Enter your new display name:', currentName);
    
        if (newName && newName.trim() && newName !== currentName) {
            try {
                const res = await fetch('/updateDisplayName', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayName: newName.trim() })
                });
                const result = await res.json();
        
                if (result.status === 'success') {
                    document.cookie = `displayName=${encodeURIComponent(newName.trim())}; path=/`;
                    swal('Success', 'Display name updated successfully!', 'success')
                        .then(() => location.reload());
                } else {
                    swal('Error', 'Failed to update display name. Please try again.', 'error');
                }
            } catch (error) {
                swal('Error', 'Failed to update display name. Please try again.', 'error');
            }
        }
    }

    function logout() {
        window.location.href = '/logout';
    }
</script>

<svelte:window on:click={closeSettings} />

<!-- Settings Menu -->
{#if showSettings}
<div id="settings">
  <button id="btn" on:click={toggleSettings}>
    <span role="img" aria-label="Settings" style="font-size: 24px;">&#9881;</span>
  </button>
  {#if settingsVisible}
    <div 
      id="settingsMenu" 
      style="display: block;" 
      role="menu"
      tabindex="-1"
      on:click|stopPropagation
      on:keydown|stopPropagation
    >
      <button id="displayName" class="pure-button" on:click={changeDisplayName}>
        Change Display Name
      </button>
    </div>
  {/if}
</div>
{/if}

<!-- Header of the page -->
<header>
  <div id="header-logo" style="display: flex; align-items: center;">
    <img id="logo" src="src/assets/Magnolia.png" alt="Magnolia" style="height: 50px; width: auto; margin-right: 10px;">
    <h1>Magnolia</h1>
  </div>
  <div style="display: flex; align-items: center;">
    <span id="greeting" style="margin-right: 20px;">
      {baseGreeting}
      {#if showRegister}
        Please log in or <a href="/register" on:click|preventDefault={() => navigateTo && navigateTo('register')}>register</a> to continue
    {/if}
    {#if showLogin}
        If you already have an account, please <a href="/login" on:click|preventDefault={() => navigateTo && navigateTo('login')}>login</a> to continue.
    {/if}
    </span>
    {#if showLogout}
        <button id="logoutBtn" style="background-color: #ff5800; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" on:click={logout}>
            Logout
        </button>
    {/if}
  </div>
</header>
<hr>