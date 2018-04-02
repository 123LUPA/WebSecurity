import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import Config from "../../../../app-config";


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  public profileImg = Config.nodeApi + 'images/' + this.userService.user.image;

  constructor(public userService: UserService) {}

}
