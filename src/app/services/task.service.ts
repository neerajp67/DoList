import { Injectable, signal, effect, inject } from '@angular/core';
import { Task } from '../models/task';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SnackbarService } from './snackbar.service';

const LOCAL_STORAGE_KEY = 'task_list';
const UNDO_DURATION = 5000;
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private snackbarService = inject(SnackbarService);

  private tasks = signal<Task[]>(this.loadTasks());
  private deletedTask: Task | null = null;
  private deletedTaskIndex: number = -1;

  readonly tasks$ = this.tasks.asReadonly();

  constructor() {
    effect(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.tasks()));
      }
    });
  }

  private loadTasks(): Task[] {
    if (typeof localStorage !== 'undefined') {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedTasks ? (JSON.parse(savedTasks) as Task[]) : [];
    }
    return [];
  }

  addTask(text: string): void {
    if (!text.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      done: false
    };
    this.tasks.update(currentTasks => [newTask, ...currentTasks]);
  }

  toggleDone(id: number): void {
    this.tasks.update(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  deleteTask(id: number): void {
    let itemToDelete: Task | null = null;

    this.tasks.update(currentTasks => {
      const index = currentTasks.findIndex(task => task.id === id);
      if (index === -1) return currentTasks;

      // Save the item and its index temporarily
      itemToDelete = currentTasks[index];
      this.deletedTask = itemToDelete;
      this.deletedTaskIndex = index;

      return currentTasks.filter(task => task.id !== id);
    });

    if (itemToDelete) {
      this.snackbarService.showUndo(
        'Item deleted.',
        () => this.undoDelete(),
        UNDO_DURATION
      );
    }
  }

  private undoDelete(): void {
    if (this.deletedTask) {
      this.tasks.update(currentTasks => {
        const newList = [...currentTasks];
        // Re-insert the item at its original position
        newList.splice(this.deletedTaskIndex, 0, this.deletedTask!);
        return newList;
      });
    }
    this.deletedTask = null;
    this.deletedTaskIndex = -1;
  }

  swapTasks(previousIndex: number, currentIndex: number): void {
    this.tasks.update(currentTasks => {
      const reorderedList = [...currentTasks];
      moveItemInArray(reorderedList, previousIndex, currentIndex);
      return reorderedList;
    });
  }
}
