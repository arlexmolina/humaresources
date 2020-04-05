import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {first, switchMap} from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  sub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      const token = params.token;
      if (token) {
        this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          mobile: ['', Validators.required],
          dni: ['', Validators.required],
          gender: ['', Validators.required],
          birthday: ['', Validators.required],
          username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });
      }
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

    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.userService.create(this.f.firstName.value, this.f.lastName.value, this.f.mobile.value, this.f.dni.value,
      this.f.gender.value, this.f.birthday.value, this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Creación del usuario exitosa', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
