export * from './tasks/newTask.js';
export * from './tasks/fetchTask.js';
export * from './tasks/selectTasks.js';
export * from './tasks/taskActions.js';

import { get } from 'svelte/store';
// Import all of the functions from utils/tasks/*.js
import { tasks, loadTasks as loadTasksOriginal } from './tasks/fetchTask.js';
import { selectedTasks, selectAll, handleSelectAll as handleSelectAllOriginal, handleTaskSelect as handleTaskSelectOriginal, updateActionMenu } from './tasks/selectTasks.js';
import { 
    markComplete as markCompleteOriginal, 
    editTask as editTaskOriginal, 
    saveEdit as saveEditOriginal,
    deleteTask as deleteTaskOriginal,
    confirmDelete as confirmDeleteOriginal
} from './tasks/taskActions.js';

export const loadTasks = loadTasksOriginal;

/*
    Allow of the below functions are wrappers that handle dependencies needed for the original functions.
    This is only required because functions are not in the same file anymore.
*/
export function handleSelectAll() {
    const currentTasks = get(tasks);
    return handleSelectAllOriginal(currentTasks);
}

export function handleTaskSelect(taskId) {
    const currentTasks = get(tasks);
    return handleTaskSelectOriginal(taskId, currentTasks);
}

export function markComplete() {
    return markCompleteOriginal(selectedTasks, tasks, loadTasksOriginal, updateActionMenu);
}

export function editTask() {
    return editTaskOriginal(selectedTasks, tasks);
}

export function saveEdit(event) {
    return saveEditOriginal(event, loadTasksOriginal, selectedTasks, updateActionMenu);
}

export function deleteTask() {
    return deleteTaskOriginal(selectedTasks);
}

export function confirmDelete() {
    return confirmDeleteOriginal(selectedTasks, selectAll, loadTasksOriginal, updateActionMenu);
}

export function addNewTasks(navigateTo) {
    navigateTo('home');
}