import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationComponent } from "./pages/presentation/presentation.component";
import { LoginNewComponent } from './pages/login-new/login-new.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { ForgetPasswordComponent } from "./pages/forget-password/forget-password.component";
import { AuthGuardService } from "./Services/auth-guard.service";


const routes: Routes = [
  {
    path: "",
    redirectTo: "Login",
    pathMatch: "full"
  },
  {
    path: "Login",
    component: LoginNewComponent
  },
  {
    path: "forgot-password",
    component: ForgetPasswordComponent
  },
  {
    path: "Forbidden",
    component: ForbiddenComponent
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "dashboards",
        loadChildren: "./pages/dashboards/dashboards.module#DashboardsModule"
      },
      {
        path: "usermanagement",
        loadChildren: "./pages/user-management/user-management.module#UserManagementModule"
      },
      {
        path: "master",
        loadChildren: "./pages/master/master.module#MasterModule"
      },
      {
        path: "process",
        loadChildren: "./pages/process/process.module#ProcessModule"
      },
      {
        path: "report",
        loadChildren: "./pages/report/report.module#ReportModule"
      },
      {
        path: "upload",
        loadChildren: "./pages/upload/upload.module#UploadModule"
      },
      {
        path: "search",
        loadChildren: "./pages/search/search.module#SearchModule"
      },
      {
        path: "components",
        loadChildren: "./pages/components/components.module#ComponentsModule"
      },
      {
        path: "forms",
        loadChildren: "./pages/forms/forms.module#FormsModules"
      },
      {
        path: "tables",
        loadChildren: "./pages/tables/tables.module#TablesModule"
      },
      {
        path: "maps",
        loadChildren: "./pages/maps/maps.module#MapsModule"
      },
      {
        path: "widgets",
        loadChildren: "./pages/widgets/widgets.module#WidgetsModule"
      },
      {
        path: "charts",
        loadChildren: "./pages/charts/charts.module#ChartsModule"
      },
      {
        path: "calendar",
        loadChildren: "./pages/calendar/calendar.module#CalendarModule"
      },
      {
        path: "examples",
        loadChildren: "./pages/examples/examples.module#ExamplesModule"
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "examples",
        loadChildren:
          "./layouts/auth-layout/auth-layout.module#AuthLayoutModule"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "Login"
  }


];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
