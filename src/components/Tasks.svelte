<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import { 
    tasks, 
    selectedTasks, 
    showActionMenu, 
    showEditModal, 
    showDeleteModal, 
    selectAll, 
    deadlineMap,
    editTaskName,
    editTaskDescription,
    editTaskDueDate,
    editTaskPriority,
    loadTasks,
    handleSelectAll,
    handleTaskSelect,
    markComplete,
    editTask,
    saveEdit,
    deleteTask,
    confirmDelete,
    addNewTasks
  } from '../utils/tasks';

  export let navigateTo;

  onMount(() => {
    loadTasks();
  });

  function handleAddNewTasks() {
    addNewTasks(navigateTo);
  }

  function closeEditModal() {
    showEditModal.set(false);
  }

  function closeDeleteModal() {
    showDeleteModal.set(false);
  }
</script>

<Header 
  greeting="Here are your tasks!" 
  showLogin={false} 
  showRegister={false} 
  showSettings={true} 
  {navigateTo} 
/>

<!-- Task List Table -->
<table class="pure-table pure-table-striped" id="taskList">
  <thead>
    <tr>
      <th><input type="checkbox" bind:checked={$selectAll} on:change={handleSelectAll}></th>
      <th>Task Name</th>
      <th>Description</th>
      <th>Due Date</th>
      <th>Priority</th>
      <th>Deadline</th>
    </tr>
  </thead>
  <tbody>
    {#each $tasks as task (task._id)}
      <tr class:completed={task.completed}>
        <td>
          <input 
            type="checkbox" 
            checked={$selectedTasks.has(task._id)}
            on:change={() => handleTaskSelect(task._id)}
          >
        </td>
        <td class:urgent={task.taskPriority === 'high'}>{task.taskName}</td>
        <td>{task.taskDescription}</td>
        <td>{new Date(task.taskDueDate).toLocaleString()}</td>
        <td class:urgent={task.taskPriority === 'high'}>{task.taskPriority}</td>
        <td class:urgent={$deadlineMap[task._id] === 'Overdue'}>{$deadlineMap[task._id] || 'Calculating...'}</td>
      </tr>
    {/each}
  </tbody>
</table>

<!-- Action Menu -->
{#if $showActionMenu}
  <div id="actionMenu" style="display: flex;">
    <button id="markCompleteBtn" class="pure-button pure-button-primary" on:click={markComplete}>
      Mark Completed
    </button>
    <button id="editBtn" class="pure-button" on:click={editTask}>Edit</button>
    <button id="deleteBtn" class="button-error pure-button" on:click={deleteTask}>Delete</button>
  </div>
{/if}

<!-- Delete Modal -->
{#if $showDeleteModal}
  <div id="deleteModal" style="display: flex;">
    <div id="contents">
      <p>Are you sure you want to delete the selected task(s)?</p>
      <button id="confirmDeleteBtn" class="button-error pure-button" on:click={confirmDelete}>
        Yes, Delete
      </button>
      <button id="cancelDeleteBtn" class="pure-button" on:click={closeDeleteModal}>
        Cancel
      </button>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if $showEditModal}
  <div id="editModal" style="display: flex;">
    <div id="contents">
      <form on:submit={saveEdit}>
        <label>Task Name: <input type="text" bind:value={$editTaskName}></label><br>
        <label>Description: <input type="text" bind:value={$editTaskDescription}></label><br>
        <label>Due Date: <input type="datetime-local" bind:value={$editTaskDueDate}></label><br>
        <label>Priority:
          <select bind:value={$editTaskPriority}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label><br>
        <div class="buttons">
          <button type="submit" class="pure-button pure-button-primary">Save</button>
          <button type="button" class="pure-button" on:click={closeEditModal}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<Footer
  navigateTo={navigateTo} 
  onHome={false}
  onTasks={true}
/>

<style>
  .completed {
    opacity: 0.6;
    text-decoration: line-through;
  }

  td {
    color: var(--option);
  }
</style>