import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  taskControl: FormControl<string> = this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]);

  createTask(event: Event): void {
    event.preventDefault();
    if (this.taskControl.valid && this.taskControl.value.trim()) {
      this.taskService.addTask(this.taskControl.value);
      this.taskControl.reset();
      this.taskControl.markAsUntouched();
    }
  }
}