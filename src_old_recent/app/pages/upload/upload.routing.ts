import { Routes } from "@angular/router";
import { FileUploadComponent } from "./fileupload/fileupload.component";
import { DataUploadComponent } from "./dataupload/dataupload.component";
//import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { SftpUploadComponent } from "./sftpupload/sftpupload.component";

//DataUploadComponent
 
export const uploadRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "file-upload",
       component: FileUploadComponent
      },
      {
        path: "data-upload",
       component: DataUploadComponent
      },
      {
        path: "sftpupload",
       component: SftpUploadComponent
      }
    ]
  }
];
