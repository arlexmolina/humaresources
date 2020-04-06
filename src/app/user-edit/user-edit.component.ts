import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  selectedGender: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.selectedGender = '';
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
    // tslint:disable-next-line:triple-equals
    if (this.authenticationService.currentUserValue.worker.role != 'admin') {
      this.router.navigate(['/']);
    }
  }

  selectChangeHandler(event: any) {
    this.selectedGender = event.target.value;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      dni: ['', Validators.required],
      birthday: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

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

    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.userService.create(this.f.firstName.value, this.f.lastName.value, this.f.mobile.value, this.f.dni.value,
      this.selectedGender, this.f.birthday.value, this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('data');
          console.log(data);
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
          console.log('error2121');
          console.log(error);
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
