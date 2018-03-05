import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {HomeService} from "../../services/home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  user: User;
  homeService;

  constructor(public userService: UserService,public hoS:HomeService) {
    this.homeService = hoS;
    this.reloadHomePage(localStorage.getItem('token'));
  }

  reloadHomePage(token){
    if(token){
      let result = this.homeService.reloadHomePage(token);
    }
    else{
      console.log("no token provided")

    }
  }




}
