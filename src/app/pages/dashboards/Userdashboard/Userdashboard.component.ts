import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

//import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import { Label } from 'ng2-charts';

// Themes begin
am4core.useTheme(dataviz);
am4core.useTheme(am4themes_animated);
// Themes end


import { AxisRenderer } from '@amcharts/amcharts4/charts';

@Component({
  selector: "app-dashboard",
  templateUrl: "Userdashboard.component.html",
  styleUrls: ["Userdashboard.component.css"]
})

export class UserdashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;

  public clicked: boolean = true;
  public clicked1: boolean = false;
  public chartFirst: any;
  public chartFirstFU: any;
  public chartActivity: any;
  public updateActivityChartInterval;


  activeRow: any;
  UserID:any;
  UserDashboardForm: FormGroup;   
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _StatusList :any; 
  _LogList :any; 
  DatauploadCount:0;
  TaggingCount:0;
  FileUploadCount:0;
  UserCount:0;
  _ActivityList :any;
  activityChartData:any;
  firstChartData:any;
  firstChartDataFU:any;
  _UserL:any;  
  _UploadList:any;
  _ActivityLog:any;
  activitylogChartData:any;
  chartActivityLog:any;

  constructor(
     private formBuilder: FormBuilder,
     private _onlineExamService: OnlineExamServiceService,
     private _global: Globalconstants,
    private zone: NgZone
  ) { }

  ngOnInit() {

     this.UserDashboardForm = this.formBuilder.group({
       BranchName: ['', Validators.required],
      User_Token:localStorage.getItem('User_Token'),
      UserID:[0, Validators.required],
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
     });
   //  this.geBranchList();

   this.BindUserLog();
   this.StatusList();
   this.GetUploadList();
  this.BindFileUpload();

   //this.CheckAccessRight();


    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];


    //amChart Code Start
    // Create chart instance
    //amChart Code Start
    // Create chart instance
    var chart = am4core.create("chart-sales-dark", am4charts.XYChart);
    
    this.chartFirst = chart;
    this.chartFirst.logo.disabled = true;
    //chart.dateFormatter.dateFormat = "MM/dd/yyyy hh:mm:ss a";

    // Increase contrast by taking evey second color
    chart.colors.step = 2;

    // Add data

  
   this.chartFirst.data=this.GetUploadList(); 
   // Uncomment below line
  // this.chartFirst.data=this.generateChartData(30); 

   let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    // Create series
    function createAxisAndSeries(field, name, opposite, bullet) {
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      if(chart.yAxes.indexOf(valueAxis) != 0){
      //  valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
      }
     
      
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
      series.showTooltipOn = "always";
      series.tensionX = 15;
      series.showOnInit = true;

      let interfaceColors = new am4core.InterfaceColorSet();

      switch (bullet) {
        case "triangle":
          let bullet1 = series.bullets.push(new am4charts.Bullet());
          bullet1.width = 12;
          bullet1.height = 12;
          bullet1.horizontalCenter = "middle";
          bullet1.verticalCenter = "middle";

          let triangle = bullet1.createChild(am4core.Triangle);
          triangle.stroke = interfaceColors.getFor("background");
          triangle.strokeWidth = 2;
          triangle.direction = "top";
          triangle.width = 12;
          triangle.height = 12;
          break;
        default:
          let bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = interfaceColors.getFor("background");
          bullet.circle.strokeWidth = 2;
          break;
      }

      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = opposite;
    }

   // createAxisAndSeries("fileupload", "File Uploads", false, "circle");
   createAxisAndSeries("dataupload", "Data Uploads", false, "triangle");


    // Add legend
    chart.legend = new am4charts.Legend();

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    //amChartCode End


    // amChart Code For Activity

    // Create chart instance
    this.chartActivity = am4core.create("chart-bars", am4charts.XYChart);
    this.chartActivity.logo.disabled = true;

    // Add data
   
    this.chartActivity.data=this.GetActivityList();
    
    // Create axes
    var categoryAxis = this.chartActivity.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "activityname";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 120;

    var valueAxis = this.chartActivity.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    var series = this.chartActivity.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "activityname";
    series.columns.template.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
    series.columns.template.showTooltipOn = "always";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index );
    });

    // Cursor
    this.chartActivity.cursor = new am4charts.XYCursor();
    this.upDateActivityGraph();

  }

  public updateOptions(monthOrweek) {
   // console.log(monthOrweek);
    if(monthOrweek=='M'){
      
      //this.chartFirst.data = this.generateChartData(30);
      this.GetUploadList();
      this.chartFirst.validateData();
    }else{
     // this.chartFirst.data = this.generateChartData(7);
     this.GetUploadList();
     this.chartFirst.validateData();
    }
  }


  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      this.UserDashboardForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.UserDashboardForm.controls["UserID"].setValue(0);
      this.UserDashboardForm.controls["UserIDS"].setValue(0);
      
      // this.BranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }


    // generate some random data, quite different range
    public generateChartData(noofDays) {
      let chartData = [];
      let firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 100);
      firstDate.setHours(0, 0, 0, 0);
  
      let fileupload = 1600;
      let dataupload = 2900;
  
  
      for (var i = 0; i < noofDays; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        let newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);
  
        fileupload += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        dataupload += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  
  
        chartData.push({
          date: newDate,
          fileupload: fileupload,
          dataupload: dataupload
        });
      }
   
      return chartData;
    }

  public upDateActivityGraph() {
  
    this.updateActivityChartInterval = setInterval(() => {
      //console.log("updating");
      this.GetActivityList(); 
      this.chartActivity.validateData();
      this.GetUploadList();
      //Uncomment below line if you want to see good data
      //this.generateChartData(30);
      this.chartFirst.validateData();
      this.GetFileUploadList();
      this.chartFirstFU.validateData();
      this.GetActivityLog();
      this.chartActivityLog.validateData();
    }, 15000)
  }

  ngOnDestroy() {
    clearInterval(this.updateActivityChartInterval);
    this.zone.runOutsideAngular(() => {
      if (this.chartFirst) {
        this.chartFirst.dispose();
        this.chartFirstFU.dispose();
        this.chartActivityLog.dispose();
        this.chartActivity.dispose();
      }
    });

  }

  StatusList() {

    const apiUrl=this._global.baseAPIUrl+'Status/GetStatusCount?userID='+ localStorage.getItem('UserID') +'&user_Token='+localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

 
      if(data !="")         
      {
      this.DatauploadCount = data[0].DataUpload;
      this.FileUploadCount = data[0].FileUpload;
      this.TaggingCount = data[0].Tagging;
      this.UserCount = data[0].Users;
      }
    });
  }

  public GetActivityList() {
    this.activityChartData=[];
      const apiUrl=this._global.baseAPIUrl+'Status/GetActivityCount?userID='+ localStorage.getItem('UserID') +'&user_Token='+localStorage.getItem('User_Token')
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._ActivityList =data;
        this._ActivityList.forEach( (activity) => {
          this.activityChartData.push({activityname: activity.ActivityName,count:activity.Cnt});
        }, this);
    });
   return  this.activityChartData;
  }
    

  public GetUploadList() {
    this.firstChartData=[];
   // const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardData?user_Token='+this.DashboardForm.get('User_Token').value
   const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardData?userID= '+ localStorage.getItem('UserID') +' &user_Token='+localStorage.getItem('User_Token')
   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    //console.log("data",data);
    this._UploadList =data;
     this._UploadList.forEach( (upload) => {
      this.firstChartData.push({date:new Date(Date.parse(upload.UplaodDate)),dataupload:upload.DataUplaodCount});
    }, 
    this); 
  });
  // console.log("firstChart",this.firstChartData);
   return this.firstChartData;
}

public GetFileUploadList() {
  this.firstChartDataFU=[];
 // const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardData?user_Token='+this.DashboardForm.get('User_Token').value
 const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardFileData?userID='+ localStorage.getItem('UserID') +'&user_Token='+localStorage.getItem('User_Token')
 this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //console.log("data",data);
  this._UploadList =data;
   this._UploadList.forEach( (upload) => {
      this.firstChartDataFU.push({date:new Date(Date.parse(upload.UplaodDate)),fileupload:upload.FileUplaodCount});
  }, 
  this); 
});
// console.log("firstChart",this.firstChartData);
 return this.firstChartDataFU;
}


BindUserLog()
{

  /// Create chart instance

  var chart= am4core.create("chart-bars_UserLog", am4charts.XYChart);  
    // Add data   
    this.chartActivityLog = chart;
    this.chartActivityLog.logo.disabled = true;

    this.chartActivityLog.data=this.GetActivityLog();
    
    //console.log("ChartLog", this.chartActivityLog.data);

    // Create axes
    var categoryAxis = this.chartActivityLog.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "activityname";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    //categoryAxis.renderer.labels.template.location=0;
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 120;

    var valueAxis = this.chartActivityLog.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    var series = this.chartActivityLog.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "activityname";
    series.columns.template.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
    series.columns.template.showTooltipOn = "always";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
   // series.colors.step = 11;
    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
     return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    this.chartActivityLog.cursor = new am4charts.XYCursor();
}

public GetActivityLog() {
  this.activitylogChartData=[];
    const apiUrl=this._global.baseAPIUrl+'Status/GetActivityUserLog?userID='+ localStorage.getItem('UserID') +'&user_Token='+localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this._ActivityLog =data;
    //console.log("AL" , data);
      this._ActivityLog.forEach( (activity) => {
        this.activitylogChartData.push({activityname: activity.ActivityName,count:activity.Cnt});
      }, this);
  });
 return  this.activitylogChartData;
}

BindFileUpload()
{


  var chart = am4core.create("chart-fileupload", am4charts.XYChart);
  this.chartFirstFU = chart;
  this.chartFirstFU.logo.disabled = true;
  //chart.dateFormatter.dateFormat = "MM/dd/yyyy hh:mm:ss a";

  // Increase contrast by taking evey second color
  chart.colors.step = 2;

  // Add data


 this.chartFirstFU.data=this.GetFileUploadList();

 let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  // Create series
  function createAxisAndSeries(field, name, opposite, bullet) {
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis<AxisRenderer>());

    if (chart.yAxes.indexOf(valueAxis) != 0) {
      //	valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    }
   
    
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.yAxis = valueAxis;
    series.name = name;
    series.tooltipText = "{categoryX}\n[bold]{valueY}[/]";
    series.showTooltipOn = "always";
    series.tensionX = 7;
    series.showOnInit = true;

    let interfaceColors = new am4core.InterfaceColorSet();

    switch (bullet) {
      case "triangle":
        let bullet1 = series.bullets.push(new am4charts.Bullet());
        bullet1.width = 12;
        bullet1.height = 12;
        bullet1.horizontalCenter = "middle";
        bullet1.verticalCenter = "middle";

        let triangle = bullet1.createChild(am4core.Triangle);
        triangle.stroke = interfaceColors.getFor("background");
        triangle.strokeWidth = 2;
        triangle.direction = "top";
        triangle.width = 12;
        triangle.height = 12;
        break;
      default:
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = interfaceColors.getFor("background");
        bullet.circle.strokeWidth = 2;
        break;
    }

    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = series.stroke;
    valueAxis.renderer.labels.template.fill = series.stroke;
    valueAxis.renderer.opposite = opposite;
  }

  createAxisAndSeries("fileupload", "File Uploads", false, "triangle");
  //createAxisAndSeries("dataupload", "Data Uploads", true, "triangle");

  // Add legend
  chart.legend = new am4charts.Legend();
  // Add cursor
  chart.cursor = new am4charts.XYCursor();
}

 
// CheckAccessRight() {

//   var RoleID =1;
//   var PageName ='Dashboard';

//     const apiUrl = this._global.baseAPIUrl + 'Status/CheckAccessRight?RoleID=' + RoleID +'&PageName='+ PageName +' &user_Token='+ this.DashboardForm.get('User_Token').value       
//     //const apiUrl=this._global.baseAPIUrl+'Status/CheckAccessRight?user_Token='+this.DashboardForm.get('User_Token').value
//     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {    
 
//       if(data !="")         
//       {
      
//       }
//     });
//   }

}
