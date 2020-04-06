import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
    // tslint:disable-next-line:triple-equals
    if (this.authenticationService.currentUserValue.worker.role != 'admin') {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

}
