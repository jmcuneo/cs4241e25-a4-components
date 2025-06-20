<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import swal from 'sweetalert';

  export let navigateTo;

  let tasks = [];
  let selectedTasks = new Set();
  let showActionMenu = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectAll = false;

  // Edit form data
  let editingTask = null;
  let editTaskName = '';
  let editTaskDescription = '';
  let editTaskDueDate = '';
  let editTaskPriority = '';

  // Deadline calculations
  let deadlineMap = {};

  onMount(() => {
    loadTasks();
  });

  async function loadTasks() {
    try {
      const response = await fetch('/entries');
      if (response.ok) {
        tasks = await response.json();
        updateDeadlines();
      } else {
        swal('Error', 'Failed to load tasks.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to load tasks.', 'error');
    }
  }

  function updateDeadlines() {
    const now = new Date();
    tasks.forEach(task => {
      const dueDate = new Date(task.taskDueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      
      if (timeDiff < 0) {
        deadlineMap[task._id] = 'Overdue';  // Changed from task.id to task._id
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          deadlineMap[task._id] = `${days}d ${hours}h`;
        } else if (hours > 0) {
          deadlineMap[task._id] = `${hours}h ${minutes}m`;
        } else {
          deadlineMap[task._id] = `${minutes}m`;
        }
      }
    });
  }

  function handleSelectAll() {
    if (selectAll) {
      selectedTasks = new Set(tasks.map(task => task._id)); // Changed from task.id to task._id
    } else {
      selectedTasks = new Set();
    }
    updateActionMenu();
  }

  function handleTaskSelect(taskId) {
    if (selectedTasks.has(taskId)) {
      selectedTasks.delete(taskId);
    } else {
      selectedTasks.add(taskId);
    }
    selectedTasks = selectedTasks; // Trigger reactivity
    selectAll = selectedTasks.size === tasks.length;
    updateActionMenu();
  }

  function updateActionMenu() {
    showActionMenu = selectedTasks.size > 0;
  }

  async function markComplete() {
    if (selectedTasks.size !== 1) {
      swal('Error', 'Please select exactly one task to mark as complete.', 'error');
      return;
    }

    const taskId = Array.from(selectedTasks)[0];
    const task = tasks.find(t => t._id === taskId); // Changed from t.id to t._id
    
    try {
      const response = await fetch('/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed: !task.completed })
      });

      const result = await response.json();
      if (result.status === 'success') {
        loadTasks();
        selectedTasks.clear();
        selectedTasks = selectedTasks;
        updateActionMenu();
        swal('Success', 'Task updated successfully!', 'success');
      } else {
        swal('Error', 'Failed to update task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to update task.', 'error');
    }
  }

  function editTask() {
    if (selectedTasks.size !== 1) {
      swal('Error', 'Please select exactly one task to edit.', 'error');
      return;
    }

    const taskId = Array.from(selectedTasks)[0];
    editingTask = tasks.find(t => t._id === taskId); // Changed from t.id to t._id
    
    editTaskName = editingTask.taskName;
    editTaskDescription = editingTask.taskDescription;
    editTaskDueDate = editingTask.taskDueDate;
    editTaskPriority = editingTask.taskPriority;
    
    showEditModal = true;
  }

  async function saveEdit(event) {
    event.preventDefault();
    
    try {
      const response = await fetch('/editTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTask._id, // Changed from editingTask.id to editingTask._id
          taskName: editTaskName,
          taskDescription: editTaskDescription,
          taskDueDate: editTaskDueDate,
          taskPriority: editTaskPriority
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        showEditModal = false;
        loadTasks();
        selectedTasks.clear();
        selectedTasks = selectedTasks;
        updateActionMenu();
        swal('Success', 'Task updated successfully!', 'success');
      } else {
        swal('Error', 'Failed to update task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to update task.', 'error');
    }
  }

  function deleteTask() {
    if (selectedTasks.size === 0) {
      swal('Error', 'Please select at least one task to delete.', 'error');
      return;
    }
    showDeleteModal = true;
  }

  async function confirmDelete() {
    try {
      const response = await fetch('/deleteTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedTasks) })
      });

      const result = await response.json();
      if (result.status === 'success') {
        showDeleteModal = false;
        loadTasks();
        selectedTasks.clear();
        selectedTasks = selectedTasks;
        selectAll = false;
        updateActionMenu();
        swal('Success', 'Tasks deleted successfully!', 'success');
      } else {
        swal('Error', 'Failed to delete tasks.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to delete tasks.', 'error');
    }
  }

  function addNewTasks() {
    navigateTo('home');
  }
</script>

<Header greeting="Welcome to Magnolia!" showLogout={true} showLogin={false} showRegister={false} showSettings={true} {navigateTo} />

<!-- Task List Table -->
<table class="pure-table pure-table-striped" id="taskList">
  <thead>
    <tr>
      <th><input type="checkbox" bind:checked={selectAll} on:change={handleSelectAll}></th>
      <th>Task Name</th>
      <th>Description</th>
      <th>Due Date</th>
      <th>Priority</th>
      <th>Deadline</th>
    </tr>
  </thead>
  <tbody>
    {#each tasks as task (task._id)}
      <tr class:completed={task.completed}>
        <td>
          <input 
            type="checkbox" 
            checked={selectedTasks.has(task._id)}
            on:change={() => handleTaskSelect(task._id)}
          >
        </td>
        <td class:urgent={task.taskPriority === 'high'}>{task.taskName}</td>
        <td>{task.taskDescription}</td>
        <td>{new Date(task.taskDueDate).toLocaleString()}</td>
        <td class:urgent={task.taskPriority === 'high'}>{task.taskPriority}</td>
        <td class:urgent={deadlineMap[task._id] === 'Overdue'}>{deadlineMap[task._id] || 'Calculating...'}</td>
      </tr>
    {/each}
  </tbody>
</table>

<!-- Action Menu -->
{#if showActionMenu}
  <div id="actionMenu" style="display: flex;">
    <button id="markCompleteBtn" class="pure-button pure-button-primary" on:click={markComplete}>
      Mark Completed
    </button>
    <button id="editBtn" class="pure-button" on:click={editTask}>Edit</button>
    <button id="deleteBtn" class="button-error pure-button" on:click={deleteTask}>Delete</button>
  </div>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal}
  <div id="deleteModal" style="display: flex;">
    <div id="contents">
      <p>Are you sure you want to delete the selected task(s)?</p>
      <button id="confirmDeleteBtn" class="button-error pure-button" on:click={confirmDelete}>
        Yes, Delete
      </button>
      <button id="cancelDeleteBtn" class="pure-button" on:click={() => showDeleteModal = false}>
        Cancel
      </button>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
  <div id="editModal" style="display: flex;">
    <div id="contents">
      <form on:submit={saveEdit}>
        <label>Task Name: <input type="text" bind:value={editTaskName}></label><br>
        <label>Description: <input type="text" bind:value={editTaskDescription}></label><br>
        <label>Due Date: <input type="datetime-local" bind:value={editTaskDueDate}></label><br>
        <label>Priority:
          <select bind:value={editTaskPriority}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label><br>
        <div class="buttons">
          <button type="submit" class="pure-button pure-button-primary">Save</button>
          <button type="button" class="pure-button" on:click={() => showEditModal = false}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Footer -->
<footer>
  <button id="addTask" on:click={addNewTasks}>Add New Tasks</button>
  <hr>
  <p>Magnolia Task Manager</p>
  <p><small>CS4241 Assignment 3</small></p>
</footer>

<style>
  .completed {
    opacity: 0.6;
    text-decoration: line-through;
  }
</style>