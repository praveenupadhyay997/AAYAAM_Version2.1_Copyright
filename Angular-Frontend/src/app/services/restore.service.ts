import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RestoreService {
  fetchAllStudentsUrl: string = 'http://localhost:3000/restore/allStudents';
  restoreStudentsUrl: string = 'http://localhost:3000/restore/restoreStudent';
  constructor(private http: HttpClient) {}

  fetchAllStudents(): Observable<any> {
    return this.http.get(this.fetchAllStudentsUrl, httpOptions);
  }
  restoreStudent(id: any): Observable<any> {
    const url = `${this.restoreStudentsUrl}/${id}`;
    return this.http.post(url, httpOptions);
  }
}
