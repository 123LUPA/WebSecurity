import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, OnInit} from "@angular/core";
import Config from "../../../app-config";
import {Board} from "../model/board";
import {Task} from "../model/task";


@Injectable()
export class ShareTaskService{

  private testUrl = Config.nodeApi+'shareTask/';

  private headers = new HttpHeaders();

  constructor( private http: HttpClient) {
    }

  shareTaskWith(board:Board){
    this.headers = this.headers.set('X-Access-Token', localStorage.getItem('token'));

      return new Promise((resolve, reject) =>{
        this.http
          .post(this.testUrl+board.taskId, board,{headers: this.headers} )
          .subscribe(
            // Successful responses call the first callback.
            data => {

              console.log(data);
            },
            error => { // Error
              reject(error);
            }
          );
      })
    }


  getFriendRequest() {
    return new Promise((resolve, reject) =>{
      let token = localStorage.getItem('token');
      if (token) {
        this.headers = this.headers.set('X-Access-Token', token);
        this.http
          .get(this.testUrl + 'requests', {headers: this.headers})
          .subscribe(
            // Successful responses call the first callback.
            requesterName => {

              console.log(requesterName);
              resolve(requesterName['companyName']);

            },
            // Errors will call this callback instead:
            err => {

              console.log('Something went wrong!', err);
            }
          );
      }

    });

  }

  }
