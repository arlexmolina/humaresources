import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('data');
          console.log(data);
          if (data.error) {
            this.alertService.error(data.error);
            this.loading = false;
          } else {
            const currentUser = this.authenticationService.currentUserValue;
            this.router.navigate(['/menu']);
            // tslint:disable-next-line:triple-equals
            if (currentUser && currentUser.worker.role == 'admin') {
              this.router.navigate(['/menu']);
            } else if (data.errors) {
              this.alertService.error(data.errors.join(' -- '));
              this.loading = false;
            } else {
              this.router.navigate(['/menu-user']);
            }
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
