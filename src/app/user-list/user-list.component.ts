import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService} from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';
import {Subscription} from "rxjs";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: Array<any>;
  sub: Subscription;
  type: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.type = params.type;
      if (this.type) {
        this.userService.userList(this.type).subscribe(data => {
            this.users = data['workers'];
          },
          error => {
            this.alertService.error(error);
          });
      }
    });
  }

  gotoList() {
    this.router.navigate(['/user-list']);
  }

}
