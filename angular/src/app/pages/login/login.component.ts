import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {async} from "rxjs/scheduler/async";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  LoginService;
  message;
  warningShow:boolean;

  loginForm = new FormGroup ({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor( lg : LoginService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.LoginService = lg;
    this.toastr.setRootViewContainerRef(vcr);
    this.warningShow = true;
    this.setTestValues();
  }


  setTestValues(){
    this.loginForm.controls.email.setValue('krys@krys.com');
    this.loginForm.controls.password.setValue('Master1');


  }

  login () {
    this.warningShow = true;
    //check if email and passord have value
    if (this.loginForm.controls.email.value && this.loginForm.controls.password.value) {
      //then log in user
      this.message = this.LoginService.logUserIn(this.loginForm.controls.email.value,
        this.loginForm.controls.password.value).then(value => {
          if(value=='Enjoy your token!'){
            this.warningShow=true;
          }
          this.message=value;
          this.warningShow=false;

      }).catch(error => {

        this.message=error.error;
        this.warningShow=false;

      });

    } else {
      this.toastr.error("Fill all the fields");
    }
  }



}
