import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./app/pages/login/login.component";
import {AuthGuard} from "./app/auth-guard";
import {HomeComponent} from "./app/pages/home/home.component";
import {SignupComponent} from "./app/pages/signup/signup.component";
import {ForgotComponent} from "./app/forgot/forgot.component";
import {NewComponent} from "./app/new/new.component";
import {CreateTaskComponent} from "./app/pages/create-task/create-task.component";
import {ShareTaskComponent} from "./app/pages/share-task/share-task.component";
import {ProfileComponent} from "./app/pages/profile/profile.component";
import {AdminComponent} from "./app/pages/admin/admin.component";
import {UpdateComponent} from "./app/pages/update/update.component";

const appRoutes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '' , component: HomeComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset/:token',component: NewComponent },
  {path: 'create-task', canActivate:[AuthGuard],component: CreateTaskComponent},
  {path: 'share-task/:id', canActivate:[AuthGuard],component: ShareTaskComponent},
  {path: 'admin', canActivate: [AuthGuard], component: AdminComponent},
  {path: 'update/:id', canActivate: [AuthGuard], component: UpdateComponent}


  // { path: '',  redirectTo: '/login', pathMatch: 'full'},
  //todo look at it
  // canActivate:[AuthGuard]

];


export const routing = RouterModule.forRoot(appRoutes, { useHash: true,enableTracing: false} // <-- debugging purposes only
);
