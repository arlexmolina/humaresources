import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';
import {MatDatepickerInputEvent} from '@angular/material';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  sub: Subscription;
  user: any = {};
  edit: boolean;
  id: string;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.selectedGender = '';
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    if (this.authenticationService.currentUserValue.worker.role != 'admin') {
      this.userAdmin = false;
    } else {
      this.userAdmin = true;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  edited = false;
  selectedGender: string;
  userAdmin = false;
  contract = false;

  selectedDate: Date;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params.id;
      if (this.id) {
        if (this.id === 'current') {
          this.id = this.authenticationService.currentUserValue.worker._id;
        } else {
          // tslint:disable-next-line:triple-equals
          if (this.authenticationService.currentUserValue.worker.role != 'admin') {
            // tslint:disable-next-line:triple-equals
            if (this.id != this.authenticationService.currentUserValue.worker._id) {
              this.router.navigate(['/login']);
            }
          }
        }
        this.edit = true;
        this.edited = false;
        this.userService.view(this.id).subscribe((user: any) => {
          if (user) {
            this.user = user.worker;
            if (user.worker.contract) {
              this.contract = true;
            } else {
              this.contract = false;
            }
          } else {
            this.alertService.error('Usuario no existe');
          }
        });
        this.registerForm = this.formBuilder.group({});
        this.selectedGender = this.user.gender;
      }
    });
  }

  onSubmit() {}
}
