import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ForgotService} from "./forgot.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  private forgotService;

  constructor(forgotService: ForgotService,public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.forgotService = forgotService;
    this.toastr.setRootViewContainerRef(vcr);

  }


  retypeEmailFrom = new FormGroup ({
    email: new FormControl(),
  })



  RetypeEmail(){
    this.forgotService.forgotPassword(this.retypeEmailFrom.controls.email.value)

  }



  ngOnInit() {
  }

}
