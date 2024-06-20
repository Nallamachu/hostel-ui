import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelComponent } from './hostel/hostel.component';
import { CreateUpdateHostelComponent } from './hostel/create-update-hostel/create-update-hostel.component';
import { RoomComponent } from './room/room.component';
import { TenantComponent } from './tenant/tenant.component';
import { ExpenseComponent } from './expense/expense.component';
import { CreateUpdateRoomComponent } from './room/create-update-room/create-update-room.component';
import { CreateUpdateTenantComponent } from './tenant/create-update-tenant/create-update-tenant.component';
import { CreateUpdateExpenseComponent } from './expense/create-update-expense/create-update-expense.component';

// Routes for child Module (protectedModule). Since protected module is lazy loaded in in the 
// app-routing.module the full path is `/protected/dashboard`
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'hostel',
    component: HostelComponent
  },
  {
    path: 'create-update-hostel',
    component: CreateUpdateHostelComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { 
  
}
