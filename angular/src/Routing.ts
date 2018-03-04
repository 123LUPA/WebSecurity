import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./app/pages/login/login.component";
import {AuthGuard} from "./app/auth-guard";
import {HomeComponent} from "./app/pages/home/home.component";
import {SignupComponent} from "./app/pages/signup/signup.component";
import {ForgotComponent} from "./app/forgot/forgot.component";
import {NewComponent} from "./app/new/new.component";
import {CreateTaskComponent} from "./app/components/create-task/create-task.component";


const appRoutes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '' , component: HomeComponent},
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset/:token',component: NewComponent },
  {path: 'create-task', component: CreateTaskComponent}
  // { path: '',  redirectTo: '/login', pathMatch: 'full'},
  //todo look at it
  // canActivate:[AuthGuard]

];


export const routing = RouterModule.forRoot(appRoutes, { useHash: true,enableTracing: false} // <-- debugging purposes only
);
