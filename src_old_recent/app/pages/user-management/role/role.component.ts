import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-role",
  templateUrl: "role.component.html",
})
export class RoleComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  _FilteredList: any;
  _RoleList: any;
  RoleForm: FormGroup;
  submitted = false;
  Reset = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];

myFiles: string[] = [];  


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    
    private http: HttpClient,
    private httpService: HttpClient  
  ) {}
  ngOnInit() {
    this.RoleForm = this.formBuilder.group({ 
      id:[0],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
    });
  
    this.getRoleList();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._RoleList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "roleName" || key == "remarks") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  geRoleList() {
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token="+this.RoleForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;

      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  
  OnReset() {
    this.Reset = true;
    this.RoleForm.reset();
  }

  OnDelete(id: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-danger",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn btn-secondary",
      })
      .then((result) => {
        if (result.value) {
          this.RoleForm.patchValue({
            id: id,
            User_Token: localStorage.getItem('User_Token'),
          });

          const apiUrl = this._global.baseAPIUrl + "Role/Delete";
          this._onlineExamService
            .postData(this.RoleForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Role has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geRoleList();
            });
        }
      });
  }
  
  getRoleList() {  

    const apiUrl=this._global.baseAPIUrl+'Role/GetList?user_Token='+this.RoleForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this._RoleList = data;
    this._FilteredList = data;

    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
    }
  
  OnEdit(RoleL: any)
  {  
  localStorage.setItem('_RoleID',RoleL.id) ;    
  localStorage.setItem('_RoleName',RoleL.roleName) ;    
  localStorage.setItem('_RoleRemark',RoleL.roleName) ;    
  //this.localStorage.setItem('_TempID') =_TempID;
  this.router.navigate(['/usermanagement/addrole']);
  //, {queryParams: {_TempID : _TempID}})
  }

  AddRole()
  {
    this.router.navigate(['/usermanagement/addrole']);
  }  
}
