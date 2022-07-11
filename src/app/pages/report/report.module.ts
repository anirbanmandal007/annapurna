import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule, BsDatepickerModule } from "ngx-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';

import { RouterModule } from "@angular/router";
import { reportRoutes } from "./report.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SpaceComponent } from "./Space/Space.component";
import { StatusComponent } from "./status/status.component";
import { TableModule } from 'primeng/table';
import { LogsComponent } from "./logs/logs.component";
import { MetadataComponent } from "./metadata/metadata.component";
import { TagReportComponent } from "./TagReport/TagReport.component";

import { EmailLogComponent } from "./EmailLog/EmailLog.component";



@NgModule({
  declarations: [StatusComponent,LogsComponent,MetadataComponent,TagReportComponent,SpaceComponent,EmailLogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    TableModule,
  ]
})
export class ReportModule {}
