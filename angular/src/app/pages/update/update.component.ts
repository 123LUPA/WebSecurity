import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Processing} from "../../model/proccessing";


@Component({
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})

export class UpdateComponent {
  taskForm: FormGroup;
  task: any;
  titleControl;
  descriptionControl;
  authorControl;
  processing: Processing;

  constructor( private route: ActivatedRoute, private taskService: TaskService, private formBuilder : FormBuilder) {
    this.buildForm();
    this.processing = new Processing(false, false, false);
    this.route.params.subscribe( params => {
        this.getTask(params.id);
      }
    );
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

  getTask(id){
    this.taskService.getById(id).subscribe(res => {
      this.task = res;
      this.setValues();
    })
  }
  setValues(){
    // console.log(this.task);
    this.titleControl.patchValue(this.task.title);
    this.descriptionControl.patchValue(this.task.description);
    this.authorControl.patchValue(this.task.author);

  }
  updateTask(){
    this.processing.isProcessing = true;
    this.task.title = this.titleControl.value;
    this.task.description = this.descriptionControl.value;
    this.task.author = this.authorControl.value;
    this.taskService.updateTask(this.task).subscribe(res =>{
      this.processing.isCompleted = true;
      this.processing.isProcessing = false;
    }, err =>{
      this.processing.isProcessing = false;
      this.processing.isError = true;
    });
  }

}
