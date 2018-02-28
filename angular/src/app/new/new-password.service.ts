import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class NewPasswordService {

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router) {}

  private testUrl = 'http://localhost:3000/';

  changePassword(newPassword,token){
    this.http
      .post(this.testUrl +'users/reset/'+ token, {password: newPassword}, )
      .subscribe(
        // Successful responses call the first callback.
        data => {


            this.push.success('Password Succesfully changed');

            this.router.navigate(['login']);

        },
        // Errors will call this callback instead:
        err => {
          this.push.error('Something went wrong');
        }
      );
}

}
