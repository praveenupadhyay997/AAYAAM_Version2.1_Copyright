import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  createAccountUrl: string = 'http://localhost:3000/account';
  fetchAllAccountsUrl: string = 'http://localhost:3000/account/fetchAll';
  deleteAccountUrl: string = 'http://localhost:3000/account/delete';
  updateAccountUrl: string = 'http://localhost:3000/account/update';
  sendSmsUrl: string = 'http://localhost:3000/account/sms';

  constructor(private http: HttpClient) {}

  createAccount(payslipForm: FormGroup): Observable<any> {
    return this.http.post(this.createAccountUrl, payslipForm, httpOptions);
  }
  fetchAccounts(): Observable<any> {
    return this.http.get(this.fetchAllAccountsUrl, httpOptions);
  }
  deleteAccount(id: any): Observable<any> {
    const url = `${this.deleteAccountUrl}/${id}`;
    return this.http.delete(url, httpOptions);
  }
  updateAccount(updatePayslipForm: FormGroup): Observable<any> {
    return this.http.post(
      this.updateAccountUrl,
      updatePayslipForm,
      httpOptions
    );
  }

  sendSms(account: any): Observable<any> {
    return this.http.post(this.sendSmsUrl, account, httpOptions);
  }
}
