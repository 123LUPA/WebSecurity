import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {SignupService} from "./signup.service";
import {User} from "../../model/User";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private user: User;
  private SignUpS;
  private captcha;


  constructor(signUp : SignupService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.SignUpS = signUp;
    this.toastr.setRootViewContainerRef(vcr);
  }

  signupForm = new FormGroup ({
    companyName: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  });

  signup () {
    this.user={
      companyName: this.signupForm.controls.companyName.value,
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value
    }

    if (this.signupForm.controls.companyName.value && this.signupForm.controls.email.value && this.signupForm.controls.password.value) {

      this.SignUpS.signUserIn(this.user,this.captcha);

    } else {
      this.toastr.error('Fill all the fields');
    }
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    console.log("Captcha"+this.captcha);
  }

  ngOnInit() {
  }

}
