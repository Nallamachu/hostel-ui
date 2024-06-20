import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { HostelComponent } from './hostel/hostel.component';
import { RoomComponent } from './room/room.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { TenantComponent } from './tenant/tenant.component';
import { ExpenseComponent } from './expense/expense.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CreateUpdateRoomComponent } from './room/create-update-room/create-update-room.component';
import { CreateUpdateTenantComponent } from './tenant/create-update-tenant/create-update-tenant.component';
import { CreateUpdateExpenseComponent } from './expense/create-update-expense/create-update-expense.component';
import { CreateUpdateHostelComponent } from './hostel/create-update-hostel/create-update-hostel.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HostelComponent,
    RoomComponent,
    TenantComponent,
    ExpenseComponent,
    CreateUpdateHostelComponent,
    CreateUpdateRoomComponent,
    CreateUpdateTenantComponent,
    CreateUpdateExpenseComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ]
})
export class ProtectedModule { }
