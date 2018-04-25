import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, OnInit} from "@angular/core";
import Config from "../../../app-config";
import {Task} from "../model/task";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class TaskService{

  private url = Config.nodeApi + 'tasks';
  private headers = new HttpHeaders();
  public tasks: Task[];
  private task:String;
  private token = Cookie.get("token");

  constructor( private http: HttpClient) {
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.getTasks();

  }
  getTasks(): void {

    let token = this.token;
    if(token){
      this.getTasksForUser(token).subscribe((res: Task[])=>{
        this.tasks = res['tasks'];
      },error =>{

      } );
    }
  }
  getById(id){
    this.headers = this.headers.set('X-Access-Token', this.token);
    return this.http.get(this.url + '/' + id, {headers: this.headers});

  }
  createEvent(task: Task){
    this.headers = this.headers.set('X-Access-Token', this.token);
   return this.http.post(this.url, task, {headers: this.headers});
  }
  getTasksForUser(token){
    let url = this.url + '/user';
    this.headers = this.headers.set('X-Access-Token', this.token);
    return this.http.get(url, {headers: this.headers});
  }
  deleteTask(taskId){
    let url = this.url + '/' + taskId;

    this.headers = this.headers.set('X-Access-Token', this.token);
    return this.http.delete(url,{headers: this.headers});
  }

  setTask(t){
    this.task=t;

  }
  updateTask(task){
    this.headers = this.headers.set('X-Access-Token', this.token);
    return this.http.put(this.url + '/' + task._id, task,{headers: this.headers});

  }
  getTask():String{
    return this.task;
  }



}
