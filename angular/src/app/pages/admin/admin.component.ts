import {UserService} from "../../services/user.service";
import {Component} from "@angular/core";
import {UsersService} from "../../services/users.service";

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent{

  constructor(public usersService: UsersService) {
    this.getAllUsers();
  }
  getAllUsers(){
    this.usersService.getUsers().subscribe((users)=>{
      console.log('users', users);
    })
  }


}
