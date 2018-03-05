import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import Config from "../../../app-config";
import {Task} from "../model/task";


@Injectable()
export class TaskService {
  private url = Config.nodeApi + 'tasks';
  constructor( private http: HttpClient) {}

  createEvent(task: Task){
   return this.http.post(this.url, task);
  }

}
