import { Routes } from "@angular/router";
import { DataEntryComponent } from './data-entry/data-entry.component';
import { FileTaggingComponent } from './file-tagging/file-tagging.component';
import { EditIndexingComponent } from './EditIndexing/EditIndexing.component';




export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "data-entry",
        component: DataEntryComponent
      },
      {
        path: "tagging",
        component: FileTaggingComponent
      },
      {
        path: "EditIndexing",
        component: EditIndexingComponent
      }
      
    ]
  }
];
