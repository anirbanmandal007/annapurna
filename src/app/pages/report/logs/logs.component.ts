import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import noUiSlider from "nouislider";
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;
import Quill from "quill";
import Selectr from "mobius1-selectr";

import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-logs",
  templateUrl: "logs.component.html",
})
export class LogsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  LogReportForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
 
  _ColNameList = ["UserName","FileNo", "Activity", "LogDate"];


  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private http: HttpClient,
    private httpService: HttpClient
    

  ) {}
  ngOnInit() {
    this.LogReportForm = this.formBuilder.group({
      DATEFROM: ['', Validators.required],
      DATETO: ['', Validators.required],  
      ActiivtyID:[''],  
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: localStorage.getItem('UserID') ,      
    });
    this.LogReportForm.controls['ActiivtyID'].setValue(0);    
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
  //  console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._StatusList.filter(function (d) {
    //  console.log(d);
      for (var key in d) {
        if (key == "UserName" || key == "FileNo" || key == "Activity") {
          if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
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
    this.LogReportForm.reset();
  }

  onSearch()
  {
    this.getLogList();
  }

  // getStatusList() {  
  //   const apiUrl = this._global.baseAPIUrl + 'Status/GetStatusReport';          
  //   this._onlineExamService.postData(this.StatusReportForm.value,apiUrl)
  //   // .pipe(first())

  //   .subscribe( data => {
  //     alert(data);
  //     this._StatusList = data;          

  // });


  // } 
  
  // getLogList() {  

  //   const apiUrl = this._global.baseAPIUrl + 'Status/GetActivityReport';    
  //  // const apiUrl = this._global.baseAPIUrl + 'Status/GetStatusReport';          
  //   this._onlineExamService.postData(this.LogReportForm.value,apiUrl)
  //   // .pipe(first())

  //   .subscribe( data => {
  //     alert(data);
  //     this._StatusList = data;          
  //     this._FilteredList = data;          

  // });

  // }

  onDownload()
  {
    this.downloadFile();
  }


  GetHeaderNames()
  {
    this._HeaderList="";
    for (let j = 0; j < this._ColNameList.length; j++) {  
         
        this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < this._ColNameList.length; j++) {  
        this._HeaderList += (stat[this._ColNameList[j]]) + ((j <= this._ColNameList.length-2)?',':'') ;
        // headerArray.push(headers[j]);  
      }
      this._HeaderList += '\n'
    });
      
  }
  
  downloadFile() { 
    this.GetHeaderNames()
    let csvData = this._HeaderList;     
  //  console.log(csvData) 
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
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
    dwldLink.setAttribute("download",  "LogReport" + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
  } else {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
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
  }
 
  isValid() {
    return this.LogReportForm.valid 
  }


  // downloadFile() { 
  //   //let csvData = this._HeaderList;     
  //   console.log( this._StatusList) 
  //   let blob = new Blob(['\ufeff' +  this._StatusList], { 
  //       type: 'text/csv;charset=utf-8;'
  //   }); 
  //   let dwldLink = document.createElement("a"); 
  //   let url = URL.createObjectURL(blob); 
  //   let isSafariBrowser =-1;
  //   // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
  //   // navigator.userAgent.indexOf('Chrome') == -1; 
    
  //   //if Safari open in new window to save file with random filename. 
  //   if (isSafariBrowser) {  
  //       dwldLink.setAttribute("target", "_blank"); 
  //   } 
  //   dwldLink.setAttribute("href", url); 
  //   dwldLink.setAttribute("download",  "LogReport" + ".csv"); 
  //   dwldLink.style.visibility = "hidden"; 
  //   document.body.appendChild(dwldLink); 
  //   dwldLink.click(); 
  //   document.body.removeChild(dwldLink); 
  // }

  getLogList() {  

  // var  dateCreated = formatDate(`${dateCreated}`.replaceFunction('/','-'),'full','es-CO');

    const apiUrl = this._global.baseAPIUrl + 'Status/GetActivityReport';          
    this._onlineExamService.postData(this.LogReportForm.value,apiUrl)
        // .pipe(first())
    .subscribe( data => {
      this._StatusList = data;          
      this._FilteredList = data;   
      
     //console.log("Log",data);

  });


  } 

 
}

