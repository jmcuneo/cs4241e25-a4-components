<script>
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import { handleSubmit, taskDescription, taskDueDate, taskName, taskPriority } from '../utils/tasks.js';

  export let navigateTo;

  function onSubmit(event) {
    handleSubmit(event, navigateTo);
  }
</script>

<!-- Pull the Header component -->
<Header 
  greeting="Welcome to Magnolia! What task would you like to add?" 
  showLogin={false} 
  showRegister={false} 
  showSettings={true}
  authRequired={true}
  {navigateTo} 
/>

<!-- Task Submission Form -->
<form id="taskForm" on:submit={onSubmit}>
  <br>
  <label for="taskName">Task Name<span class="req"> *</span></label>
  <input type="text" id="taskName" bind:value={$taskName} required class="field">
  <br>
  <label for="taskDescription">Task Description<span class="req"> *</span></label>
  <input type="text" id="taskDescription" bind:value={$taskDescription} required class="field">
  <br>
  <label for="taskDueDate">Task Due Date<span class="req"> *</span></label>
  <input type="datetime-local" id="taskDueDate" bind:value={$taskDueDate} required class="field">
  <br>
  <label for="taskPriority">Task Priority<span class="req"> *</span></label>
  <select id="taskPriority" bind:value={$taskPriority} required class="field">
    <option value="" disabled>Select priority</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
  <br>
  <button id="addTask" type="submit">Add Task</button>
</form>

<!-- Pull the Footer component -->
<Footer 
  navigateTo={navigateTo} 
  onHome={true}
  onTasks={false}
/>

<!-- CSS -->
<style>
  option {
    color: var(--option);
    background-color: var(--base);
  }

  /* Swap colors if dark */
  .dark-theme .field,
  .inverted-theme .field {
    color: var(--base);
    background-color: var(--option);
  }

  .field {
    color: var(--option);
    background-color: var(--base);
  }
  .req {
    color: var(--highlight);
    font-size: 1.4em;
    margin-left: 0.2em;
  }
</style>