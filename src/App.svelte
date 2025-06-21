<script>
  import { onMount } from 'svelte';
  import { isAuthenticated } from './utils/auth.js';
  import Login from './components/Login.svelte'
  import Register from './components/Register.svelte';
  import Home from './components/Home.svelte';
  import Tasks from './components/Tasks.svelte';

  let currentRoute = '';

  // On mounting the app, determine the current route
  onMount(() => {
    // If the user is authenticated, set the initial route to 'home', otherwise to 'login'
    const path = window.location.pathname;
    currentRoute = path === '/' ? (isAuthenticated() ? 'home' : 'login') : path.slice(1);

    // Listen for popstate events to handle browser navigation
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      currentRoute = path === '/' ? (isAuthenticated() ? 'home' : 'login') : path.slice(1);
    });
  });

  // Function to navigate to a specific route
  function navigateTo(route) {
    currentRoute = route;
    window.history.pushState({}, '', `/${route}`);
  }
</script>

<!-- Route Navigation Tree -->
{#if currentRoute === 'login'}
  <Login {navigateTo} />
{:else if currentRoute === 'register'}  
  <Register {navigateTo} />
{:else if currentRoute === 'home'}
  <Home {navigateTo} />
{:else if currentRoute === 'tasks'}
  <Tasks {navigateTo} />
{/if}