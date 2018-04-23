import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import Config from "../../../app-config";

@Injectable()
export class HomeService {


  private testUrl = Config.nodeApi;

  constructor( private http: HttpClient, private push: ToastsManager,
               private router:Router,private userService: UserService) {


}

  reloadHomePage (token) {

    return new Promise((resolve, reject) =>{
      this.http
        .post(this.testUrl +'', {token: token})
        .subscribe(
          // Successful responses call the first callback.
          user => {

            this.userService.setUser(user);

          },
          error => { // Error
          }
        );
    })
  }


}
