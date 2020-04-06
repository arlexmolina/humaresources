import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public API_CREATE = 'https://iwproject.herokuapp.com/api/signup';
  public API_INVITE = 'https://iwproject.herokuapp.com/api/admin/sendsignup';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:variable-name
  create(names, last_names, mobile, dni, gender, birthday, email, password) {
    return this.http.post<any>(this.API_CREATE, { names, last_names, mobile, dni, gender, birthday, email, password })
      .pipe(map(data => {
        return data;
      }));
  }

  invite(email) {
    return this.http.post<any>(this.API_INVITE, { email })
      .pipe(map(data => {
        return data;
      }));
  }
}
