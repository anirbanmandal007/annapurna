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
  selector: "app-bulkfoldermapping",
  templateUrl: "bulkfoldermapping.component.html",
})
export class BulkFolderMappingComponent implements OnInit {
entries: number = 10;
selected: any[] = [];
temp = [];
activeRow: any;
SelectionType = SelectionType;
modalRef: BsModalRef;
_SingleDepartment: any;
submitted = false;
Reset = false;     
sMsg: string = '';      
_FilteredList = []; 
TemplateList:any;
_IndexList:any;
_Records :any; 
DataUploadForm: FormGroup;

public message: string;
_HeaderList: any;
_ColNameList = [];
_CSVData: any;
public records: any[] = [];
papa: any;
_TempID: any = 0;

myFiles:string [] = [];
_FileDetails:string [][] = [];
first = 0;
rows = 10;

@Output() public onUploadFinished = new EventEmitter();
  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
  ) {}
  ngOnInit() {
    this.DataUploadForm = this.formBuilder.group({     
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],     
       CSVData:[""]
    });     
this.BindHeader(this._FilteredList,this._FilteredList);
this.prepareTableData(this._FilteredList,this._FilteredList);
this.onSubmit()
  }
   

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
 //   console.log($event.target.value);

    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
    //  console.log(d);
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
    
  }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    //console.log(this.DataUploadForm);
    
    if(this.DataUploadForm.valid && files.length>0) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        var csv = event.target.result; // Content of CSV file
        this.papa.parse(csv, {
          skipEmptyLines: true,
          header: true,
          complete: (results) => {
            for (let i = 0; i < results.data.length; i++) {
              let orderDetails = {
                order_id: results.data[i].Address,
                age: results.data[i].Age
              };
              this._Records.push(orderDetails);
            }
            // console.log(this.test);
            // console.log('Parsed: k', results.data);
          }
        });
      }
    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select <br> <b>Csv File</b><br><b>Template</b><br> before uploading!</span></div>',
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

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      
      let input = $event.target;
      let reader = new FileReader();
     // console.log(input.files[0]);
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;

        // alert(headersRow);
        // alert(this._ColNameList);
        //let ColName = 
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
        //  console.log('Not Valid File', csvRecordsArray);
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
       
  
          this._FilteredList = this.records;

          console.log(this.records);
          console.log("_FilteredList",this._FilteredList);

          this.prepareTableData(this._FilteredList,this._FilteredList);

          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
        //  console.log('Records', this._FilteredList);
        }
  

      };

      reader.onerror = function () {
       // console.log('error is occurred while reading file!');
      };

    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
      this.fileReset();
    }
    this._FilteredList = this.records
  }

  checkDateFormat(date) {
  //  console.log("Date",date);

    if (date !="")
    {
    let dateArr = date.split('-');
    const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
    if(isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
      return false;
    }
    if(isNaN(new Date(dateString).getTime())) {
      return false;
    }
    return true;
  }
  else
  {
    return true;
  }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        const single = []
        for (let i = 0; i < this._ColNameList.length; i++) {
          single.push(curruntRecord[i].toString().trim())
        }
        csvArr.push(single)
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    var  headers;
   // headers ="NewCBSAccountNo,ApplicationNo,CBSCUSTIC,Team,HandliedBy,ProductCode,Product,ProductDescription,JCCode,JCName,Zone,CustomerName,DBDate,FinalRemarks,DisbursedMonth";
   headers ="Cabinet,Folder,Subfolder,User";
 
   // let headerArray = [];
    // for (let j = 0; j < headers.length; j++) {
    //   headerArray.push(headers[j]);
    // }

    return headers;


  }

  fileReset() {
    //this.csvReader.nativeElement.value = "";  
    this.records = [];
  }

  onSubmit() {

        this.submitted = true;      
  
 if(this._CSVData != null && this._CSVData != undefined)
 {

    this.DataUploadForm.patchValue({
      id: localStorage.getItem('UserID'),
      CSVData: this._CSVData,     
      User_Token: localStorage.getItem('User_Token')   

    });    

    const apiUrl = this._global.baseAPIUrl + 'DataUpload/BulkFolderMapping';
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
      // .pipe(first())
      .subscribe(data => {
        
      // alert(data);
        this.showSuccessmessage(data); 

      });

    //  }     
    }
    else
    {
      this.showmessage("please select file"); 

    }
  }

  ShowErrormessage(data:any)
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
 

  onFormat(csvRecordsArr: any) {
    //   let dt;



  }

  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
 
//console.log(headers);
//console.log(this._ColNameList);
    if (headers.length != 4) {
     // alert('Invalid No. of Column Expected :- ' + this._ColNameList.length);
     var msg= 'Invalid No. of Column Expected :- ' + this._ColNameList.length; 
     //this.showmessage(msg);
     this.ShowErrormessage(msg);

      return false;
    }
   // this._HeaderList ="POD No,Invoice Details,Invoice No,Invoice Date,Vendor Name,Barcode No";
    
   this._ColNameList[0] ="Cabinet";
    this._ColNameList[1] ="Folder";
    this._ColNameList[2] ="Subfolder";
    this._ColNameList[3] ="User";
     

    return true;
  }


  GetHeaderNames() {
    this._HeaderList = "";
  
    this._HeaderList ="Cabinet,Folder,Subfolder,User";

  }

  downloadFile() {
    const filename = 'bulkfoldermapping_CSVFileUpload';
     
    let csvData = "Cabinet,Folder,Subfolder,User";    
    //console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], {
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

  showSuccessmessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"> </span> <span data-notify="message"> '+ data +' </span></div>',
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

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
   // alert(this.type);
  
  // if (this.type=="Checker" )
  //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'Cabinet', header: "CABINET", index: 1 },
      { field: 'Folder', header: 'FOLDER', index: 3 },
      { field: 'Subfolder', header: 'SUBFOLDER', index: 2 },
      { field: 'User', header: 'USER', index: 2 },
    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Cabinet': el.Cabinet,
        'Folder': el.Folder,
        'Subfolder': el.Subfolder,
        'User': el.User
      });
   
    });
    this.headerList = tableHeader;
  //}
  
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  
   // console.log("this.formattedData", this.formattedData);
  }
  
  BindHeader(tableData, headerList) {
    let formattedData = [];
   // alert(this.type);
  
  // if (this.type=="Checker" )
  //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'Cabinet', header: "CABINET", index: 1 },
      { field: 'Folder', header: 'FOLDER', index: 3 },
      { field: 'Subfolder', header: 'SUBFOLDER', index: 2 },
      { field: 'User', header: 'USER', index: 2 },
    ];
   
    
    this.headerList = tableHeader;
  //}
  
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  
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

  
paginate(e) {
this.first = e.first;
this.rows = e.rows;
}
 

 
}
