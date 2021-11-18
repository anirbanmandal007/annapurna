import { Routes } from "@angular/router";
 import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { FileStorageComponent } from './file-storage/file-storage.component';
import { ContentSearchComponent } from './Content-Search/Content-Search.component';
import { BulkDownlaodComponent } from './BulkDownlaod/BulkDownlaod.component';
import { SearchComponent } from './Search/Search.component';
import { DeleteFilesComponent } from './DeleteFiles/DeleteFiles.component';
import { BasicSearchComponent } from './Basic-Search/Basic-Search.component';

import { OCRSearchComponent } from './ocr-Search/ocr-Search.component';


//DataUploadComponent
 
export const searchRoutes: Routes = [
  {
    path: "",
    children: [      
      {
        path: "advance-search",
       component: AdvancedSearchComponent
      },
      {
        path: "file-storage",
       component: FileStorageComponent
      },
      {
        path: "quick-search",
       component: ContentSearchComponent
      },
      {
        path: "BulkDownlaod",
       component: BulkDownlaodComponent
      },
      {
        path: "ASearch",
       component: SearchComponent
      },
      {
        path: "DeleteFiles",
       component: DeleteFilesComponent
      } ,
      {
        path: "BasicSearch",
       component: BasicSearchComponent
      } ,
      {
        path: "OCRSearch",
       component: OCRSearchComponent
      } ,
            
    ]
  }
];
