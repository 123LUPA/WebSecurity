import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import {routing} from "../Routing";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

import {
  MatFormFieldModule,
  MatListModule, MatInputModule, MatCardModule, MatButtonModule, MatDialogModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HomeComponent } from './pages/home/home.component';
import {AuthGuard} from "./auth-guard";
import { SignupComponent } from './pages/signup/signup.component';
import {SignupService} from "./pages/signup/signup.service";
import { ForgotComponent } from './forgot/forgot.component';
import {ForgotService} from "./forgot/forgot.service";
import { NewComponent } from './new/new.component';
import {NewPasswordService} from "./new/new-password.service";
import { RecaptchaModule } from 'ng-recaptcha';
import {HeaderComponent} from "./components/header.component";
import {LoginService} from "./services/login.service";
import {UserService} from "./services/user.service";
import {HomeService} from "./services/home.service";

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
    NewComponent,
    HeaderComponent
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
  providers: [HomeService,LoginService, SignupService, ForgotService, NewPasswordService, AuthGuard, UserService,
    {provide: ToastOptions, useClass: CustomOption}],
  bootstrap: [AppComponent]
})
export class AppModule { }
