import { Component, OnInit } from '@angular/core';
import {LoginService} from "../login/login";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private loginService;

  constructor(loginS:LoginService) {
    this.loginService = loginS;
  }

  logout(){
    this.loginService.logout();


  }

  ngOnInit() {
  }

}
