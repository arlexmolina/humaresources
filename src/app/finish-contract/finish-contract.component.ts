import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService} from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-finish-contract',
  templateUrl: './finish-contract.component.html',
  styleUrls: ['./finish-contract.component.css']
})
export class FinishContractComponent implements OnInit {

  sub: Subscription;
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
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    // tslint:disable-next-line:triple-equals
    if (this.authenticationService.currentUserValue.worker.role != 'admin') {
      this.router.navigate(['/login']);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.registerForm = this.formBuilder.group({
      });
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

    this.loading = true;

    // tslint:disable-next-line:max-line-length
    this.userService.finishContract(this.id)
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
