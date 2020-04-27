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
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
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

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

  selectChangeHandler(event: any) {
    this.selectedGender = event.target.value;
  }

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
        this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          mobile: ['', Validators.required],
          dni: [''],
          salary: [''],
          username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          password: [''],
          profile: ['']
        });
        this.selectedGender = this.user.gender;
      } else {
        // tslint:disable-next-line:triple-equals
        if (this.authenticationService.currentUserValue.worker.role != 'admin') {
          this.router.navigate(['/login']);
        }
        this.edit = false;
        this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          mobile: ['', Validators.required],
          dni: ['', Validators.required],
          salary: ['', Validators.required],
          username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          profile: ['']
        });
        this.edited = true;
      }
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.get('profile').setValue(file);
    }
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
    if (this.selectedGender == '' && !this.edit) {
      this.alertService.error('Debe seleccionar el genero.');
      this.loading = false;
      return;
    }

    // tslint:disable-next-line:triple-equals
    if (!this.selectedDate && !this.edit) {
      this.alertService.error('Debe seleccionar la fecha de nacimiento.');
      this.loading = false;
      return;
    }
    let date: string;
    // @ts-ignore
    date = this.formatDate(this.selectedDate);

    this.loading = true;
    if (this.edit) {
      const formData = new FormData();
      formData.append('names', this.f.firstName.value);
      formData.append('last_names', this.f.lastName.value);
      formData.append('mobile', this.f.mobile.value);
      if (this.registerForm.get('profile')) {
        if (this.registerForm.get('profile').value) {
          formData.append('photo', this.registerForm.get('profile').value);
        }
      }
      // tslint:disable-next-line:triple-equals
      if (this.f.salary.value && this.f.salary.value != '') {
        formData.append('salary', this.f.salary.value);
      }
      // tslint:disable-next-line:triple-equals
      if (this.selectedGender != '') {
        formData.append('gender', this.selectedGender);
      }
      // tslint:disable-next-line:triple-equals
      if (this.selectedDate) {
        formData.append('birthday', date);
      }

      // tslint:disable-next-line:max-line-length
      this.userService.edit(this.id, formData)
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
              if (this.userAdmin) {
                this.router.navigate(['/menu']);
              } else {
                this.router.navigate(['/menu-user']);
              }
            }
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    } else {
      // tslint:disable-next-line:max-line-length
      this.userService.create(this.f.firstName.value, this.f.lastName.value, this.f.mobile.value, this.f.dni.value, this.f.salary.value,
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
              this.router.navigate(['/menu']);
            }
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
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
