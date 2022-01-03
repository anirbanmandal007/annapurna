import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: "app-view-customform",
  templateUrl: "view-customform.component.html",
})
export class ViewCustomFormComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  ViewCustomeForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';      
  _FilteredList :any; 
  TemplateList:any;
_IndexList:any;
_TemplateList :any;
 
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.ViewCustomeForm = this.formBuilder.group({
      TemplateName: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],
      TemplateID:['0', Validators.required],
    });     

    this.getTempList(0);
    this.getTemplate();

  }

  
  getTemplate() {  

    const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {     
    this.TemplateList = data;    
    if(data.length>0){
      this.ViewCustomeForm.controls['TemplateID'].setValue(data[0].id);
    //  this.ViewCustomeForm.controls['TemplateName'].setValue(data[0].TemplateName);
    }
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

getTempList(TempID: number) {  

const apiUrl=this._global.baseAPIUrl+'CustomForms/GetDetails?ID='+ TempID +'&user_Token='+ localStorage.getItem('User_Token')  
    //const apiUrl=this._global.baseAPIUrl+'CustomForms/GetDetails?user_Token='+this.ViewCustomeForm.get('User_Token').value

//  const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token=123123'
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._IndexList = data;
      this._FilteredList = data
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
}

geTemplateNameListByTempID(userid:number) {          

  this.getTempList(userid);      
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._IndexList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "TemplateName" || key == "DisplayName" || key == "FieldTypeText") {
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


  // geBranchList() {
    
  //   const apiUrl=this._global.baseAPIUrl+'CustomForms/GetBranchList?user_Token='+this.ViewCustomeForm.get('User_Token').value
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //     this._TemplateList = data;
  //     this._FilteredList = data
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  OnReset() {
    this.Reset = true;
    this.ViewCustomeForm.reset();
  }

  // onSubmit() {
  //   this.submitted = true;
  //   console.log(this.ViewCustomeForm);
  //   if (this.ViewCustomeForm.invalid) {
  //     alert("Please Fill the Fields");
  //     return;
  //   }
  //   const apiUrl = this._global.baseAPIUrl + 'CustomForms/Update';
  //   this._onlineExamService.postData(this.ViewCustomeForm.value,apiUrl).subscribe((data: {}) => {     
  //    console.log(data);
  //    this.toastr.show(
  //     '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Field Saved</span></div>',
  //     "",
  //     {
  //       timeOut: 3000,
  //       closeButton: true,
  //       enableHtml: true,
  //       tapToDismiss: false,
  //       titleClass: "alert-title",
  //       positionClass: "toast-top-center",
  //       toastClass:
  //         "ngx-toastr alert alert-dismissible alert-success alert-notify"
  //     }
  //   );
  //    this.geBranchList();
  //    this.OnReset()
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });

  //   //this.studentForm.patchValue({File: formData});
  // }

  deleteTemplate(id: any) {
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
          this.ViewCustomeForm.patchValue({
            id: id
          });
          const apiUrl = this._global.baseAPIUrl + 'CustomForms/Delete';
          this._onlineExamService.postData(this.ViewCustomeForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Field has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getTempList(this.ViewCustomeForm.get('TemplateID').value);
            });
        }
      });
  }

  RedirectToEdit(_TempID: any)
  {  
    localStorage.setItem('_TempID',_TempID) ;    
   //this.localStorage.setItem('_TempID') =_TempID;
    //this.router.navigate(['/CustomForm']);
    this.router.navigate(['/master/addfield']);
    //, {queryParams: {_TempID : _TempID}})
  } 


}
