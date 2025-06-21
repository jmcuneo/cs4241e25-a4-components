import { writable, get } from 'svelte/store';
import swal from 'sweetalert';

export const tasks = writable([]);
export const deadlineMap = writable({});

// Load the tasks from the server
export async function loadTasks() {
  console.log('Loading tasks...');
  try {
    // Fetch tasks from the server
    const response = await fetch('/entries');
    // Check if the response was successful
    if (response.ok) {
      const data = await response.json();
      // Set the tasks store based on response data. Was inconsistent when initially writing, thus this jankiness
      if (Array.isArray(data)) {
        tasks.set(data);
      } else if (data.status === 'success' && data.tasks) {
        tasks.set(data.tasks);
      } else if (data.status === 'success' && Array.isArray(data.data)) {
        tasks.set(data.data);
      } else {
        console.error('Unexpected data format:', data);
        tasks.set([]);
      }
      // Update deadlines after loading tasks
      updateDeadlines();
    } else {
      console.error('Failed to load tasks:', response.status, response.statusText);
      swal('Error', 'Failed to load tasks.', 'error');
    }
  } catch (error) {
      swal('Error', 'Failed to load tasks. Please try again.', 'error');
  }
}

// Function to dynamically update deadlines for each task
export function updateDeadlines() {
    // Get the current time and date
    const now = new Date();
    // Get all of the tasks that exist
    const currentTasks = get(tasks);
    // Create a new map to hold the deadlines
    const newDeadlineMap = {};
    // For every task, calculate the time difference between now and the task's due date
    currentTasks.forEach(task => {
      // Store the tasks due date in a date object
      const dueDate = new Date(task.taskDueDate);
      // Compare the tasks due date with the current time
      const timeDiff = dueDate.getTime() - now.getTime();
      
      // If the difference is negative (ie now is past the due date), set the deadline to 'Overdue'
      if (timeDiff < 0) {
        newDeadlineMap[task._id] = 'Overdue';
      } else {
        // Otherwise, calculate the days, hours, and minutes remaining
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          newDeadlineMap[task._id] = `${days}d ${hours}h`;
        } else if (hours > 0) {
          newDeadlineMap[task._id] = `${hours}h ${minutes}m`;
        } else {
          newDeadlineMap[task._id] = `${minutes}m`;
        }
      }
    });

    // And set the deadline map store with the new deadlines
    deadlineMap.set(newDeadlineMap);
}