import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ForgotService {

  private testUrl = 'http://localhost:3000/';

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router) {}

  forgotPassword(email){
    this.http
      .post(this.testUrl +'forgot', {email: email})
      .subscribe(
        // Successful responses call the first callback.
        data => {

          this.router.navigate(['login']);
          console.log(data);
        },
        // Errors will call this callback instead:
        err => {
          this.push.error('Either password or email was incorrect', 'Login incorrect');
          console.log('Something went wrong!', err);
        }
      );
  }



}
