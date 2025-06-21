<script>
    export let navigateTo;
    export let onHome = false;
    export let onTasks = false;

    import { addNewTasks } from '../utils/tasks.js';

    function handleAddNewTasks() {
        addNewTasks(navigateTo);
    }

    function handleViewTasks() {
      navigateTo('tasks');
    }
</script>

<!-- Footer Contents -->
<footer class="app-footer">
  <hr class="footer-divider">
  <div class="footer-content">
    <span class="footer-title">Magnolia Task Manager</span>
    {#if onHome}
      <span class="separator">|</span>
      <button class="footer-button" on:click={handleViewTasks}>View Your Tasks</button>
    {/if}
    {#if onTasks}
        <span class="separator">|</span>
        <button class="footer-button" on:click={handleAddNewTasks}>Add New Tasks</button>
    {/if}
  </div>
  <div class="footer-credits">
    <small>Made as apart of CS4241</small>
  </div>
</footer>

<!-- CSS -->
<style>
    .footer-divider {
        border: none;
        height: 1px;
        background-color: var(--option);
        margin: 0 0 1rem 0;
        opacity: 0.3;
    }

    .footer-content {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
    }

    .footer-title {
        color: var(--option);
        font-weight: bold;
    }

    .separator {
        margin: 0 15px;
        color: var(--option);
    }

    .footer-button {
        background: none;
        border: 1px solid var(--links);
        color: var(--option);
        font-weight: bold;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s ease;
    }

    .footer-button:hover {
        background-color: var(--highlight);
        border-color: var(--highlight);
        color: var(--base);
    }

    .footer-credits {
        text-align: center;
        color: var(--option);
        opacity: 0.7;
    }

    .footer-credits small {
        color: var(--option);
    }
</style>