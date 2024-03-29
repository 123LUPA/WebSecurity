import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {HomeService} from "../../services/home.service";
import {TaskService} from "../../services/task.service";
import {Router} from "@angular/router";
import {ShareTaskService} from "../../services/shareTask.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  user: User;
  homeService;



  constructor(public userService: UserService, public hoS:HomeService,public shareTaskSevice: ShareTaskService, public taskService: TaskService,public router:Router) {

    this.homeService = hoS;
    this.reloadHomePage( localStorage.getItem('token'));

    userService.userEmiter.subscribe({next: (user)=>{
      console.log('emit emit emit');
        if(user){
          console.log(user);
          //going to get users tasks
          this.taskService.getTasks();
          this.shareTaskSevice.getFriendsTasks();
        }

    }});
  }
  deleteTask(taskId){
    this.taskService.deleteTask(taskId).subscribe((res)=>{
      this.taskService.getTasks();
      this.shareTaskSevice.getFriendsTasks();
    },err=>{

    });
  }
  reloadHomePage(token){
    if(token){
      let result = this.homeService.reloadHomePage(token);
      this.taskService.getTasks();
      this.shareTaskSevice.getFriendsTasks();
    }
    else{
    }
  }
  updateTask(task){
  }

  shareTask(task){
    this.taskService.setTask(task._id);
    this.router.navigate(['/share-task/'+task._id]);
  }




}
