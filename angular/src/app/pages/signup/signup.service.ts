import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Router} from "@angular/router";
import Config from "../../../../app-config";

@Injectable()
export class SignupService {

  private testUrl = Config.nodeApi;
  constructor( private http: HttpClient, private push: ToastsManager, private router:Router) {}

  signUserIn (User,captcha) {


    this.http
      .post(this.testUrl +'users/signup', {companyName: User.companyName,email: User.email,
        password: User.password, image: User.image,captcha:captcha}, )
      .subscribe(
        // Successful responses call the first callback.
        data => {

          this.router.navigate(['login']);
        },
        // Errors will call this callback instead:
        err => {
          this.push.error('Something went wrong');
        }
      );}
    saveImage(img) {
    const url = this.testUrl + 'users/image';
    return this.http.post(url, {src: img.src});
  }

}
