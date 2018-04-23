import {UserService} from "../../services/user.service";
import {Component} from "@angular/core";

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent{

  constructor(public userService: UserService) {

  }


}
