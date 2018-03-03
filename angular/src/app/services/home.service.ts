import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Injectable()
export class HomeService {


  private testUrl = 'http://localhost:3000';

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router,private userService: UserService) {
  }

  reloadHomePage (email) {

    return new Promise((resolve, reject) =>{
      this.http
        .post(this.testUrl +'', {email: email})
        .subscribe(
          // Successful responses call the first callback.
          user => {

            this.userService.setUser(user);

          },
          error => { // Error
            this.push.error("The token expired");
            reject(error);
          }
        );
    })
  }


}
