import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router } from "@angular/router";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-template-mapping",
  templateUrl: "template-mapping.component.html",
  styleUrls: ["template-mapping.componenet.css"]
})
export class TemplateMappingComponent implements OnInit {
  select_all = false;
  _data: any;
  ordersData = [];
  _UserList: any;
  _UserL: any;
  _List: any;
  entries: number = 10;
  activeRow: any;
  _FilteredList: [];
  _TemplateList: any;
  _TemplateID: any = 0;
  modalRef: BsModalRef;
  TemplateMappingForm: FormGroup;
  AddTemplateMappingForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _userid: any = 0;

  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  __checkedList: string = "";

  userEditID: number;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  // checkbox_list  = [
  //   { id: 100, BranchName: 'order 1' },
  //   { id: 200, BranchName: 'order 2' },
  //   { id: 300, BranchName: 'order 3' },
  //   { id: 400, BranchName: 'order 4' }
  // ];
  checkbox_list = [];
  itemRows: any;
  get checklistArray() { return this.AddTemplateMappingForm.get('checklist') as FormArray; }
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public router: Router,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit() {
    this.TemplateMappingForm = this.formBuilder.group({
      TemplateName: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      UserIDS: ['', Validators.required],
      UserID: [0, Validators.required],
    });
    this.AddTemplateMappingForm = this.formBuilder.group({
      TemplateName: [""],
      SelectItem: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],

      checklist: this.formBuilder.array([]),
      selectAll: [false],
    });

    // this.geBranchListchecked();
    this.geUserList();
    this.getTempalteList(0);

    //this.getBranch(0);
  }
  OnReset() {
    this.Reset = true;
    this.TemplateMappingForm.reset({ User_Token: localStorage.getItem('User_Token'), UserID: 0, UserIDS: 0 });
    this.checklistArray.clear();
    this.modalRef.hide();  
    //this.geBranchList();
  }

  getTempalteList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =this._global.baseAPIUrl+"TemplateMapping/GetTemplateMappingListByCreatedBy?UserID="+userid +"&user_Token="+this.TemplateMappingForm.get("User_Token").value+"&CreatedBy="+localStorage.getItem('UserID');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._TemplateList = data;
      this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      this.TemplateMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.TemplateMappingForm.controls["UserID"].setValue(0);
      this.TemplateMappingForm.controls["UserIDS"].setValue(0);

      // this.BranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  getTemplate(userid: number) {
 
    const apiUrl =this._global.baseAPIUrl+"TemplateMapping/GetDetails?UserID="+userid +"&user_Token="+this.TemplateMappingForm.get("User_Token").value+"&CreatedBy="+localStorage.getItem('UserID');
 
 //   const apiUrl =this._global.baseAPIUrl +"TemplateMapping/GetDetails?ID="+userid +"&user_Token="+this.TemplateMappingForm.get("User_Token").value;;
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          TemplateName: [item.TemplateName],
          ischecked: [item.ischecked]
        })
        this.checklistArray.push(fg)
      });
    //  console.log('Tempalte Mapping -> ', res);

      // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())

      //this.productsArray = res;
      //  this.checkbox_list= res;
      //this.checklist =res;
    });
  }

  master_change() {
  //  console.log('Checked All');

    // this.checklistArray.controls.forEach(control => {
    //   control.patchValue({ischecked: true});
    // });
    let _bool = this.AddTemplateMappingForm.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ ischecked: _bool })
    });
  }
  deleteTemplate(BranchID: number) {
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
          this.TemplateMappingForm.patchValue({
            id: BranchID,
          });
          const apiUrl = this._global.baseAPIUrl + "TemplateMapping/Delete";
          this._onlineExamService
            .postData(this.TemplateMappingForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Template Mapping has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getTempalteList(this.TemplateMappingForm.get("UserIDS").value);

            });
        }
      });


  }
  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._TemplateList.filter(function (d) {
      for (var key in d) {
        if (key == "UserName" || key == "TemplateName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  addTemplateMapping(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getTemplateForUser(0);
    this.TemplateMappingForm.controls["UserID"].setValue(0);
  }
  onSubmit() {
    this.submitted = true;
    this.__checkedList ="";
    if (this.AddTemplateMappingForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    var _chkstatus = false;
   // console.log('Checklist Array=> ', this.checklistArray.value);
    for (let value of this.checklistArray.value) {
      if (value.ischecked) {
        this.__checkedList += value.id + "#";
        _chkstatus =true;
      }
    }
   
    if (_chkstatus == false )
    {
      //console.log("_chkstatus" , _chkstatus);    
      alert("Please select at lease one Template");
      return;
    }

    this.AddTemplateMappingForm.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: localStorage.getItem('UserID'),
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddTemplateMappingForm.get('User_Token').value,
      UserID: this.AddTemplateMappingForm.get('UserID').value,
      checkedList: this.AddTemplateMappingForm.get('checkedList').value,
      CreatedBy: this.AddTemplateMappingForm.get('CreatedBy').value
    }

    //console.log('Submitting Form', objectToSend);

    const apiUrl = this._global.baseAPIUrl + "TemplateMapping/Create";
    this._onlineExamService
      .postData(this.AddTemplateMappingForm.value, apiUrl)
      // .pipe(first())

      .subscribe((data) => {


        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Template Mapping Done</span></div>',
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
        this.OnReset();
        this.TemplateMappingForm.controls["UserID"].setValue(0);
        this.getTempalteList(0);
      });

    //  }
  }

  list_change() {
    //alert("Hi");

    let checked_count = 0;
    //Get total checked items
    for (let value of Object.values(this.checkbox_list)) {
      if (value.ischecked) checked_count++;
    }

    if (checked_count > 0 && checked_count < this.checkbox_list.length) {
      // If some checkboxes are checked but not all; then set Indeterminate state of the master to true.
      this.master_indeterminate = true;
    } else if (checked_count == this.checkbox_list.length) {
      //If checked count is equal to total items; then check the master checkbox and also set Indeterminate state to false.
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      //If none of the checkboxes in the list is checked then uncheck master also set Indeterminate to false.
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }
  getTemplateListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.getTempalteList(userid);
  }
  getTemplateForUser(userid: number) {
    this.getTemplate(userid)


  }
  editTempalteMapping(template: TemplateRef<any>, userid: number) {
    this.addTemplateMapping(template)
    this.checklistArray.clear()
    this.AddTemplateMappingForm.patchValue({ UserID: userid })
    this.getTemplate(userid)
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  onActivate(event) {
    this.activeRow = event.row;
  }


}
