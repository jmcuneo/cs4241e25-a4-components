import { writable, get } from 'svelte/store';
import swal from 'sweetalert';

export const tasks = writable([]);
export const deadlineMap = writable({});

export async function loadTasks() {
  console.log('Loading tasks...');
  try {
    const response = await fetch('/entries');
    if (response.ok) {
      const data = await response.json();
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
      updateDeadlines();
    } else {
      console.error('Failed to load tasks:', response.status, response.statusText);
      swal('Error', 'Failed to load tasks.', 'error');
    }
  } catch (error) {
      swal('Error', 'Failed to load tasks. Please try again.', 'error');
  }
}

export function updateDeadlines() {
    const now = new Date();
    const currentTasks = get(tasks);
    const newDeadlineMap = {};
    currentTasks.forEach(task => {
      const dueDate = new Date(task.taskDueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      
      if (timeDiff < 0) {
        newDeadlineMap[task._id] = 'Overdue';  // Changed from task.id to task._id
      } else {
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

    deadlineMap.set(newDeadlineMap);
}