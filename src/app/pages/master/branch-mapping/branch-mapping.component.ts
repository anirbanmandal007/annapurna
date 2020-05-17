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
  selector: "app-branch-mapping",
  templateUrl: "branch-mapping.component.html",
})
export class BranchMappingComponent implements OnInit {
  select_all = false;
  _data: any;
  ordersData = [];
  _UserList: any;
  _UserL: any;
  _List: any;
  _FilteredList: [];
  _BranchList: any;
  _BranchID: any =0;
  modalRef: BsModalRef;
  BranchMappingForm: FormGroup;
  AddBranchMappingForm: FormGroup;
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
  get checklistArray() { return this.AddBranchMappingForm.get('checklist') as FormArray; }
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public router: Router,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.BranchMappingForm = this.formBuilder.group({
      BranchName: ["", Validators.required],
      User_Token: ["123123"],
      id: [0],
      UserID: [0, Validators.required],
    });
    this.AddBranchMappingForm = this.formBuilder.group({
      BranchName: [""],
      SelectItem: [""],
      User_Token: ["123123"],
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],
      CreatedBy: [1],
      checklist: this.formBuilder.array([]),
      selectAll: [false],
    });

    // this.geBranchListchecked();
    this.geBranchList(this.BranchMappingForm.get("UserID").value);
    this.geUserList();
    //this.getBranch(0);
  }
  OnReset() {
    this.Reset = true;
    this.BranchMappingForm.reset({ User_Token: "123123", UserID: 0 });
    this.checklistArray.clear();
    //this.geBranchList();
  }

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsUserWise?ID=" +
      userid +
      "&user_Token=" +
      this.BranchMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._BranchList = data;
      this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      this.BranchMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.BranchMappingForm.controls["UserID"].setValue(0);
      // this.BranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  getBranch(userid: number) {
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetDetails?ID=" +
      userid +
      "&user_Token=" +
      this.BranchMappingForm.get("User_Token").value;;
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          BranchName: [item.BranchName],
          ischecked: [item.ischecked]
          })
          this.checklistArray.push(fg)
      });
      console.log('Branch Mapping -> ',res);
      
      // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())

      //this.productsArray = res;
      //  this.checkbox_list= res;
      //this.checklist =res;
    });
  }

  master_change() {
    console.log('Checked All');
    
    // this.checklistArray.controls.forEach(control => {
    //   control.patchValue({ischecked: true});
    // });
    let _bool =this.AddBranchMappingForm.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ischecked: _bool})
    });
  }
  deleteBranch(BranchID: number) {
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
          this.BranchMappingForm.patchValue({
            id: BranchID,
          });
          const apiUrl = this._global.baseAPIUrl + "BranchMapping/Delete";
          this._onlineExamService
            .postData(this.BranchMappingForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Branch Mapping has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geBranchList(this.BranchMappingForm.get("UserID").value);
            });
        }
      });
  }
  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._BranchList.filter(function (d) {
      for (var key in d) {
        if (key == "UserName" || key == "BranchName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  addBranchMapping(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  onSubmit() {
    this.submitted = true;

    if (this.AddBranchMappingForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    console.log('Checklist Array=> ',this.checklistArray.value);
    for (let value of this.checklistArray.value) {
      if (value.ischecked)
      {
        this.__checkedList +=value.id + "#";
      }
    }
    this.AddBranchMappingForm.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: 1,
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddBranchMappingForm.get('User_Token').value,
      UserID: this.AddBranchMappingForm.get('UserID').value,
      checkedList: this.AddBranchMappingForm.get('checkedList').value,
      CreatedBy: this.AddBranchMappingForm.get('CreatedBy').value
    }
    console.log('Submitting Form',objectToSend);
    
    const apiUrl = this._global.baseAPIUrl + "BranchMapping/Create";
    this._onlineExamService
      .postData(this.AddBranchMappingForm.value, apiUrl)
      // .pipe(first())

      .subscribe((data) => {
        alert(data);
        this.OnReset();
      });

    //  }
  }

  list_change() {
    alert("Hi");

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
  geBranchListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geBranchList(userid);
  }
  getBranchForUser(userid: number) {
    this.getBranch(userid)
  }
  editBranchMapping(template: TemplateRef<any>, userid: number) {
    this.addBranchMapping(template)
    this.checklistArray.clear()
    this.AddBranchMappingForm.patchValue({UserID: userid})
    this.getBranch(userid)
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
}
