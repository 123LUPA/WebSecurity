import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import {routing} from "../Routing";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

import {
  MatFormFieldModule, MatListModule,
  MatInputModule, MatCardModule, MatButtonModule,
  MatDialogModule, MatProgressSpinnerModule
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
import {HeaderComponent} from "./components/header/header.component";
import {LoginService} from "./services/login.service";
import {UserService} from "./services/user.service";
import {CreateComponentOptions} from "@angular/core/src/render3/component";
import {CreateTaskComponent} from "./pages/create-task/create-task.component";
import {TaskService} from "./services/task.service";
import {HomeService} from "./services/home.service";
import {ShareTaskComponent} from "./pages/share-task/share-task.component";
import {ShareTaskService} from "./services/shareTask.service";
import {ImageUploadModule} from "angular2-image-upload";
import {ProfileComponent} from "./pages/profile/profile.component";
import {AdminComponent} from "./pages/admin/admin.component";
import {UsersService} from "./services/users.service";
import {UpdateComponent} from "./pages/update/update.component";
import { SafePipe } from './safe.pipe';

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
    HeaderComponent,
    CreateTaskComponent,
    ShareTaskComponent,
    ProfileComponent,
    AdminComponent,
    SafePipe,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastModule.forRoot(
    ),
    ImageUploadModule.forRoot(),
    RecaptchaModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatButtonModule,
    routing,
    MatDialogModule,

  ],
  providers: [HomeService, LoginService, SignupService, ForgotService, NewPasswordService,
    AuthGuard, UserService, TaskService, ShareTaskService, UsersService,
    {provide: ToastOptions, useClass: CustomOption}],
  bootstrap: [AppComponent]
})
export class AppModule { }
