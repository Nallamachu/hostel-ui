import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard/auth.guard';
import { LoginComponent } from './public/components/login/login.component';
import { RegisterComponent } from './public/components/register/register.component';
import { DashboardComponent } from './protected/dashboard/dashboard.component';
import { HostelComponent } from './protected/hostel/hostel.component';
import { RoomComponent } from './protected/room/room.component';
import { TenantComponent } from './protected/tenant/tenant.component';
import { ExpenseComponent } from './protected/expense/expense.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'hostel',
    component: HostelComponent
  },
  {
    path: 'room',
    component: RoomComponent
  },
  {
    path: 'tenant',
    component: TenantComponent
  },
  {
    path: 'expense',
    component: ExpenseComponent
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule)
  },
  {
    path: '**',
    redirectTo: 'public',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
