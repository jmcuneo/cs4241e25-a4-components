<script>
  import Header from './Header.svelte';
  import swal from 'sweetalert';

  export let navigateTo;

  // Form data
  let taskName = '';
  let taskDescription = '';
  let taskDueDate = '';
  let taskPriority = '';

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!taskName || !taskDescription || !taskDueDate || !taskPriority) {
      swal('Error', 'All fields are required.', 'error');
      return;
    }

    const data = {
      taskName,
      taskDescription,
      taskDueDate,
      taskPriority
    };

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        swal('Task Submitted', 'Your task has been successfully submitted!', 'success')
          .then(() => {
            // Reset form
            taskName = '';
            taskDescription = '';
            taskDueDate = '';
            taskPriority = '';
            navigateTo('tasks');
          });
      } else {
        swal('Error', result.message || 'Failed to submit task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to submit task. Please try again.', 'error');
    }
  }
</script>

<Header greeting="Welcome to Magnolia! What task would you like to add?" showLogout={true} showLogin={false} showRegister={false} showSettings={true} {navigateTo} />

<!-- Task Submission Form -->
<form id="taskForm" on:submit={handleSubmit}>
  <br>
  <label for="taskName">Task Name<span class="req"> *</span></label>
  <input type="text" id="taskName" bind:value={taskName} required class="field">
  <br>
  <label for="taskDescription">Task Description<span class="req"> *</span></label>
  <input type="text" id="taskDescription" bind:value={taskDescription} required class="field">
  <br>
  <label for="taskDueDate">Task Due Date<span class="req"> *</span></label>
  <input type="datetime-local" id="taskDueDate" bind:value={taskDueDate} required class="field">
  <br>
  <label for="taskPriority">Task Priority<span class="req"> *</span></label>
  <select id="taskPriority" bind:value={taskPriority} required class="field">
    <option value="" disabled>Select priority</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
  <br>
  <button id="addTask" type="submit">Add Task</button>
</form>

<footer>
  <hr>
  <p>
    Magnolia Task Manager - View your <a href="/tasks" on:click|preventDefault={() => navigateTo('tasks')}>tasks</a>.
  </p>
  <p>
    <small>CS4241 Assignment 3</small>
  </p>
</footer>