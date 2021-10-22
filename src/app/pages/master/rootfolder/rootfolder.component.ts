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
  selector: "app-rootfolder",
  templateUrl: "rootfolder.component.html",
})
export class RootfolderComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddRootFolderForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _RootList :any; 
  _FilteredList :any; 
 _RootID: any =0;
 
 
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants
  ) {}
  ngOnInit() {
    this.AddRootFolderForm = this.formBuilder.group({
      RootfolderName: ['', Validators.required],
     
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]     
    });
   
    this.getRootList();

   // this.geBranchList();  

  //  this.getDepartmnet();
    //  this.getDeparmenList();
   //   this.geTTempList();
     // this.GetEntityList();
  }

  // getDepartmnet() {

  //   const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token');
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //   this._DepartmentList = data;
  //  // this._DepartmentLists=data;
  //   console.log("data : -", data);
  //   this.AddRootFolderForm.controls['DeptID'].setValue(0);
  //  // this.RegionMappingForm.controls['DeptIDS'].setValue(0);
    

  //   //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });

  //   }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  // geBranchList() {
  //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
  //   const apiUrl =
  //     this._global.baseAPIUrl +
  //     "BranchMapping/GetBranchDetailsUserWise?ID=" +
  //     localStorage.getItem('UserID') +
  //     "&user_Token=" +
  //     this.AddRootFolderForm.get("User_Token").value;
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
  //     this.BranchList = data;
  //     //this._FilteredList = data;
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }


  // geBranchList(userid: any) {
  //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
  //   const apiUrl =
  //     this._global.baseAPIUrl +
  //     "BranchMapping/GetBranchDetailsRegionWise?ID=" +
  //     userid +
  //     "&user_Token=" +
  //     this.AddRootFolderForm.get("User_Token").value;
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
  //     this.BranchList = data;
  //     this._FilteredList = data;
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._RootList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "RootfolderName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  
  
 
  getRootList() {
    
    const apiUrl=this._global.baseAPIUrl+'RootMaster/GetRootList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._RootList = data;
     this._FilteredList = data

     console.log(this._FilteredList );
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  OnReset() {
    this.Reset = true;
    // this.AddEntityForm.reset();
    this.modalRef.hide();  

  }

  onSubmit() {
    this.submitted = true;
    console.log(this.AddRootFolderForm);
    if (this.AddRootFolderForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'RootMaster/Update';
    this._onlineExamService.postData(this.AddRootFolderForm.value,apiUrl).subscribe((data: {}) => {     
   //  console.log(data);
     this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Root folder created</span></div>',
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
     this.getRootList();
     this.OnReset()
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }

  
  deleteEntity(id: any) {
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
          this.AddRootFolderForm.patchValue({
            id: id
          });
          const apiUrl = this._global.baseAPIUrl + 'RootMaster/Delete';
          this._onlineExamService.postData(this.AddRootFolderForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Root Folder has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getRootList();
            });
        }
      });
  }
  
  editEntity(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
     // console.log('data', row);
      this.AddRootFolderForm.patchValue({
        id: that._SingleDepartment.id,
        RootfolderName: that._SingleDepartment.RootfolderName,
      })
     // console.log('form', this.AddRootFolderForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }


  addRoot(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
