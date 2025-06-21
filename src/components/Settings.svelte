<script>
    import { getUserDisplayName } from "../utils/auth";
    import swal from 'sweetalert';
    import { fade, fly } from 'svelte/transition';
    import { themes, currentTheme, setTheme } from '../utils/appearance.js';

    export let showSettings = true;
    export let settingsVisible = false;
    export let authRequired = false;
    let isHovered = false;

    export function toggleSettings(e) {
        e.stopPropagation();
        settingsVisible = !settingsVisible;
    }

    // Close the settings menu
    export function closeSettings() {
        settingsVisible = false;
    }

    // Essentially the same as in A3
    export async function changeDisplayName() {
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

    // Set the users theme to the selected one, and close the settings menu
    function changeTheme(themeName) {
        setTheme(themeName);
        closeSettings();
    }

    // Logout function
    export async function logout() {
        window.location.href = '/logout';
    }
</script>

{#if showSettings}
    <div id="settings">
        <!-- Most of this is making it so the gear spins :)-->
        <button 
            id="btn" 
            on:click={toggleSettings}
            class:spinny={isHovered}
            class:no-spinny={!isHovered}
            on:mouseover={() => isHovered = true}
            on:mouseout={() => isHovered = false}
            on:focus={() => isHovered = true}
            on:blur={() => isHovered = false}
            aria-haspopup="true"
        >
            <span role="img" aria-label="Settings" style="font-size: 24px;">&#9881;</span>
        </button>
        {#if settingsVisible}
            <div
                id="settingsMenu"
                role="menu"
                style="display: block;"
                tabindex="-1"
                on:click|stopPropagation
                on:keydown|stopPropagation
                transition:fly|local="{{ y: -10, duration: 300 }}"
            >
                <!-- Change display name, must be in authenticated page to do -->
                {#if authRequired}
                    <button id="displayName" class="pure-button" on:click={changeDisplayName}>
                        Change Display Name
                    </button>
                    <hr>
                {/if}

                <!-- Theme Selection, visible on all pages -->
                <div class="theme-selector">
                    <div class="theme-label">Theme:</div>
                    {#each Object.entries(themes) as [key, theme]}
                        <button
                            class="theme-option"
                            class:active={$currentTheme === key}
                            on:click={() => changeTheme(key)}
                        > {theme.name} </button>
                    {/each}
                </div>

                <!-- Logout, must be in authenticated page to do -->
                {#if authRequired}
                    <hr>
                    <button id="logout" class="pure-button" on:click={logout}>
                        Logout
                    </button>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<!-- CSS -->
<style>
    .spinny span {
        animation: spin 4s linear infinite;
        animation-play-state: running;
        display: inline-block;
    }

    .no-spinny span {
        animation: spin 4s linear infinite;
        animation-play-state: paused;
        display: inline-block;
    }


    @keyframes spin {
        from { transform: rotate(0deg); }
        to {transform: rotate(360deg); }
    }

    #btn:hover {
        background: none;
        background-color: none;
    }

    #btn:focus {
        background: none;
        background-color: none;
        outline: none;
    }
</style>