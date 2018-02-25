import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./app/login/login.component";
import {AuthGuard} from "./app/auth-guard";
import {HomeComponent} from "./app/home/home.component";
import {SignupComponent} from "./app/signup/signup.component";
import {ForgotComponent} from "./app/forgot/forgot.component";
import {NewComponent} from "./app/new/new.component";


const appRoutes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home' , canActivate:[AuthGuard], component: HomeComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset/:token',component: NewComponent },
  { path: '',  redirectTo: '/login', pathMatch: 'full'},


];


export const routing = RouterModule.forRoot(appRoutes, { useHash: true,enableTracing: true} // <-- debugging purposes only
);
