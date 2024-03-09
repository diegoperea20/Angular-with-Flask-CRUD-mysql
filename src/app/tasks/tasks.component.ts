import { Component, OnInit } from '@angular/core';
import { ITask } from '../models/task.model';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  formulario: FormGroup;
  tasksList: ITask[] = [];
  editing: boolean = false;
  editedTaskId: number | null = null;

  constructor(private _apiService: ApiService, private form: FormBuilder) {
    this.formulario = this.form.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._apiService.getTasks().subscribe((data: ITask[]) => {
      this.tasksList = data;
    });
  }

  enviar() {
    if (this.editing && this.editedTaskId !== null) {
      // Si estamos editando, llamamos a updateTask
      const updatedTask: ITask = {
        id: this.editedTaskId,
        title: this.formulario.value.title,
        description: this.formulario.value.description,
      };

      this.updateTask(updatedTask);
    } else {
      // Si no estamos editando, llamamos a addTask
      this._apiService
        .addTask(this.formulario.value)
        .subscribe((data: ITask) => {
          this.tasksList.push(data);
          this.formulario.reset();
        });
    }

    // Restablecer el estado de edición
    this.editing = false;
    this.editedTaskId = null;
  }

  deleteTask(id: number) {
    this._apiService.deleteTask(id).subscribe((data) => {
      this.tasksList = this.tasksList.filter((task) => task.id !== id);
    });
  }

  editTask(task: ITask) {
    // Configurar el formulario con los valores de la tarea seleccionada
    this.formulario.setValue({
      title: task.title,
      description: task.description,
    });

    // Cambiar el texto del botón a "Editando"
    this.editing = true;
    this.editedTaskId = task.id;
  }

  updateTask(task: ITask) {
    this._apiService.updateTask(task).subscribe((data) => {
      this.tasksList = this.tasksList.map((t) => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      });

      // Restablecer el estado de edición
      this.editing = false;
      this.editedTaskId = null;
      this.formulario.reset();
    });
  }
}
