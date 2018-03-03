import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  user: User;

  constructor(public userService: UserService) {
  }



}
