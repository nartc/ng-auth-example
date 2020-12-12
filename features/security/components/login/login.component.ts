import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenRequest } from '@volt/common/api/dashboard';
import { APP_RETAILER, AppRetailer } from '@volt/common/app-config';
import { AuthService } from '@volt/common/auth';
import { ApiResponseStatus } from '@volt/common/enums';
import { ApiResponse } from '@volt/common/models';
import { VoltValidators } from '@volt/common/utilities/misc';
import { finalize, pluck, take, withLatestFrom } from 'rxjs/operators';
import { PermissionStateService } from '../../../../common/permissions';

@Component({
  selector: 'volt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginResponse: ApiResponse<TokenRequest>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly permissionStateService: PermissionStateService,
    @Inject(APP_RETAILER) public readonly appRetailer: AppRetailer,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  submit() {
    const { emailOrMobile, password } = this.form.value;
    this.authService
      .login(emailOrMobile, password)
      .pipe(
        withLatestFrom(
          this.route.queryParams.pipe(pluck('returnUrl'), take(1)),
          this.permissionStateService.permissionReady$,
        ),
        finalize(() => {
          this.form.reset({
            emailOrMobile,
            password: '',
          });
          this.form.get('password').markAsUntouched();
        }),
      )
      .subscribe({
        next: ([response, returnUrl, ready]) => {
          this.loginResponse = response;
          if (response.status === ApiResponseStatus.Success && ready) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private initForm() {
    this.form = this.fb.group({
      emailOrMobile: [
        '',
        [Validators.required, VoltValidators.isEmailOrMobile],
      ],
      password: ['', Validators.required],
    });
  }
}
