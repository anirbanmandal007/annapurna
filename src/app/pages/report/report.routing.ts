import { Routes } from "@angular/router";
import { StatusComponent } from "./status/status.component";
import { LogsComponent } from "./logs/logs.component";
import { MetadataComponent } from "./metadata/metadata.component";
import { TagReportComponent } from "./TagReport/TagReport.component";
import { SpaceComponent } from "./Space/Space.component";
 
export const reportRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "status",
        component: StatusComponent
      },    
      {
        path: "logs",
        component: LogsComponent
      },
      {
        path: "meta-data",
        component: MetadataComponent
      },   
      {
        path: "DocumentStatus",
        component: TagReportComponent
      },
      {
        path: "space",
        component: SpaceComponent
      },       
      
    ]

  }
];
