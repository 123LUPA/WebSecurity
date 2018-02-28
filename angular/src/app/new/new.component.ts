import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {NewPasswordService} from "./new-password.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {FormGroup, FormControl} from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {


  private newPasswor;

  constructor(private route: ActivatedRoute,newPasswor:NewPasswordService,public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.newPasswor = newPasswor;


  }

  newPasswordForm = new FormGroup ({
    newPassword: new FormControl(),
    repeatPassword: new FormControl(),

  });

  resetPassword(){

    if(this.newPasswordForm.controls.newPassword.value==this.newPasswordForm.controls.repeatPassword.value){
      this.newPasswor.changePassword(this.newPasswordForm.controls.newPassword.value,this.route.snapshot.paramMap.get('token'))

    }
    else{
      this.toastr.error('The passwords do not match');
    }



  }
  ngOnInit() {

  }

}
