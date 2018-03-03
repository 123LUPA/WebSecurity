import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Injectable()
export class LoginService {

   message;

  private testUrl = 'http://localhost:3000/';

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router,
               private userService: UserService) {
  }

  logUserIn (email, pass) {
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
              localStorage.setItem('email',user.email);
              this.router.navigate(['']);
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
    // this.router.navigate(['login']);
    this.userService.setUser(null);
  }

}