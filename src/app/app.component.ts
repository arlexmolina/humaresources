import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {AuthenticationService} from './_services/authentication.service';
import { User } from './_models/user';

import './_content/app.less';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;
  isAmin: boolean;
  isUser: boolean;
  userMail: string;

  title = 'Recursos Humanos';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.init(x));
  }

  init(x) {
    this.currentUser = x;
    if (this.currentUser) {
      if (this.currentUser.worker) {
        // tslint:disable-next-line:triple-equals
        if (this.currentUser.worker.role == 'admin') {
          this.isAmin = true;
          this.isUser = false;
        } else {
          this.isAmin = false;
          this.isUser = true;
        }
        this.userMail = this.currentUser.worker.email;
      }
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

