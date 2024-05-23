import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelComponent } from './hostel/hostel.component';
import { RoomComponent } from './room/room.component';
import { TenantComponent } from './tenant/tenant.component';
import { ExpenseComponent } from './expense/expense.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
