import { Routes } from "@angular/router";

import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from './branch-mapping/branch-mapping.component';

export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "department",
        component: DepartmentComponent
      },
      {
        path: "branch-mapping",
        component: BranchMappingComponent
      }
    ]
  }
];
