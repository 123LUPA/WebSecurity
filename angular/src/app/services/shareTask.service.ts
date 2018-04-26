import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, OnInit, ViewContainerRef} from "@angular/core";
import Config from "../../../app-config";
import {Board} from "../model/board";
import {Task} from "../model/task";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable()
export class ShareTaskService{

  private testUrl = Config.nodeApi+'shareTask/';
  private headers = new HttpHeaders();
  public tasks: Task[];
  private task:String;

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router) {
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.getFriendsTasks();
    }

  shareTaskWith(board:Board){
    this.headers = this.headers.set('X-Access-Token', Cookie.get("token"));

      return new Promise((resolve, reject) =>{
        this.http
          .post(this.testUrl+board.taskId, board,{headers: this.headers} )
          .subscribe(
            // Successful responses call the first callback.
            data => {
              this.push.success('Task successfully shared!');
              setTimeout(()=>this.router.navigate(['']),1000);
            },
            error => { // Error
              reject(error);
            }
          );
      })
    }

  getFriendsTasks(): void {
    let token = Cookie.get("token");
    if(token){
      this.getTasksForUser(token).subscribe((res: Task[])=>{
        this.tasks = res['tasks'];
      },error =>{

      } );
    }
  }
  getTasksForUser(token){
    let url = this.testUrl + 'requests';
    this.headers = this.headers.set('X-Access-Token', token);
    return this.http.get(url, {headers: this.headers});
  }




}
