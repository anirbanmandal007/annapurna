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
  selector: "app-entity",
  templateUrl: "entity.component.html",
})
export class EntityComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddEntityForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _EntityList :any;
  EntityForm: FormGroup;
  _FilteredList :any; 
 _EntityID: any =0;
 _DepartmentList:any;
 BranchList:any;
 _RootList:any;

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants
  ) {}
  ngOnInit() {
    this.AddEntityForm = this.formBuilder.group({
      SubfolderName: ['', Validators.required],
      DeptID: [0, Validators.required],
      BranchID: [0, Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],
      RootID:[0],
    });
    this.getEntityList();
    //this.getDepartmnet();
    this.getRootList();
  }


  // getRootList() {
    
  //   const apiUrl=this._global.baseAPIUrl+'RootMaster/GetRootList?user_Token='+ localStorage.getItem('User_Token') 
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //     this._RootList = data;
  //  //  this._FilteredList = data

  //    console.log(data);
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }


  getRootList() {
    
    const apiUrl=this._global.baseAPIUrl+"RootMaster/GetRootByUserID?UserID="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token'); 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._RootList = data;
   //  this._FilteredList = data
   this.AddEntityForm.controls['DeptID'].setValue(0);
   this.AddEntityForm.controls['BranchID'].setValue(0);
   
     //console.log(this._FilteredList );
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  // getDepartmnet() {

  //   const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token');
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //   this._DepartmentList = data;
  //  // this._DepartmentLists=data;
  //   console.log("data : -", data);
  //   this.AddEntityForm.controls['DeptID'].setValue(0);
  //  // this.RegionMappingForm.controls['DeptIDS'].setValue(0);
    

  //   //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });

  //   }

  getDepartmnet(RootID: any) {
  

    const apiUrl = this._global.baseAPIUrl + "Department/GetDepartmentByUserID?UserID="+localStorage.getItem('UserID')+"&RoleID="+RootID+"&user_Token="+localStorage.getItem('User_Token');

 //   const apiUrl=this._global.baseAPIUrl+'Department/GetDepartmentByUserID?user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    this._DepartmentList = data;
   // this._DepartmentLists=data;
//    console.log("data : -", data);
    this.AddEntityForm.controls['DeptID'].setValue(0);
    this.AddEntityForm.controls['BranchID'].setValue(0);
   // this.RegionMappingForm.controls['DeptIDS'].setValue(0);
    

    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._EntityList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "SubfolderName") {
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
  getEntityList() {
    
    const apiUrl = this._global.baseAPIUrl + "SubfolderController/GetSubfolderListByUser?UserID=" + localStorage.getItem('UserID') +"&user_Token=" +localStorage.getItem('User_Token');
   
  //  const apiUrl=this._global.baseAPIUrl+'SubfolderController/GetSubfolderList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._EntityList = data;
      this._FilteredList = data
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  

  

  geBranchListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geBranchList(userid);
  }

  OnReset() {
    this.Reset = true;
    //this.AddEntityForm.reset();
    this.modalRef.hide();  
    this.AddEntityForm.controls['SubfolderName'].setValue('');
    this.AddEntityForm.controls['DeptID'].setValue(0);
    this.AddEntityForm.controls['BranchID'].setValue(0);

  }

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl = this._global.baseAPIUrl + "BranchMaster/GetBranchByDeptIDANDUserwise?UserID=" +localStorage.getItem('UserID')+"&DeptID="+userid+ "&user_Token="+localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;
    //  this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.AddEntityForm);
    if (this.AddEntityForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'SubfolderController/Update';
    this._onlineExamService.postData(this.AddEntityForm.value,apiUrl).subscribe((data: {}) => {     
     console.log(data);
     this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">SUB FOLDER Saved</span></div>',
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
    this.getEntityList();
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
          this.AddEntityForm.patchValue({
            id: id
          });
          const apiUrl = this._global.baseAPIUrl + 'SubfolderController/Delete';
          this._onlineExamService.postData(this.AddEntityForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Sub Folder has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getEntityList();
            });
        }
      });
  }
  
  editEntity(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
      console.log('data', row);
      this.AddEntityForm.patchValue({
        id: that._SingleDepartment.id,
        SubfolderName: that._SingleDepartment.SubfolderName,
        DeptID: that._SingleDepartment.DeptID,
        BranchID: that._SingleDepartment.BranchID,
      })
      this.AddEntityForm.controls['DeptID'].setValue(that._SingleDepartment.DeptID); 
      this.geBranchListByUserID(that._SingleDepartment.DeptID);
      this.AddEntityForm.controls['BranchID'].setValue(that._SingleDepartment.BranchID);      
    
    //  console.log('form', this.AddEntityForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }
  addBranch(template: TemplateRef<any>) {
    this.AddEntityForm.controls['SubfolderName'].setValue('');
    this.AddEntityForm.controls['DeptID'].setValue(0);
    this.AddEntityForm.controls['BranchID'].setValue(0);
    this.modalRef = this.modalService.show(template);
  }
}
