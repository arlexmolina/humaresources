import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService} from '../_services/alert.service';
import {AuthenticationService} from '../_services/authentication.service';
import {UserService} from '../_services/user.service';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-load-contract',
  templateUrl: './load-contract.component.html',
  styleUrls: ['./load-contract.component.css']
})
export class LoadContractComponent implements OnInit {
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
      if (this.id) {
        this.registerForm = this.formBuilder.group({
          profile: ['']
        });
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

    this.loading = true;
    const formData = new FormData();
    formData.append('contract', this.registerForm.get('profile').value);
    formData.append('workerId', this.id);

    // tslint:disable-next-line:max-line-length
    this.userService.addContract(formData)
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
