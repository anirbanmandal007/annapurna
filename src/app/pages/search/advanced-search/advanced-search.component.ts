import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef,EventEmitter,Output } from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { saveAs } from 'file-saver';

declare var $: any;

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-advanced-search",
  templateUrl: "advanced-search.component.html",
  styleUrls: ["advanced-search.component.css"]
})
export class AdvancedSearchComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;  
  _FilteredList :any; 
  _TemplateList :any;  
  TemplateList:any;
  AdvancedSearchForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';  
  //UploadDocForm: FormGroup;  
  _SingleDepartment:any
  _ColNameList:any;
  _DepartmentList: any;
  _BranchList: any;
  _FileNo: any = "";
  _PageNo: number = 1;
  FilePath:any="../assets/1.pdf";  
  _TempFilePath:any;
  _isDownload: any = localStorage.getItem('Download');
  _isDelete: any = localStorage.getItem('Delete');
  _TotalPages: any = 0;
  _SearchByList: any;
  userID = 1;
  TempField:any =localStorage.getItem('FileNo');
  _isEmail: any = false;
  _ShareLink: any = false;
  _DocTypeList: any;
  _FileList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  _MDList:any;
  _IndexList:any;

  _FileDetails:string [][] = [];
  
  @Output() public onUploadFinished = new EventEmitter();
      
    constructor(
      private modalService: BsModalService,
      private _onlineExamService: OnlineExamServiceService,
      private _global: Globalconstants,
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private httpService: HttpClient,
      public toastr: ToastrService,
      private route: ActivatedRoute,
      private router: Router,
    
  
    ) { }
  
    ngOnInit() {
      document.body.classList.add('CS');
      this.AdvancedSearchForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      TemplateID: [0, Validators.required],                
      _ColNameList: this._ColNameList,
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      Viewer: [''],
      currentPage: [0],      
      PageCount: [0],
      //tickets: new FormArray([]),
      SerchBy: [''],
      DocID: [''],
      SearchByID: [],
      userID: localStorage.getItem('UserID') ,
      ACC: [''],
      MFileNo: [''],
      DocuemntType: [''],
      AccNo: [''],     
      ToEmailID:[''],
      ValidDate:[''],
      IsAttachment:['']
  
      });
      this.getTemplate();
      this._PageNo = 1;
      this.getSearchResult(1);

      this._isEmail= localStorage.getItem('Email');
      this._ShareLink= localStorage.getItem('Link');
    }
    entriesChange($event) {
      this.entries = $event.target.value;
    }
    filterTable($event) {
      console.log($event.target.value);
  
      let val = $event.target.value;
      this._FilteredList = this._FileList.filter(function (d) {
        console.log(d);
        for (var key in d) {
          if (key == "AccNo" || key == "BranchName" || key == "DocType" ) {
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
      OnReset() {  
      this.Reset = true;
      this.AdvancedSearchForm.reset();       
      } 

      geTemplateNameListByTempID(TID: number) {
      
        this.getSearchResult(TID);
        this.getSearchParameterList();
        this.getDoctypeListByTempID();

      
      }

      getTemplate() {

        const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    
        // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this.TemplateList = data;
          this.AdvancedSearchForm.controls['TemplateID'].setValue(1);
          //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }

      getDoctypeListByTempID() {
    
        //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
        const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/getDoctypeListByTempID?ID=' + localStorage.getItem('UserID') + '&TemplateID='+this.AdvancedSearchForm.get('TemplateID').value +'&user_Token='+ localStorage.getItem('User_Token') 
//      console.log("apiUrl",apiUrl);
      
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._DocTypeList = data;
          this.AdvancedSearchForm.controls['DocID'].setValue(0);
        //  console.log("_DeptList",this._DeptList);

          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }
           
    
      getSearchResult(tempID:any) {

     //   const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
     
      //    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&TemplateID=' + tempID  
     
      // const apiUrl="https://demo2993066.mockable.io/getAllData";
    this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {
          this._FileList = data;
          this._FilteredList = data;
          this.GetDisplayField(1);

        //  console.log("Loggg",data);
        });
      }
      
      getSearchParameterList() {
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchParameterList?ID=' + this.AdvancedSearchForm.controls['TemplateID'].value + '&user_Token='+ localStorage.getItem('User_Token')
    
        //  const apiUrl=this._global.baseAPIUrl+'SearchFileStatus/getSearchParameterList?user_Token=123123'
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._SearchByList = data;
          
          this.AdvancedSearchForm.controls['SearchByID'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }

    GetDisplayField(TID:number) {
      const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+ this.AdvancedSearchForm.get('TemplateID').value +'&user_Token='+ localStorage.getItem('User_Token') 
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
        this._ColNameList = data;
        this.prepareTableData(this._FilteredList, this._ColNameList);
      });
    }

    
    formattedData: any;
    headerList: any;
    immutableFormattedData: any;
    prepareTableData(tableData, headerList) {
      let formattedData = [];
      let tableHeader: any = [
        { field: 'srNo', header: "SR No", index: 1 },
        // { field: 'accId', header: 'Acc ID', index: 2 },
        { field: 'branch', header: 'Branch', index: 3 },
      //  { field: 'department', header: 'Department', index: 4 },
        { field: 'docType', header: 'Doc Type', index: 5 },
        { field: 'pageCount', header: 'Page Count', index: 6 }
      ];
      headerList.forEach((el, index) => {
        tableHeader.push({
          field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(7+index)
        })
      })
      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'accId': el.Ref1,
          'branch': el.BranchName,
        //  'department': el.DepartmentName,
          'docType': el.DocType,
          'pageCount': el.DocCount,
          'AccNo': el.AccNo,
          'TemplateID': el.TemplateID,
          'RelPath': el.RelPath,
          'FilePath': el.FilePath,
          'ACC': el.ACC,
          'DocID': el.DocID,
          'profileImg': el.PhotoPath
        });
        headerList.forEach((el1, i) => {
          formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
        });
      });
      this.headerList = tableHeader;
      this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
      this.formattedData = formattedData;
    }

    searchTable($event) {
      // console.log($event.target.value);
  
      let val = $event.target.value;
      if(val == '') {
        this.formattedData = this.immutableFormattedData;
      } else {
        let filteredArr = [];
        const strArr = val.split(',');
        this.formattedData = this.immutableFormattedData.filter(function (d) {
          for (var key in d) {
            strArr.forEach(el => {
              if (d[key] && el!== '' && (d[key]+ '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
                if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                  filteredArr.push(d);
                }
              }
            });
          }
        });
        this.formattedData = filteredArr;
      }
    }



      DownloadFileAll(_FileNo: any, _FilePath: any) {

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFile?ID=' + localStorage.getItem('UserID') + '&_filePath= '+_FilePath +' &user_Token='+ localStorage.getItem('User_Token');
        this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          if (res) {         
   
      //      var __FilePath = _TempFilePath ;    
          //  console.log("Final FP-- res ", res);   
            saveAs(res, _FileNo + '.pdf');

          }
        });
    
      }


      downloadFile(row: any) {

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+row.DocID+'&_fileName='+row.AccNo+'&user_Token='+localStorage.getItem('User_Token');
        this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          if (res) {
          
              saveAs(res, row.ACC + '.pdf');

          }
        });
    
      }
        
      Setfavourite(FileName: any) {

        this.AdvancedSearchForm.patchValue({
          ACC: FileName,
          User_Token: localStorage.getItem('User_Token'),
          userID: localStorage.getItem('UserID')
        });
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Setfavourite';
        this._onlineExamService.postData(this.AdvancedSearchForm.value, apiUrl)
        .subscribe( data => {
          swal.fire({
            title: "Favourite!",
            text: "Doc Type has been favourite",
            type: "success",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-primary",
          });
          
        });
    
      }
    
      DeleteFile(Row: any) {
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
              this.AdvancedSearchForm.patchValue({
                ACC: Row.AccNo,
                User_Token: localStorage.getItem('User_Token'),
                userID: localStorage.getItem('UserID'),
                DocID: Row.DocID
              });
              const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Delete';
              this._onlineExamService.postData(this.AdvancedSearchForm.value,apiUrl)     
              .subscribe( data => {
                  swal.fire({
                    title: "Deleted!",
                    text: "Doc Type has been deleted.",
                    type: "success",
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-primary",
                  });
                
                });
            }
          });
          this.getSearchResult(this.AdvancedSearchForm.get('TemplateID').value);
      }

      // Model Popup For Docuemnt Inserstion 
    
      showModal(Row: any): void {
    
        if (Row != null) {
          this._FileNo = Row.AccNo;
          this._DocID = Row.DocID;
          this._DocName = Row.ACC
          this.AdvancedSearchForm.controls['MFileNo'].setValue(this._FileNo);
          this.AdvancedSearchForm.controls['DocuemntType'].setValue(this._DocName);
        }
        // 
       $("#myModal").modal('show');
    
    
      }
      sendModal(): void {
        //do something here
        this.hideModal();
      }
      hideModal(): void {
        document.getElementById('close-modal').click();
        //this.getSearchResult();
      }
    
      getFileDetails(e) {
        //console.log (e.target.files);
        for (var i = 0; i < e.target.files.length; i++) {
          this.myFiles.push(e.target.files[i]);
        //  console.log("File",this.myFiles);

        }
        //this._IndexList = e.target.files;
      }
    
      uploadFiles() {
    
        const frmData = new FormData();
    
        for (var i = 0; i < this.myFiles.length; i++) {
          frmData.append("fileUpload", this.myFiles[i]);
        }
    
        // this._FileNo =Row.id;   
        // this._DocID =Row.DocID;    
        // this._DocName = Row.ACC
    
        frmData.append('DocID', this._DocID);
        frmData.append('AccNo', this._FileNo);
        frmData.append('ACC', this._DocName);
        frmData.append('UserID', localStorage.getItem('UserID'));
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Upload';
        this.httpService.post(apiUrl, frmData).subscribe(
          data => {
            // SHOW A MESSAGE RECEIVED FROM THE WEB API.
            this.toastr.show(
              '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> '+ data +' </span></div>',
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
          },
    
        );

        this.getSearchResult(this.AdvancedSearchForm.get('TemplateID').value);
      }
 
    
      EditRowData(Row: any) {
        
        localStorage.setItem('FileNo', Row.AccNo);
        localStorage.setItem('TemplateID', Row.TemplateID);
        
        //this.localStorage.setItem('_TempID') =_TempID;
        this.router.navigate(['/process/EditIndexing']);
      }


      MetaData(template: TemplateRef<any>, row: any)
      {
        //FileNo: localStorage.getItem('FileNo'),
      //  TemplateID:localStorage.getItem('TemplateID')  
      let  __FileNo =row.AccNo;
      let  __TempID = row.TemplateID;

      const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');
  
      //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  
         this._IndexList = data;           
         //console.log("Index",data);
      });
      // this.modalRef = this.modalService.show(template);
      }
    hidepopup()
    {
    // this.modalService.hide;
      this.modalRef.hide();
      //this.modalRef.hide
    }

      UploadDocModal(template: TemplateRef<any>, row: any) {
        var that = this;
        that._SingleDepartment = row;
       // console.log('data', row);
        this._FileNo = row.AccNo;
        this._DocID = row.DocID;
        this._DocName = row.ACC


        if (row != null) {

          this.AdvancedSearchForm.controls['MFileNo'].setValue(this._FileNo);
          this.AdvancedSearchForm.controls['DocuemntType'].setValue(this._DocName);
        }

        //console.log('form', this.UploadDocForm);
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      this.modalRef = this.modalService.show(template);
    }

    ViewDocument(template: TemplateRef<any>, row: any, indexTemplate: TemplateRef<any>) {
      this.MetaData(indexTemplate, row);
      this.FilePath = row.RelPath;
      this._TempFilePath =row.RelPath;
      this.modalRef = this.modalService.show(template);
      $(".modal-dialog").css('max-width', '1330px');
      this.GetDocumentDetails(row);
    }

    profileImg: any;
    documentDetails: any;
    GetDocumentDetails(row: any) {      
      this.profileImg = row.profileImg;
      console.log("row.Photopath",row);
      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetDocumentDetails?FileNo=' + row.AccNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')

      // const apiUrl="https://demo2993066.mockable.io/getAllData";

      this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {

        // this._IndexList = data;
        // this._FilteredList = data;
        this.documentDetails = data;
      });
    }

    showDocument(doc) {

     /// this.FilePath = doc.RelPath;
      //console.log("Row**",doc);
      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+doc.DocID+'&_fileName='+doc.AccNo+'&user_Token='+localStorage.getItem('User_Token');
      this._onlineExamService.getDataById(apiUrl).subscribe(res => {
        if (res) {
  
      //    console.log("res",res);
          this.FilePath = res;
           /// saveAs(res, row.ACC + '.pdf');
  
        }
      });
    }

    ngOnDestroy() {
      document.body.classList.remove('CS');
    }

    selectAllRows = false;
    selectAllRow(e) {
      this.selectedRows = [];
      this.selectedRowsForMetadata = [];
      if (e.checked) {
        this.selectAllRows = true;
        this.formattedData.forEach(el => {
          this.selectedRows.push(el.AccNo +"_" + el.DocID);
          this.selectedRowsForMetadata.push(el.AccNo);
        })
      } else {
        this.selectAllRows = false;
    }
  }

  selectedRows = [];
  selectedRowsForMetadata = [];
  selectRow(e, row) {
    this.selectAllRows = false;
    e.originalEvent.stopPropagation();
    if (e.checked) {
      this.selectedRows.push(row.AccNo +"_" + row.DocID);
      this.selectedRowsForMetadata.push(row.AccNo);
    } else {
      var index = this.selectedRows.indexOf(row.AccNo +"_" + row.DocID);
      this.selectedRows.splice(index, 1);
      var indexMetadata = this.selectedRows.indexOf(row.AccNo);
      this.selectedRows.splice(indexMetadata, 1);
    }
  }

  dowloadSelectedTagging() {
    //  console.log("Rows--",this.selectedTaggingRows);
  
    // console.log("selectedTaggingRows**",this.selectedTaggingRows);
     const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadBulkTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+1+'&_fileName='+this.selectedRows+'&user_Token='+localStorage.getItem('User_Token');
     this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
       if (res) {
       
         //  saveAs(res, "TaggedFiles" + '.pdf');
  
           saveAs(res, "TaggedFiles" + '.zip');  
  
       }
     });
  
  
    }

  DownloadBulkFiles() {
    console.log("DownloadBulkFiles", this.selectedRows);

    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
   // console.log("CSV Data", _CSVData);
    this.downloadBulkFileBYCSV(_CSVData) ;
  }

  downloadBulkFileBYCSV(_CSVData:any) {
       
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {

      
      saveAs(res, "Files" + '.zip');  
       
      }
       console.log("Final FP-- res ", res);  
    });

  }
  _HeaderList: any;
  GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j].DisplayName +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  this._HeaderList += '\n';
  let that = this;
  this._MDList.forEach(stat => {
    // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList += (j==0?(stat['Ref'+(j+1)]+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;
      }
    // }
    this._HeaderList += '\n'
  });
  

}

  DownloadMetadata() {
    let _CSVData = "";
    for (let j = 0; j < this.selectedRowsForMetadata.length; j++) {          
      _CSVData += this.selectedRowsForMetadata[j] + ',';
    }
    const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._MDList = data;
      this.GetHeaderNames();
      let csvData = this._HeaderList; 
      // alert(this._HeaderList);
      // console.log("Data",csvData) 
      let blob = new Blob(['\ufeff' + csvData], { 
          type: 'text/csv;charset=utf-8;'
      }); 
      let dwldLink = document.createElement("a"); 
      let url = URL.createObjectURL(blob);
      
      let isSafariBrowser =-1;
      // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
      // navigator.userAgent.indexOf('Chrome') == -1; 
      
      //if Safari open in new window to save file with random filename. 
      if (isSafariBrowser) {  
          dwldLink.setAttribute("target", "_blank"); 
      } 
      dwldLink.setAttribute("href", url); 
      dwldLink.setAttribute("download", 'data' + ".csv"); 
      dwldLink.style.visibility = "hidden"; 
      document.body.appendChild(dwldLink); 
      dwldLink.click(); 
      document.body.removeChild(dwldLink);
    });

  }


  ShareLink(template: TemplateRef<any>)
  {
    var that = this;
  console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.AdvancedSearchForm.controls['ACC'].setValue(_CSVData);
    this.AdvancedSearchForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }

    this.modalRef = this.modalService.show(template);

  }

  onSendEmailByShare() {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmailBulkFiles';
   
    this._onlineExamService.postData(this.AdvancedSearchForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
     
  }
  SendBulkEmail(template: TemplateRef<any>)
  {
    var that = this;
  console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.AdvancedSearchForm.controls['ACC'].setValue(_CSVData);
    this.AdvancedSearchForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }
    this.modalRef = this.modalService.show(template);

  }

  onSendEmail() {

  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SendBulkTagFileOnMail';
  //  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SendBulkTagFileOnMail?ID='+localStorage.getItem('UserID')+'&DocID='+1+'&_fileName='+ this.ContentSearchForm.controls['FileNo'].value +'&user_Token='+localStorage.getItem('User_Token');
    
    this._onlineExamService.postData(this.AdvancedSearchForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
      this.modalRef.hide();
     // this.getSearchResult();   
  }
  
      
}
