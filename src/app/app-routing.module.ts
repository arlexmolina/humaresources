import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { MenuUserComponent } from './menu-user/menu-user.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserInviteComponent } from './user-invite/user-invite.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoadContractComponent } from './load-contract/load-contract.component';
import { FinishContractComponent } from './finish-contract/finish-contract.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'menu-user',
    component: MenuUserComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user-edit',
    component: UserEditComponent
  },
  {
    path: 'user-edit/:id',
    component: UserEditComponent
  },
  {
    path: 'user-view/:id',
    component: UserViewComponent
  },
  {
    path: 'load-contract/:id',
    component: LoadContractComponent
  },
  {
    path: 'finish-contract/:id',
    component: FinishContractComponent
  },
  {
    path: 'user-list/:type',
    component: UserListComponent
  },
  {
    path: 'user-add',
    component: UserAddComponent
  },
  {
    path: 'user-invite',
    component: UserInviteComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const appRoutingModule = RouterModule.forRoot(routes);
