import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef,EventEmitter,Output } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
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
  selector: "app-fileupload",
  templateUrl: "fileupload.component.html",
  styleUrls: ["fileupload.component.css"]
})
export class FileUploadComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _FilteredList :any; 
  _DeptList:any;
  _IndexList:any;
  EntityList:any;
  _DeparmentList:any;
  BranchList:any;
  _Records :any; 
  _StatusList :any; 
  FileUPloadForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  public progress: number;
  public message: string;
  _TemplateList:any; 
  myFiles:string [] = [];
  _FileDetails:string [][] = [];
  _DepartmentList:any;
  _RootList:any;
  
  @Output() public onUploadFinished = new EventEmitter();
    
  
    constructor(
      private _onlineExamService: OnlineExamServiceService,
      private _global: Globalconstants,
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private httpService: HttpClient,
      public toastr: ToastrService,
  
    ) { }
  
    ngOnInit() {
      this.FileUPloadForm = this.formBuilder.group({         
        
          
        DocID:[1],
        BranchID:[0, Validators.required],
        DeptID:[0, Validators.required],
        SubfolderID:[0, Validators.required],        
        TemplateID:[0, Validators.required],
        // TemplateID:[1],
        TemplateName: [''],
        User_Token: localStorage.getItem('User_Token') ,
        CreatedBy: localStorage.getItem('UserID') ,
        id:[0],
        CSVData:"",
        RootID:[0],
      });
  
     
  
     // this.geBranchList();  
    //  this.getDeparmenList();
      this.geTTempList();
      //this.GetEntityList();
    //  this.geDoctypeList();
    this.getRootList();
     
    }

 

    entriesChange($event) {
      this.entries = $event.target.value;
    }
    filterTable($event) {
      console.log($event.target.value);
  
      let val = $event.target.value;
      this._FilteredList = this._StatusList.filter(function (d) {
      //  console.log(d);
        for (var key in d) {
          if (key == "Department" || key == "BranchName" || key == "FileNo" ) {
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
      this.selected.push(selected);
    }
    onActivate(event) {
      this.activeRow = event.row;
    }
      OnReset() {  
      this.Reset = true;
      this.FileUPloadForm.reset();   
      // this.FileUPloadForm.controls['DocID'].setValue(0);
      this.FileUPloadForm.controls['BranchID'].setValue(0);
      this.FileUPloadForm.controls['TemplateID'].setValue(0);  
      this.FileUPloadForm.controls['SubfolderID'].setValue(0);    

      this.FileUPloadForm.controls['DeptID'].setValue(0);
      // this.FileUPloadForm.controls['BranchID'].setValue(0);
      // this.FileUPloadForm.controls['SubfolderID'].setValue(0);  

      this.FileUPloadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token')); 
      this.FileUPloadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));    
      this.FileUPloadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));    

      }
  
      // geBranchList() {    
      // const apiUrl=this._global.baseAPIUrl+'BranchMaster/GetBranchList?user_Token='+localStorage.getItem('User_Token');
      // this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      // this.BranchList = data;
      // this.FileUPloadForm.controls['BranchID'].setValue(0);
      // //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      // });
      // }


      // geBranchList() {
      //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      //   const apiUrl =
      //     this._global.baseAPIUrl +
      //     "BranchMapping/GetBranchDetailsUserWise?ID=" +
      //     localStorage.getItem('UserID') +
      //     "&user_Token=" +
      //     this.FileUPloadForm.get("User_Token").value;
      //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      //     this.BranchList = data;
      //     this._FilteredList = data;
      //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      //   });
      // }


      geBranchListByUserID(userid: number) {
        //     alert(this.BranchMappingForm.value.UserID);
        this.geBranchList(userid);
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

      // GetEntityList() {
      //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      //   const apiUrl =
      //     this._global.baseAPIUrl +
      //     "SubfolderController/GetSubfolderList?ID=" +
      //     localStorage.getItem('UserID') +
      //     "&user_Token=" +
      //     this.FileUPloadForm.get("User_Token").value;
      //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      //     this.EntityList = data;
      //    // this._EntityFilteredList = data;
      //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      //   });
      // }


    //   getDepartmnet() {

    //     const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token');
    //     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    //     this._DepartmentList = data;
    //    // this._DepartmentLists=data;
    // //    console.log("data : -", data);
       
        
    
    //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    //     });
    
    //     }

        getEntityForUser(userid: number) {
          this.getEntity(userid);
        }


        getEntity(userid: number) {
          const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetSubFolderByBranch?UserID="+localStorage.getItem('UserID')+"&CreatedBy="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token')+"&BranchID="+this.FileUPloadForm.get("BranchID").value;
      
       //   const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetDetails?ID="+userid+"&user_Token="+this.EntityMappingForm.get("User_Token").value;;
          //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
          this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
            this.EntityList = res;

            //  this.checkbox_list = [];
            //this.checkbox_list = res;
            //this.checklistArray.clear()
            // this.checkbox_list.forEach(item => {
            //   let fg = this.formBuilder.group({
            //     id: [item.id],
            //     SubfolderName: [item.SubfolderName],
            //     ischecked: [item.ischecked]
            //     })
            //     this.checklistArray.push(fg)
            // });
          //  console.log('Branch Mapping -> ',res);
            
            // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())
      
            //this.productsArray = res;
            //  this.checkbox_list= res;
            //this.checklist =res;
          });
        }

      GetEntityList() {
        //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
        const apiUrl =
          this._global.baseAPIUrl +
          "SubFolderMapping/GetSubFolderByBranch?ID=" +
          localStorage.getItem('UserID')  +
          "&user_Token=" +
          this.FileUPloadForm.get("User_Token").value;
        this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
          this.EntityList = data;
          this.FileUPloadForm.controls['SubfolderID'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }

      
    getDepartmnet(RootID: any) {

      const apiUrl = this._global.baseAPIUrl + "Department/GetDepartmentByUserID?UserID="+localStorage.getItem('UserID')+"&RoleID="+RootID+"&user_Token="+localStorage.getItem('User_Token');
 
   //   const apiUrl=this._global.baseAPIUrl+'Department/GetDepartmentByUserID?user_Token='+ localStorage.getItem('User_Token');
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._DepartmentList = data;
     // this._DepartmentLists=data;
  //    console.log("data : -", data);
      this.FileUPloadForm.controls['DeptID'].setValue(0);
      this.FileUPloadForm.controls['BranchID'].setValue(0);
       
      this.FileUPloadForm.controls['SubfolderID'].setValue(0);  
     // this.RegionMappingForm.controls['DeptIDS'].setValue(0);
     this.geBranchList(0);
  
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      });
  
      }
  
  
      // getDeparmenList() {  
  
      // const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+localStorage.getItem('User_Token');
      // this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      // this._DeparmentList = data;
      // this.FileUPloadForm.controls['DeptID'].setValue(0);
      // //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      // });
      // }

      // geTemplateNameListByTempID(temp:any)
      // {

      //   console.log("apiUrl");
      //   this.getDoctypeListByTempID();
      // }


      geTemplateNameListByTempID(n:any) {
         //  console.log("apiUrl");
        this.getDoctypeListByTempID();
      }

  
      getDeptList() {  
  
      const apiUrl=this._global.baseAPIUrl+'DocMaster/GetDocList?user_Token='+localStorage.getItem('User_Token');
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._DeptList = data;
      this.FileUPloadForm.controls['DocID'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      });
      }

      geTTempList() {

        //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.DataEntryForm.get('User_Token').value;
        const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+this.FileUPloadForm.get('User_Token').value  
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
        this._TemplateList = data;
        this.FileUPloadForm.controls['TemplateID'].setValue(0);
        //    console.log("this._TemplateLis", data)
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
    
        }

      // geDoctypeList() {
    
      //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      //   const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/GetDocTypeDetailsUserWise?ID=' + localStorage.getItem('UserID') + '&user_Token='+this.FileUPloadForm.get('User_Token').value
      //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      //     this._DeptList = data;
      //     this.FileUPloadForm.controls['DocID'].setValue(0);
      //   //  console.log("_DeptList",this._DeptList);

      //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      //   });
      // }

      getDoctypeListByTempID() {
    
        //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
        const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/getDoctypeListByTempID?ID=' + localStorage.getItem('UserID') + '&TemplateID='+this.FileUPloadForm.get('TemplateID').value +'&user_Token='+this.FileUPloadForm.get('User_Token').value
//      console.log("apiUrl",apiUrl);
      
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._DeptList = data;
          this.FileUPloadForm.controls['DocID'].setValue(0);
        //  console.log("_DeptList",this._DeptList);

          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }
  
      getFileDetails (e) {
        //console.log (e.target.files);
        this.myFiles = [];
        for (var i = 0; i < e.files.length; i++) {
          this.myFiles.push(e.files[i]);
        }
        this._IndexList = e.files;
      }
  
      public uploadFile = (files) => {
        if (files.length === 0) {
          return;
        }

        if (this.validation()  ==false)
        {
          return;
        }
        
       
        let filesToUpload : File[] = files;
        const formData = new FormData();        
          
        Array.from(filesToUpload).map((file, index) => {
          return formData.append('file'+index, file, file.name);
        });      
  
        formData.append('BranchID',this.FileUPloadForm.controls['BranchID'].value);
        formData.append('DeptID',this.FileUPloadForm.controls['DeptID'].value);
        //DeptID
        formData.append('DocID',"0");
        formData.append('TemplateID',this.FileUPloadForm.controls['TemplateID'].value);
        formData.append('UserID',localStorage.getItem('UserID'));
        formData.append('SubfolderID',this.FileUPloadForm.controls['SubfolderID'].value);    
        
        
     //   this.DataUploadForm.controls['BranchID'].value;
        //const apiUrl=this._global.baseAPIUrl+'DocMaster/GetDocList?user_Token=123123'
        const apiUrl = this._global.baseAPIUrl + 'FileUpload/UploadFiles';
        this.http.post(apiUrl, formData, {reportProgress: true, observe: 'events'})
          .subscribe(event => {


          //  alert(event.type);
            if (event.type === HttpEventType.UploadProgress)
            
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
            //  alert(event.type);
             // alert(HttpEventType.Response);
              this.message = 'Upload success.';
            this.onUploadFinished.emit(event.body);
            } else {
              this.message = 'in Else Event'+event.type;
            }
          });
      }
  
      uploadFiles(fileUpload) {
      //  console.log(this.FileUPloadForm);
        //console.log(this.FileUPloadForm.valid);

//console.log("Branch",this.FileUPloadForm.controls['BranchID'].value);
//console.log("TemplateID",this.FileUPloadForm.controls['TemplateID'].value);

          if (this.FileUPloadForm.controls['BranchID'].value <= 0)
          {
            this.showmessage("Select Customer");
              return;

          }
          if (this.FileUPloadForm.controls['TemplateID'].value <= 0)
          {
            this.showmessage("Select Template");
              return;

          }
          if (this.FileUPloadForm.controls['SubfolderID'].value <= 0)
          {
            this.showmessage("Select SubfolderID");
              return;

          }


        
        if(this.FileUPloadForm.invalid) {
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select <br> <b>Branch</b><br><b>Department</b><br><b>Document Type</b><br> before uploading!</span></div>',
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
        } else {
          const frmData = new FormData();
  

          for (var i = 0; i < this.myFiles.length; i++) { 
          //  console.log("FileSize",this.myFiles[i]);
            frmData.append("fileUpload", this.myFiles[i]);
           // frmData.append("FileSize", this.myFiles[i].);
          }
          frmData.append('BranchID',this.FileUPloadForm.controls['BranchID'].value);
          frmData.append('DeptID',this.FileUPloadForm.controls['DeptID'].value);
          frmData.append('DocID',"0");
          frmData.append('TemplateID',this.FileUPloadForm.controls['TemplateID'].value);
          frmData.append('UserID',localStorage.getItem('UserID'));  
          frmData.append('SubfolderID',this.FileUPloadForm.controls['SubfolderID'].value);        
         
          const apiUrl = this._global.baseAPIUrl + 'FileUpload/UploadFiles';
          this.httpService.post(apiUrl, frmData).subscribe(
            data => {
              // SHOW A MESSAGE RECEIVED FROM THE WEB API.

              fileUpload.clear();
              this.myFiles = [];

              var strmsg =data;

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
            //  console.log (this.sMsg);()
              var strmsg =data;
           this.downloadFile(data);
              this.OnReset();    
              this.myFiles = [];                   
            },
             
          );
        }

        
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
                "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
      
      
        }
      
        validation()
        {
            // if (this.FileUPloadForm.get('BranchID').value <=0 )
            // {
            //          this.showmessage("Please Select Branch");
            //           return false;
            // }

            if (this.FileUPloadForm.get('DeptID').value <=0 )
            {
                     this.showmessage("Please Select Department");
                      return false;
            }
            return true;
      
        } 
        
        getRootList() {
    
          const apiUrl=this._global.baseAPIUrl+"RootMaster/GetRootByUserID?UserID="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token'); 
          this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
            this._RootList = data;
         //  this._FilteredList = data
         this.FileUPloadForm.controls['DeptID'].setValue(0);
         this.FileUPloadForm.controls['BranchID'].setValue(0);
         this.FileUPloadForm.controls['SubfolderID'].setValue(0);  
           //console.log(this._FilteredList );
            //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
          });
        }
        
}
