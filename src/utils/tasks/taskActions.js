import { writable, get } from 'svelte/store';

/* Task Modification */

export const showEditModal = writable(false);
export const showDeleteModal = writable(false);
export const editingTask = writable(null);
export const editTaskName = writable('');
export const editTaskDescription = writable('');
export const editTaskDueDate = writable('');
export const editTaskPriority = writable('');

// Mark a task as complete or incomplete
export async function markComplete(selectedTasks, tasks, loadTasks, updateActionMenuFunction) {
    // Fetch all of the tasks and selected tasks
    const currentSelectedTasks = get(selectedTasks);
    const currentTasks = get(tasks);

    // Only one task can be selected for marking as complete at a time
    // -- This is because if you try to mark a completed task as incomplete while also marking an incomplete task as complete, it can cause confusion
    if (currentSelectedTasks.size !== 1) {
      swal('Error', 'Please select exactly one task to mark as complete.', 'error');
      return;
    }

    // Get the selected task
    const taskId = Array.from(currentSelectedTasks)[0];
    const task = currentTasks.find(t => t._id === taskId);
    
    try {
      // Call the /complete endpoint
      const response = await fetch('/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed: !task.completed })
      });

      // Wait for the response
      const result = await response.json();
      // If successful, reload tasks and reset selected tasks
      if (result.status === 'success') {
        await loadTasks();
        selectedTasks.set(new Set());
        updateActionMenuFunction();
        swal('Success', 'Task updated successfully!', 'success');
      } else {
        swal('Error', 'Failed to update task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to update task.', 'error');
    }
}

// Edit a task
export function editTask(selectedTasks, tasks) {
    // Fetch all of the tasks and selected tasks
    const currentSelectedTasks = get(selectedTasks);
    const currentTasks = get(tasks);

    // Only one task can be selected for editing at a time
    // -- How would one edit multiple tasks at once?
    if (currentSelectedTasks.size !== 1) {
      swal('Error', 'Please select exactly one task to edit.', 'error');
      return;
    }

    // Get the selected task
    const taskId = Array.from(currentSelectedTasks)[0];
    const task = currentTasks.find(t => t._id === taskId); // Changed from t.id to t._id
    
    // Save the values of the currently selected task to editingTask writable store
    editingTask.set(task);
    editingTask.set(task.taskName);
    editingTask.set(task.taskDescription);
    editingTask.set(task.taskDueDate);
    editingTask.set(task.taskPriority);
    // Show the edit modal
    showEditModal.set(true);
  }

  // Show the edit modal
  export async function saveEdit(event, loadTasks, selectedTasks, updateActionMenu) {
    event.preventDefault();

    // Save the current values of the task being edited to local values
    const currentEditingTask = get(editingTask);
    const nameVal = get(editTaskName);
    const descriptionVal = get(editTaskDescription);
    const dueDateVal = get(editTaskDueDate);
    const priorityVal = get(editTaskPriority);
    
    try {
      // Call the /editTask endpoint to update the task
      const response = await fetch('/editTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentEditingTask._id,
          taskName: nameVal,
          taskDescription: descriptionVal,
          taskDueDate: dueDateVal,
          taskPriority: priorityVal
        })
      });

      // Wait for the response
      const result = await response.json();
      // If successful, reload tasks and reset selected tasks
      if (result.status === 'success') {
        showEditModal.set(false);
        loadTasks();
        selectedTasks.set(new Set());
        updateActionMenu();
        swal('Success', 'Task updated successfully!', 'success');
      } else {
        swal('Error', 'Failed to update task.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to update task.', 'error');
    }
}

// Shows the delete confirmation modal when trying to delete tasks
export function deleteTask(selectedTasks) {
    const currentSelectedTasks = get(selectedTasks);

    if (currentSelectedTasks.size === 0) {
      swal('Error', 'Please select at least one task to delete.', 'error');
      return;
    }
    showDeleteModal.set(true);
}

// Confirm deletion of selected tasks
export async function confirmDelete(selectedTasks, loadTasks, selectAll, updateActionMenu) {
    // Fetch all of the selected tasks
    const currentSelectedTasks = get(selectedTasks);

    try {
      // Call the /deleteTask endpoint to delete the selected tasks
      const response = await fetch('/deleteTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(currentSelectedTasks) })
      });

      // Wait for the response
      const result = await response.json();
      // If successful, reload tasks and reset selected tasks
      if (result.status === 'success') {
        showDeleteModal.set(false);
        loadTasks();
        selectedTasks.set(new Set());
        selectAll.set(false);
        updateActionMenu();
        swal('Success', 'Tasks deleted successfully!', 'success');
      } else {
        swal('Error', 'Failed to delete tasks.', 'error');
      }
    } catch (error) {
      swal('Error', 'Failed to delete tasks.', 'error');
    }
}