import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [DragDropModule,
    DatePipe
  ], templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks$;

  handleToggle(taskId: number): void { this.taskService.toggleDone(taskId); }

  handleDelete(taskId: number): void { this.taskService.deleteTask(taskId); }

  handleDrop(event: any): void {
    if (event.previousIndex !== event.currentIndex) {
      this.taskService.swapTasks(event.previousIndex, event.currentIndex);
    }
  }
}
