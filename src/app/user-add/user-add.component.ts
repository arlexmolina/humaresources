import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {first, switchMap} from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';
import {Subscription} from 'rxjs';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.selectedGender = '';
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  sub: Subscription;
  tokenParam: string;
  selectedGender: string;
  selectedDate: Date;

  selectChangeHandler(event: any) {
    this.selectedGender = event.target.value;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      const token = params.token;
      if (token) {
        this.tokenParam = token;
        this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          mobile: ['', Validators.required],
          dni: ['', Validators.required],
          username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // tslint:disable-next-line:triple-equals
    if (this.selectedGender == '') {
      this.alertService.error('Debe seleccionar el genero.');
      this.loading = false;
      return;
    }

    // tslint:disable-next-line:triple-equals
    if (!this.selectedDate) {
      this.alertService.error('Debe seleccionar la fecha de nacimiento.');
      this.loading = false;
      return;
    }
    let date: string;
    // @ts-ignore
    date = this.formatDate(this.selectedDate);

    this.loading = true;
    const tokenLS = '{"token":"' + this.tokenParam + '"}';
    localStorage.setItem('token', JSON.stringify(tokenLS));
    // tslint:disable-next-line:max-line-length
    this.userService.create(this.f.firstName.value, this.f.lastName.value, this.f.mobile.value, this.f.dni.value,
      this.selectedGender, date, this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.error) {
            this.alertService.error(data.error);
            this.loading = false;
          } else if (data.errors) {
            this.alertService.error(data.errors.join(' -- '));
            this.loading = false;
          } else {
            this.alertService.success(data.message , true);
            this.router.navigate(['/login']);
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  formatDate(date) {
    // tslint:disable-next-line:one-variable-per-declaration
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      // tslint:disable-next-line:prefer-const
      day = '' + d.getDate(),
      // tslint:disable-next-line:prefer-const
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

}
