/**
 * Created by Palko on 31/01/2018.
 */
import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {UserService} from "./services/user.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot) {
    //check if user wants to go to admin page
    if(route.url[0].path === 'admin') {
      //check if user has an admin role
      // if (this.userService.user.role === 'admin') {
      //   return true;
      // } else {
      //   this.router.navigate(['']);
      //   return false;
      //
      // }
    }
    // }
    if (Cookie.get('token')) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }

}
