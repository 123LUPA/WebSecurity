import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Task} from '../../model/task';
import {TaskService} from "../../services/task.service";
import {Processing} from "../../model/proccessing";

@Component({
  selector: 'create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent{
  task : Task;
  taskForm: FormGroup;
  titleControl;
  descriptionControl;
  authorControl;
  processing: Processing;

  constructor(private formBuilder : FormBuilder, private taskService: TaskService) {
    this.buildForm();
    this.processing = new Processing(false, false, false);
  }

  private buildForm(){
    this.taskForm = this.formBuilder.group({
      title  : this.formBuilder.control(null,
        [Validators.required, Validators.minLength(3)]),
      description : this.formBuilder.control(null,
        [Validators.required, Validators.minLength(10)]),
      author : this.formBuilder.control(null,
        [Validators.required, Validators.minLength(3)])
    });

    this.titleControl = this.taskForm.get('title');
    this.descriptionControl = this.taskForm.get('description');
    this.authorControl = this.taskForm.get('author');
  }

  public onSubmitForm(){
    this.processing.isProcessing = true;
    this.task = new Task(this.titleControl.value, this.descriptionControl.value,
      this.authorControl.value);
    this.taskService.createEvent(this.task).subscribe((res)=>{
      this.processing.isCompleted = true;
      this.processing.isProcessing = false;
    }, error => {
      this.processing.isProcessing = false;
      this.processing.isError = true;
    });
  }
}
