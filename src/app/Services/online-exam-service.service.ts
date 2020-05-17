import { Injectable } from '@angular/core';
// import { IGame } from '../Interface/drop-down-list';
import { Listboxclass } from '../Helper/listboxclass'; 


import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpParams,HttpResponse } from '@angular/common/http';
import { catchError, tap, map,filter } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})//,
  
  //responseType: 'blob' as 'blob'
};
@Injectable({
  providedIn: 'root'
})
export class OnlineExamServiceService {

  allNotifications: Notification[]; 

  constructor(private http: HttpClient,
    private _global: Listboxclass
    
    ) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {    
      console.error('An error occurred:', error.error.message);
    } else {   
      console.error(
        "Backend returned code ${error.status}, " +
        "body was: ${error.error}");
    }
    return throwError('Something bad happened; please try again later.');
  }
  getAllData(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map(this.extractData));
  }

  DLoadFile(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl,httpOptions).pipe(
      map(this.extractData));
  }
  getAllDataWithFormValue(data,apiUrl): Observable<any> {
    return this.http.post(apiUrl, data, httpOptions).pipe(
      map(this.extractData));
  }

  getDropDownData(apiUrl: string): Observable<Listboxclass> {
    return this.http.get<Listboxclass>(apiUrl).pipe(map(res => this._global = res));

    //(this.notificationsUrl).pipe(map(res => this.allNotifications = res))
  }

  public getProducts(apiUrl: string): Observable<Listboxclass[]> {
    return this.http.get<Listboxclass[]>(apiUrl);
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getDataById(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map(this.extractData));
  }
 
  postData(data,apiUrl): Observable<any> {  
   return this.http.post(apiUrl, data, httpOptions)
     .pipe(  
       catchError(this.handleError),
       map(this.extractData)
     );
 } 
 updateData(data,apiUrl): Observable<any> {  
  return this.http.post(apiUrl, data, httpOptions)
    .pipe(      
      catchError(this.handleError),
      map(this.extractData)
    );
}
deleteData(apiUrl: string): Observable<any> {
  return this.http.get(apiUrl).pipe(
    map(this.extractData));
}

public download_test(data,apiUrl: string): Observable<Blob> {
  const headers = new HttpHeaders().set('content-type', 'multipart/form-data');

   return this.http.post(apiUrl,data,{ headers, responseType: 'blob' });
}

}
