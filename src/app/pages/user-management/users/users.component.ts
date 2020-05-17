import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-users",
  templateUrl: "users.component.html",
})
export class UsersComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  UserList: any;
  _FilteredList: any;
  _RoleList: any;
  AddUserForm: FormGroup;
  submitted = false;
  Reset = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];
  _UserID: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants
  ) {}
  ngOnInit() {
    this.AddUserForm = this.formBuilder.group({
      id: [""],
      name: ["", Validators.compose([Validators.required])],
      userid: ["", Validators.required],
      pwd: ["", [Validators.required, Validators.minLength(6)]],
      confirmPass: ["", Validators.required],
      //Cpwd: ['', Validators.required],
      email: ["", Validators.required],
      mobile: ["", Validators.required],
      sysRoleID: ["", Validators.required],
      Remarks: [""],
      User_Token: "123123",
    });
    this.geRoleList();
    this.geUserList();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this.UserList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "name" || key == "email" || key == "userid") {
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
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token=123123";
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  geUserList() {
    const apiUrl = this._global.baseAPIUrl + "Admin/GetList?user_Token=123123";
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.UserList = data;
      this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  OnReset() {
    this.Reset = true;
    this.AddUserForm.reset({User_Token: "123123"});
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.AddUserForm);
    
    if (this.AddUserForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }

    if (this.AddUserForm.get('id').value) {
      console.log('Form',this.AddUserForm.value);
      console.log('Inside Edit');
      const apiUrl = this._global.baseAPIUrl + "Admin/Update";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        // .pipe(first())
        .subscribe((data) => {
          if (data != null) {
            alert("Record Updated Succesfully..");
            this.OnReset();
            //this.router.navigate(['/student']);
            this.geUserList()
          } else {
            alert("User already exists.");
          }
        });
    } else {
      console.log('Form',this.AddUserForm.value);
      console.log('Inside Create');
      const apiUrl = this._global.baseAPIUrl + "Admin/Create";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        // .pipe(first())
        .subscribe((data) => {
          if (data != null) {
            alert("Record Saved Successfully..");
            this.OnReset();
            //this.router.navigate(['/student']);
            this.geUserList()
          } else {
            alert("User already exists.");
          }
        });
    }

    //this.studentForm.patchValue({File: formData});
  }
  deleteEmployee(id: any) {
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
          this.AddUserForm.patchValue({
            id: id,
            User_Token: "123123",
          });

          const apiUrl = this._global.baseAPIUrl + "Admin/Delete";
          this._onlineExamService
            .postData(this.AddUserForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geUserList();
            });
        }
      });
  }
  editEmployee(template: TemplateRef<any>, value: any) {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetDetails?ID=" +
      value +
      "&user_Token=123123";
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      var that = this;
      that._SingleUser = data;
      console.log('data', data);
      this.AddUserForm.patchValue({
        id: that._SingleUser.id,
        name: that._SingleUser.name,
        userid: that._SingleUser.userid,
        pwd: that._SingleUser.pwd,
        confirmPass: that._SingleUser.pwd,
        email: that._SingleUser.email,
        mobile: that._SingleUser.mobile,
        sysRoleID: that._SingleUser.sysRoleID,
        Remarks: that._SingleUser.remarks
      })
      console.log('form', this.AddUserForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
    
    this.modalRef = this.modalService.show(template);
  }
  addUser(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
