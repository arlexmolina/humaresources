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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  sub: Subscription;
  tokenParam: string;

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      console.log('params');
      console.log(params);
      const token = params.token;
      if (token) {
        this.tokenParam = token;
        this.registerForm = this.formBuilder.group({
          password: ['', [Validators.required, Validators.minLength(6)]],
          password2: ['', [Validators.required, Validators.minLength(6)]]
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
    if (this.f.password.value != this.f.password2.value) {
      this.alertService.error('Las contraseñas no coinciden.');
      this.loading = false;
      return;
    }

    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.userService.resetPassword(this.f.password.value, this.tokenParam)
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

}
