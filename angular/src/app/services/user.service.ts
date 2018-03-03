import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";


@Injectable()
export class UserService {
  private userEmiter: EventEmitter<User> = new EventEmitter();
  user: User;
  constructor( private http: HttpClient) {
  }
  public setUser(user: User){
    this.user = user;
    this.userEmiter.emit(this.user);
  }
}
