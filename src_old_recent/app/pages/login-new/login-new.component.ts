import { Component, OnInit } from "@angular/core";
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";

import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import {AuthenticationService} from '../../Services/authentication.service';
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
//
@Component({
  selector: 'app-login-new',
  templateUrl: './login-new.component.html',
  styleUrls: ['./login-new.component.scss']
})
export class LoginNewComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  _LogData:any;

  
  constructor(
        
        
        public toastr: ToastrService,
        private formBuilder: FormBuilder,
        private _onlineExamService: OnlineExamServiceService,
        private _global: Globalconstants,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private http: HttpClient,
        private httpService: HttpClient
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });

    localStorage.clear();
  }

  onSubmit() {

    this.submitted = true;
     // stop here if form is invalid
     if (this.loginForm.invalid) {
      return;
  }  
  const apiUrl = this._global.baseAPIUrl + 'UserLogin/Create';
    this.authService.userLogin(this.loginForm.value,apiUrl).subscribe( data => {
      if(data.length > 0)         
      {        
        var that = this;
        that._LogData =data[0];
     //   console.log("that._LogData ",that._LogData );      

        localStorage.setItem('UserID',that._LogData.id) ;
        localStorage.setItem('currentUser',that._LogData.id) ;        
        localStorage.setItem('sysRoleID',that._LogData.sysRoleID) ;
        localStorage.setItem('User_Token',that._LogData.User_Token) ;
        localStorage.setItem('UserName',this.loginForm.get("username").value) ;
        localStorage.setItem('Fname',that._LogData.FileNo) ;          
    //  console.log("UN",this.loginForm.get("username").value);
      //console.log("ID",that._LogData.id);     
       
        if (this.loginForm.get("username").value == "admin")
        {
          this.router.navigate(['dashboards/dashboard']);
      }
      else{
        this.router.navigate(['search/content-search']);       

      }

      }
    else
    {

      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> Invalid userid and password. </span></div>',
        "",
        {
          timeOut: 3000,
          closeButton: true,
          enableHtml: true,
          tapToDismiss: false,
          titleClass: "alert-title",
          positionClass: "toast-top-center",
          toastClass:
            "ngx-toastr alert alert-dismissible alert-danger alert-notify"
        }
      );
//      alert("Invalid userid and password.");     
    }

  });
  }

  get f(){
    return this.loginForm.controls;
  }
  
}
