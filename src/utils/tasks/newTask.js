import { writable, get } from 'svelte/store';
import swal from 'sweetalert';

/* Add New Task */
export const taskName = writable('');
export const taskDescription = writable('');
export const taskDueDate = writable('');
export const taskPriority = writable('');

export async function handleSubmit(event, navigateTo) {
    event.preventDefault();

    const nameVal = get(taskName);
    const descriptionVal = get(taskDescription);
    const dueDateVal = get(taskDueDate);
    const priorityVal = get(taskPriority);
    
    if (!nameVal || !descriptionVal || !dueDateVal || !priorityVal) {
      swal('Error', 'All fields are required.', 'error');
      return;
    }

    const data = {
      taskName: nameVal,
      taskDescription: descriptionVal,
      taskDueDate: dueDateVal,
      taskPriority: priorityVal
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
            taskName.set('');
            taskDescription.set('');
            taskDueDate.set('');
            taskPriority.set('');
            navigateTo('tasks');
          });
      } else {
        swal('Error', result.message || 'Failed to submit task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to submit task. Please try again.', 'error');
    }
}