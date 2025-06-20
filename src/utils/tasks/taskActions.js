import { writable, get } from 'svelte/store';

/* Task Modification */

export const showEditModal = writable(false);
export const showDeleteModal = writable(false);
export const editingTask = writable(null);
export const editTaskName = writable('');
export const editTaskDescription = writable('');
export const editTaskDueDate = writable('');
export const editTaskPriority = writable('');

export async function markComplete(selectedTasks, tasks, loadTasks, updateActionMenuFunction) {
    const currentSelectedTasks = get(selectedTasks);
    const currentTasks = get(tasks);

    if (currentSelectedTasks.size !== 1) {
      swal('Error', 'Please select exactly one task to mark as complete.', 'error');
      return;
    }

    const taskId = Array.from(currentSelectedTasks)[0];
    const task = currentTasks.find(t => t._id === taskId); // Changed from t.id to t._id
    
    try {
      const response = await fetch('/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed: !task.completed })
      });

      const result = await response.json();
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

export function editTask(selectedTasks, tasks) {
    const currentSelectedTasks = get(selectedTasks);
    const currentTasks = get(tasks);

    if (currentSelectedTasks.size !== 1) {
      swal('Error', 'Please select exactly one task to edit.', 'error');
      return;
    }

    const taskId = Array.from(currentSelectedTasks)[0];
    const task = currentTasks.find(t => t._id === taskId); // Changed from t.id to t._id
    
    editingTask.set(task);
    editingTask.set(task.taskName);
    editingTask.set(task.taskDescription);
    editingTask.set(task.taskDueDate);
    editingTask.set(task.taskPriority);
    showEditModal.set(true);
  }

  export async function saveEdit(event, loadTasks, selectedTasks, updateActionMenu) {
    event.preventDefault();

    const currentEditingTask = get(editingTask);
    const nameVal = get(editTaskName);
    const descriptionVal = get(editTaskDescription);
    const dueDateVal = get(editTaskDueDate);
    const priorityVal = get(editTaskPriority);
    
    try {
      const response = await fetch('/editTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentEditingTask._id, // Changed from editingTask.id to editingTask._id
          taskName: nameVal,
          taskDescription: descriptionVal,
          taskDueDate: dueDateVal,
          taskPriority: priorityVal
        })
      });

      const result = await response.json();
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

export function deleteTask(selectedTasks) {
    const currentSelectedTasks = get(selectedTasks);

    if (currentSelectedTasks.size === 0) {
      swal('Error', 'Please select at least one task to delete.', 'error');
      return;
    }
    showDeleteModal.set(true);
}

export async function confirmDelete(selectedTasks, loadTasks, selectAll, updateActionMenu) {
    const currentSelectedTasks = get(selectedTasks);

    try {
      const response = await fetch('/deleteTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(currentSelectedTasks) })
      });

      const result = await response.json();
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