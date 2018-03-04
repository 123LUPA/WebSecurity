import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Task} from '../../model/task';

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
  isProcessing: boolean;

  constructor(private formBuilder : FormBuilder) {
    this.buildForm();
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
    this.isProcessing = true;
    this.task = new Task(this.titleControl.value, this.descriptionControl.value,
      this.authorControl.value);
    console.log("this is task ", this.task);
  }
}
