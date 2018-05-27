import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";


@Injectable()
export class UserService {
  public userEmiter: EventEmitter<User> = new EventEmitter();
  user: User;
  constructor( private http: HttpClient) {
  }
  public setUser(user){

    if(user){
      if(!this.user){
        this.user = new User(user.companyName, user.email, user.password, user.image, user.role);
        this.userEmiter.emit(this.user);
      }

    }else{
      console.log('emit user 2 ');
      this.user = user;
      this.userEmiter.emit(this.user);

    }
    //setting user
  }




}
