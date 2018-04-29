import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import Config from "../../../app-config";


@Injectable()
export class ForgotService {

  private testUrl = Config.nodeApi;
  private error:boolean = false;

  constructor( private http: HttpClient, private push: ToastsManager, private router:Router) {}

  forgotPassword(email){
    this.http
      .post(this.testUrl +'users/forgot', {email: email})
      .subscribe(
        // Successful responses call the first callback.
        data => {

          this.push.success('Email was send');

        },
        // Errors will call this callback instead:
        err => {

          this.push.error('Something went wrong, check if you spelled your email correctly');
          console.log('Something went wrong!', err);
        }
      );
  }



}
