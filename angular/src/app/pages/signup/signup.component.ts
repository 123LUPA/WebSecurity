import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  public emailController;
  public passwordController;
  public companyNameController;
  public signupForm: FormGroup;
  private EMAIL_PATTERN = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
  private PASS_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
  private COMPANY_PATTERN = /^[a-zA-Z0-9]{2,}$/;
  public img;
  public imgError;
  public img_url;

  constructor(signUp : SignupService, public toastr: ToastsManager,
              vcr: ViewContainerRef, private formBuilder : FormBuilder) {
    this.SignUpS = signUp;
    this.toastr.setRootViewContainerRef(vcr);
    this.buildForm();
  }
  public onUploadFinished(event) {
    this.img = event;
    this.imgError = false;
    this.SignUpS.saveImage(this.img).subscribe(res => {
      this.img_url = res['imgUrl'];
    }, err => {
      this.imgError = 'Image is too big please upload img smaller than 1mb';
      console.log(err);
    });
  }
  public buildForm(){
    this.signupForm = new FormGroup ({
      companyName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.COMPANY_PATTERN)
      ]),
      email: new FormControl('',[
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.EMAIL_PATTERN)
      ]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.PASS_PATTERN)
      ])
    });
    this.emailController = this.signupForm.get('email');
    this.passwordController = this.signupForm.get('password');
    this.companyNameController = this.signupForm.get('companyName');

  }
  signup () {
    if(this.img){
      this.user={
        companyName: this.signupForm.controls.companyName.value,
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value,
        image: this.img_url,
        role: 'user'
      };
      if (this.signupForm.controls.companyName.value && this.signupForm.controls.email.value && this.signupForm.controls.password.value) {
        this.SignUpS.signUserIn(this.user,this.captcha);
      } else {
        this.toastr.error('Fill all the fields');
      }

    }else{
      this.imgError = 'Please upload image';
    }

  }
  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }
  ngOnInit() {
  }
  public onRemoved() {
    this.img = null;
    this.imgError = ''
  }

}
