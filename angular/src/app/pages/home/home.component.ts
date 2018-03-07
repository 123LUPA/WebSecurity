import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {HomeService} from "../../services/home.service";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  user: User;
  homeService;

  constructor(public userService: UserService, public hoS:HomeService, public taskService: TaskService) {
    this.homeService = hoS;
    this.reloadHomePage(localStorage.getItem('token'));
    userService.userEmiter.subscribe({next: ()=>{
        this.taskService.getTasks();
      }});
  }
  deleteTask(taskId){
    this.taskService.deleteTask(taskId).subscribe((res)=>{
      console.log(res);
      this.taskService.getTasks();
    },err=>{

    });
    console.log(taskId);
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
