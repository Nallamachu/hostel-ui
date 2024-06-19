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
import { CreateHostelComponent } from './hostel/create-hostel/create-hostel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    DashboardComponent,
    HostelComponent,
    RoomComponent,
    TenantComponent,
    ExpenseComponent,
    CreateHostelComponent
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
    MatSelectModule
  ]
})
export class ProtectedModule { }
