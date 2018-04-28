import {Component, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ShareTaskService} from "../../services/shareTask.service";
import {Board} from "../../model/board";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'share-task',
   templateUrl: './share-task.component.html',
})

export class ShareTaskComponent{

  shareTaskForm:FormGroup;
  private board:Board;

  constructor(private route: ActivatedRoute,
              public taskService:TaskService,
              public shareTaskService:ShareTaskService,
              public toastr: ToastsManager, vcr: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vcr);

    this.shareTaskForm = new FormGroup({
      email: new FormControl()
    });
  }

  shareTask(){
    this.board  = new Board(this.shareTaskForm.controls.email.value,this.taskService.getTask(),false,);
    this.shareTaskService.shareTaskWith(this.board);
  }

}
