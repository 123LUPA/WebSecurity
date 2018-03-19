import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, OnInit} from "@angular/core";
import Config from "../../../app-config";
import {Task} from "../model/task";

@Injectable()
export class TaskService{

  private url = Config.nodeApi + 'tasks';
  private headers = new HttpHeaders();
  public tasks: Task[];
  private task:String;

  constructor( private http: HttpClient) {
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.getTasks();

  }
  getTasks(): void {

    let token = localStorage.getItem('token');
    if(token){
      this.getTasksForUser(token).subscribe((res: Task[])=>{
        this.tasks = res['tasks'];
      },error =>{

      } );
    }
  }
  createEvent(task: Task){
    this.headers = this.headers.set('X-Access-Token', localStorage.getItem('token'));
   return this.http.post(this.url, task, {headers: this.headers});
  }
  getTasksForUser(token){
    let url = this.url + '/user';
    this.headers = this.headers.set('X-Access-Token', token);
    return this.http.get(url, {headers: this.headers});
  }
  deleteTask(taskId){
    let url = this.url + '/' + taskId;

    this.headers = this.headers.set('X-Access-Token', localStorage.getItem('token'));
    return this.http.delete(url,{headers: this.headers});
  }

  setTask(t){
    this.task=t;

  }

  getTask():String{
    return this.task;
  }



}
