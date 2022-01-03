import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter,Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
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
  selector: "app-sftpupload",
  templateUrl: "sftpupload.component.html",
})
export class SftpUploadComponent implements OnInit {
entries: number = 10;
selected: any[] = [];
temp = [];
activeRow: any;
SelectionType = SelectionType;
modalRef: BsModalRef;
_SingleDepartment: any;
submitted = false;
Reset = false;     
BranchList:any;
sMsg: string = '';      
_FilteredList = []; 
TemplateList:any;
_FileList:any;
_Records :any; 
sftpuploadForm: FormGroup;

public message: string;
_HeaderList: any;
_ColNameList = [];
_CSVData: any;
public records: any[] = [];
_DepartmentList:any;
_TempID: any = 0;

myFiles:string [] = [];
_FileDetails:string [][] = [];

@Output() public onUploadFinished = new EventEmitter();
  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
  ) {}
  ngOnInit() {
    this.sftpuploadForm = this.formBuilder.group({
      BranchID: ['',],
      DeptID: [""],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,

    });     

   // this.getBranchList();
this.GetCountOnly();
this.getDepartmnet();
this.geBranchList(0);
  }   
  getDepartmnet() {

    const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    this._DepartmentList = data;
   // this._DepartmentLists=data;
    //console.log("data : -", data);

    this.sftpuploadForm.controls['DeptID'].setValue(0);
   
    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
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

  OnReset() {
    this.Reset = true;
    this.sftpuploadForm.reset();
    this.sftpuploadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token')); 
    this.sftpuploadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));    
    this.sftpuploadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));    
   // this.getTemplate();
 //  this.sftpuploadForm.controls['TemplateID'].setValue(0);
  }

  // getBranchList() {
  //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
  //   const apiUrl =
  //     this._global.baseAPIUrl +
  //     "BranchMapping/GetBranchDetailsUserWise?ID=" +
  //     localStorage.getItem('UserID') +
  //     "&user_Token=" +
  //     this.sftpuploadForm.get("User_Token").value;
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
  //     this.BranchList = data;
  //    // this._FilteredList = data;
  //     this.sftpuploadForm.controls['BranchID'].setValue(0);
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  GetCountOnly() {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "FileUpload/GetCountOnly?ID=" +
      localStorage.getItem('UserID') +
      "&user_Token=" +
      this.sftpuploadForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._FileList = data;
      this._FilteredList = data;    
     
    });
  }

  GetFileCount() {

    var bid =this.sftpuploadForm.get("BranchID").value;
    if (bid ==null)
    {

      bid=0;
    }

   

    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      const apiUrl =this._global.baseAPIUrl +"FileUpload/GetFileCount?ID="+this.sftpuploadForm.get("DeptID").value+"&user_Token="+this.sftpuploadForm.get("User_Token").value+"&BranchID="+bid;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._FileList = data;
      this._FilteredList = data;   
     
    });
  }

  geBranchListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geBranchList(userid);
  }
 
  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsRegionWise?ID=" +
      userid +
      "&user_Token=" +
      this.sftpuploadForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;
      // this._FilteredList = data;
       this.sftpuploadForm.controls['BranchID'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }


  onSubmit() {

    //     this.submitted = true;
    //     if (this.validation() == false ) {
    //     alert("Please Fill the Fields");
    //     return;  
    // } 

    // this.sftpuploadForm.patchValue({
    //   id: localStorage.getItem('UserID'),
    //   CSVData: this._CSVData,     
    //   User_Token: localStorage.getItem('User_Token')    

    // });
    

    const apiUrl = this._global.baseAPIUrl + 'FileUpload/SftpFileupload';
    this._onlineExamService.postData(this.sftpuploadForm.value, apiUrl)
      // .pipe(first())
      .subscribe(data => {
         
        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> File Uploaded Succesfully. </span></div>',
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

        var strmsg =data;
        this.downloadFile(data);

      });

    //  }     

  }
  downloadFile(strmsg:any) {
    const filename = 'File upload status';
    
   // let csvData = "FileNo,";    
    //console.log(csvData)
    let blob = new Blob(['\ufeff' + strmsg], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 

    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }


    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  //}
  }  

  showmessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
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


  }

  validation()
  {
    
      if (this.sftpuploadForm.get('TemplateID').value <=0 )
      {
               this.showmessage("Please Select Template ID");
                return false;
      }


      return true;

  }
  
}
