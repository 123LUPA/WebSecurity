import {UserService} from "../../services/user.service";
import {Component} from "@angular/core";
import {UsersService} from "../../services/users.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent{
  users: any;
  constructor(public usersService: UsersService, private router: Router) {
    this.getAllUsers();
  }
  getAllUsers(){
    this.usersService.getUsers().subscribe((users)=>{
       this.users = users['users'];

    }, err =>{
      console.log(err);
      this.router.navigate(['/']);
    })
  }


}
