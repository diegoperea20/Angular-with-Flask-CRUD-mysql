import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITask } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseurl = 'http://127.0.0.1:5000/tasks';

  constructor(private _httpClient: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this._httpClient.get<ITask[]>(this.baseurl);
  }

  addTask(task: ITask): Observable<ITask> {
    return this._httpClient.post<ITask>(this.baseurl, task);
  }

  getTask(id: number): Observable<ITask> {
    return this._httpClient.get<ITask>(`${this.baseurl}/${id}`);
  }

  updateTask(task: ITask): Observable<ITask> {
    return this._httpClient.put<ITask>(`${this.baseurl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<ITask> {
    return this._httpClient.delete<ITask>(`${this.baseurl}/${id}`);
  }
}
