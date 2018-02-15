import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
@Injectable()
export class SignupService {

  private testUrl = 'http://localhost:3000/';

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router) {}

  signUserIn (User,captcha) {

    this.http
      .post(this.testUrl +'signup', {companyName: User.companyName,email: User.email, password: User.password,captcha:captcha}, )
      .subscribe(
        // Successful responses call the first callback.
        data => {

          if(data['success']) {

            this.router.navigate(['login']);
          }
          console.log(data);
        },
        // Errors will call this callback instead:
        err => {
          this.push.error('Something went wrong');
          console.log('Something went wrong!', err);
        }
      );}

}
