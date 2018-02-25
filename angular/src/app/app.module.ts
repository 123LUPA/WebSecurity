import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {LoginService} from "./login/login";
import {routing} from "../Routing";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

import {
  MatFormFieldModule,
  MatListModule, MatInputModule, MatCardModule, MatButtonModule, MatDialogModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HomeComponent } from './home/home.component';
import {AuthGuard} from "./auth-guard";
import { SignupComponent } from './signup/signup.component';
import {SignupService} from "./signup/signup.service";
import { ForgotComponent } from './forgot/forgot.component';
import {ForgotService} from "./forgot/forgot.service";
import { NewComponent } from './new/new.component';
import {NewPasswordService} from "./new/new-password.service";
import { RecaptchaModule } from 'ng-recaptcha';

export class CustomOption extends ToastOptions {
  showCloseButton = true;
  dismiss: 'click';
  animate: 'flyRight';
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    ForgotComponent,
    NewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastModule.forRoot(
    ),
    RecaptchaModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatButtonModule,
    routing,
    MatDialogModule,

  ],
  providers: [LoginService,SignupService,ForgotService,NewPasswordService,AuthGuard, {provide: ToastOptions, useClass: CustomOption}],
  bootstrap: [AppComponent]
})
export class AppModule { }
