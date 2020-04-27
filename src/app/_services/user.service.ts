import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public API = 'https://iwproject.herokuapp.com/api/';
  public API_CREATE = 'signup';
  public API_EDIT = 'worker/';
  public API_INVITE = 'admin/sendsignup';
  public API_ALL_USERS = 'admin/worker/s';
  public API_ALL_USERS_HISTORY = 'admin/worker/fire/d/';
  public API_VIEW = 'worker/';
  public API_FORGOT_PASSWORD = 'forgot-password';
  public API_RESET_PASSWORD = 'reset-password';
  public API_CONTRACT = 'admin/worker/addcontract';
  public API_FINISH_CONTRACT = 'admin/worker/fire/';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:variable-name
  create(names, last_names, mobile, dni, salary, gender, birthday, email, password) {
    return this.http.post<any>(this.API + this.API_CREATE, { names, last_names, mobile, dni, salary, gender, birthday, email, password })
      .pipe(map(data => {
        return data;
      }));
  }

  edit(id: string, userJson: {}) {
    return this.http.put<any>(this.API + this.API_EDIT + id, userJson)
      .pipe(map(data => {
        return data;
      }));
  }

  addContract(formData: FormData) {
    return this.http.put<any>(this.API + this.API_CONTRACT , formData)
      .pipe(map(data => {
        return data;
      }));
  }

  invite(email) {
    return this.http.post<any>(this.API + this.API_INVITE, { email })
      .pipe(map(data => {
        return data;
      }));
  }

  forgotPassword(email) {
    return this.http.put<any>(this.API + this.API_FORGOT_PASSWORD, { email })
      .pipe(map(data => {
        return data;
      }));
  }

  resetPassword(password, resetPasswordLink) {
    return this.http.put<any>(this.API + this.API_RESET_PASSWORD, { password, resetPasswordLink })
      .pipe(map(data => {
        return data;
      }));
  }

  userList(type: string) {
    if (type === 'A') {
      return this.http.get(this.API + this.API_ALL_USERS);
    } else if (type === 'H') {
      return this.http.get(this.API + this.API_ALL_USERS_HISTORY);
    }
  }

  view(id) {
    return this.http.get(this.API + this.API_VIEW + id);
  }

  finishContract(id: string) {
    return this.http.put<any>(this.API + this.API_FINISH_CONTRACT + id, {})
      .pipe(map(data => {
        return data;
      }));
  }
}
