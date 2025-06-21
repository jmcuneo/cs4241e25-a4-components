import { writable, get } from 'svelte/store';

export const selectedTasks = writable(new Set());
export const selectAll = writable(false);
export const showActionMenu = writable(false);

// Allows user to select checkbox in the header to select all tasks
export function handleSelectAll(currentTasks) {
    const currentSelectAll = get(selectAll);

    // If all tasks are selected, deselect them; otherwise, select all
    if (currentSelectAll) {
      selectedTasks.set(new Set(currentTasks.map(task => task._id)));
    } else {
      selectedTasks.set(new Set());
    }
    updateActionMenu();
}

// Allows user to select individual tasks by clicking on the checkbox
export function handleTaskSelect(taskId, currentTasks) {
  // Check if the selected task is already in the selectedTasks set
    const currentSelectedTasks = get(selectedTasks);

    // If it is, remove it; otherwise, add it
    if (currentSelectedTasks.has(taskId)) {
      currentSelectedTasks.delete(taskId);
    } else {
      currentSelectedTasks.add(taskId);
    }
    selectedTasks.set(new Set(currentSelectedTasks)); // Trigger reactivity
    selectAll.set(currentSelectedTasks.size === currentTasks.length);
    updateActionMenu();
}

// Updates the visibility of the action menu based on the number of selected tasks
export function updateActionMenu() {
  const currentSelectedTasks = get(selectedTasks);
  showActionMenu.set(currentSelectedTasks.size > 0);
}