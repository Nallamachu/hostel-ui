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
import { CreateHostelComponent } from './protected/hostel/create-hostel/create-hostel.component';
import { CreateUpdateRoomComponent } from './protected/room/create-update-room/create-update-room.component';
import { CreateUpdateTenantComponent } from './protected/tenant/create-update-tenant/create-update-tenant.component';
import { CreateUpdateExpenseComponent } from './protected/expense/create-update-expense/create-update-expense.component';

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
    path: 'create-hostel',
    component: CreateHostelComponent
  },
  {
    path: 'room',
    component: RoomComponent
  },
  {
    path: 'create-update-room',
    component: CreateUpdateRoomComponent
  },
  {
    path: 'tenant',
    component: TenantComponent
  },
  {
    path: 'create-update-tenant',
    component: CreateUpdateTenantComponent
  },
  {
    path: 'expense',
    component: ExpenseComponent
  },
  {
    path: 'create-update-expense',
    component: CreateUpdateExpenseComponent
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
