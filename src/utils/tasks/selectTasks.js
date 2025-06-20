import { writable, get } from 'svelte/store';

export const selectedTasks = writable(new Set());
export const selectAll = writable(false);
export const showActionMenu = writable(false);

export function handleSelectAll(currentTasks) {
    const currentSelectAll = get(selectAll);

    if (currentSelectAll) {
      selectedTasks.set(new Set(currentTasks.map(task => task._id))); // Changed from task.id to task._id
    } else {
      selectedTasks.set(new Set());
    }
    updateActionMenu();
}

export function handleTaskSelect(taskId, currentTasks) {
    const currentSelectedTasks = get(selectedTasks);

    if (currentSelectedTasks.has(taskId)) {
      currentSelectedTasks.delete(taskId);
    } else {
      currentSelectedTasks.add(taskId);
    }
    selectedTasks.set(new Set(currentSelectedTasks)); // Trigger reactivity
    selectAll.set(currentSelectedTasks.size === currentTasks.length);
    updateActionMenu();
}

export function updateActionMenu() {
  const currentSelectedTasks = get(selectedTasks);
  showActionMenu.set(currentSelectedTasks.size > 0);
}