import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-branch",
  templateUrl: "branch.component.html",
})
export class BranchComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddBranchForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
 _BranchList :any;
  BranchForm: FormGroup;
  _FilteredList :any; 
 _BranchID: any =0;
 _DepartmentList:any;
 _RootList:any;
 _Dept:any;
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants
  ) {}
  ngOnInit() {
    this.AddBranchForm = this.formBuilder.group({
      BranchName: ['', Validators.required],
      DeptID: [0, Validators.required],
      RootID: [0, Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
    });
    this.geBranchList(0); 
    this.getRootList();
    this.getDepartmnet();
  }

  getRootList() {
    
    const apiUrl=this._global.baseAPIUrl+'RootMaster/GetRootList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._RootList = data;
   //  this._FilteredList = data

     //console.log(this._FilteredList );
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    //console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._BranchList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "BranchName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }

  getDepartmnet() {

    const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    this._DepartmentList = data;
   // this._DepartmentLists=data;
    //console.log("data : -", data);
    //this.AddBranchForm.controls['DeptID'].setValue(0);
    //this.AddBranchForm.controls['DeptIDS'].setValue(0);
    

    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    }

    getDepartmnetByRoleID(RoleID: number) {

      const apiUrl= this._global.baseAPIUrl + "RootMaster/GetFileStatus?RoleID=" + RoleID +"&user_Token=" + localStorage.getItem('User_Token');
     // const apiUrl=this._global.baseAPIUrl+'RootMaster/GetFileStatus?user_Token='+ localStorage.getItem('User_Token')+'RoleID='+ RoleID;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._Dept = data;
     // this._DepartmentLists=data;
   //  console.log("data : -", data);
   //   this.AddBranchForm.controls['DeptID'].setValue(0);
     // this.AddBranchForm.controls['DeptIDS'].setValue(0);
      
  
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      });
  
      }

    geBranchListByUserID(userid: number) {
      //     alert(this.BranchMappingForm.value.UserID);
      this.geBranchList(userid);
    }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =this._global.baseAPIUrl+"BranchMapping/GetBranchDetailsRegionWise?ID="+userid+"&user_Token="+this.AddBranchForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._BranchList = data;
      this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  // geBranchList() {
    
  //   const apiUrl=this._global.baseAPIUrl+'BranchMaster/GetBranchList?user_Token='+ localStorage.getItem('User_Token') 
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //     this._BranchList = data;
  //     this._FilteredList = data
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  OnReset() {
  //  this.Reset = true;
    //this.AddBranchForm.reset();
    this.modalRef.hide();  
    this.AddBranchForm.controls['BranchName'].setValue('');
    this.AddBranchForm.controls['RootID'].setValue(0);
    this.AddBranchForm.controls['DeptID'].setValue(0);

  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.AddBranchForm);
    if (this.AddBranchForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'BranchMaster/Update';
    this._onlineExamService.postData(this.AddBranchForm.value,apiUrl).subscribe((data: {}) => {     
    // console.log(data);
     this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Folder Saved</span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );
     this.geBranchList(0);
     this.OnReset()
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }

  
  deleteBrnach(id: any) {
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
          this.AddBranchForm.patchValue({
            id: id
          });
          const apiUrl = this._global.baseAPIUrl + 'BranchMaster/Delete';
          this._onlineExamService.postData(this.AddBranchForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Folder has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geBranchList(localStorage.getItem('UserID') );
            });
        }
      });
  }
  
  editBranch(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
    //  console.log('data', row);
      this.AddBranchForm.patchValue({
        id: that._SingleDepartment.id,
        BranchName: that._SingleDepartment.BranchName,
        User_Token:localStorage.getItem('User_Token'),
        RootID: that._SingleDepartment.RootID,
        DeptID: that._SingleDepartment.DeptID,
        //RootID: that._SingleDepartment.RootID,
      })

      this.getDepartmnetByRoleID(that._SingleDepartment.RootID);
      this.AddBranchForm.controls['DeptID'].setValue(that._SingleDepartment.DeptID);      
      
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }
  addBranch(template: TemplateRef<any>) {

    this.AddBranchForm.controls['BranchName'].setValue('');
    this.AddBranchForm.controls['RootID'].setValue(0);
    this.AddBranchForm.controls['DeptID'].setValue(0);


    this.modalRef = this.modalService.show(template);
  }
}