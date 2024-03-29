import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import Config from "../../../app-config";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class LoginService {

   message;
  private testUrl = Config.nodeApi;

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router,
               private userService: UserService) {
  }

  logUserIn (email, pass) {
    //log in user in
    return new Promise((resolve, reject) =>{
      this.http
        .post(this.testUrl +'users/login', {email: email, password: pass}, )
        .subscribe(
          // Successful responses call the first callback.
          data => {
            var message = data['message'];
            resolve(message);
            if(data['success']) {
              let token = data['token'];
              let user = data['user'];
              localStorage.setItem('token', token );
              this.router.navigate(['']);
              //seting us
              this.userService.setUser(data['user']);
              resolve(data['message']);
            }
          },
          error => { // Error
            reject(error);
          }
        );
    })
  }

  logout(){
    localStorage.clear();
    this.userService.setUser(null);
    this.router.navigate(['login']);

  }

}
