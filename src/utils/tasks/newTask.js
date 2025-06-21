import { writable, get } from 'svelte/store';
import swal from 'sweetalert';

/* Add New Task */
export const taskName = writable('');
export const taskDescription = writable('');
export const taskDueDate = writable('');
export const taskPriority = writable('');

// Adding a new task
export async function handleSubmit(event, navigateTo) {
    event.preventDefault();

    // Get the values from the writable stores
    const nameVal = get(taskName);
    const descriptionVal = get(taskDescription);
    const dueDateVal = get(taskDueDate);
    const priorityVal = get(taskPriority);
    
    // If any of the fields are empty, show an error message
    if (!nameVal || !descriptionVal || !dueDateVal || !priorityVal) {
      swal('Error', 'All fields are required.', 'error');
      return;
    }

    // Store the task data in an object
    const data = {
      taskName: nameVal,
      taskDescription: descriptionVal,
      taskDueDate: dueDateVal,
      taskPriority: priorityVal
    };

    try {
      // Call the /submit endpoint to submit the task
      const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // Wait for the response
      const result = await response.json();
      
      // If successful, show a success message and reset the form
      if (result.status === 'success') {
        swal('Task Submitted', 'Your task has been successfully submitted!', 'success')
          .then(() => {
            // Reset form
            taskName.set('');
            taskDescription.set('');
            taskDueDate.set('');
            taskPriority.set('');
            // Navigate to the tasks page
            navigateTo('tasks');
          });
      } else {
        swal('Error', result.message || 'Failed to submit task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to submit task. Please try again.', 'error');
    }
}