<script>
  import { onMount } from 'svelte';
  import { isAuthenticated } from './utils/auth.js';
  import Login from './components/Login.svelte'
  import Register from './components/Register.svelte';
  import Home from './components/Home.svelte';
  import Tasks from './components/Tasks.svelte';

  let currentRoute = '';

  onMount(() => {
    const path = window.location.pathname;
    currentRoute = path === '/' ? (isAuthenticated() ? 'home' : 'login') : path.slice(1);

    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      currentRoute = path === '/' ? (isAuthenticated() ? 'home' : 'login') : path.slice(1);
    });
  });

  function navigateTo(route) {
    currentRoute = route;
    window.history.pushState({}, '', `/${route}`);
  }
</script>

{#if currentRoute === 'login'}
  <Login {navigateTo} />
{:else if currentRoute === 'register'}  
  <Register {navigateTo} />
{:else if currentRoute === 'home'}
  <Home {navigateTo} />
{:else if currentRoute === 'tasks'}
  <Tasks {navigateTo} />
{/if}