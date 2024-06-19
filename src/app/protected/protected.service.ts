import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Response } from '../public/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtectedService {
  

  constructor(private httpClient: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService
  ) { }

  getHostels(url: string, userId: number) {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('page', 0);
    params = params.append('size', 10);
    params = params.append('sort', 'id');
		return this.httpClient.get<any>(url, {params: params});              
	}

  getAllHostelsByUser(url: string, userId: number) {
    let params = new HttpParams();
    params = params.append('userId', userId);
		return this.httpClient.get<any>(url, {params: params});              
	}

  createHostel(url: string, hostel:any) : Observable<Response>{
    return this.httpClient.post<Response>(url, hostel);
  }

  deleteRecord(url: string) {
    return this.httpClient.delete<Response>(url, {});
  }

  getAllRoomsByUserId(url: string, userId: number) {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('page', 0);
    params = params.append('size', 10);
    params = params.append('sort', 'id');
		return this.httpClient.get<any>(url, {params: params});              
	}

  getAllRoomsByHostelId(url: string, hostelId: number) {
    let params = new HttpParams();
    params = params.append('hostelId', hostelId);
    params = params.append('page', 0);
    params = params.append('size', 10);
    params = params.append('sort', 'id');
		return this.httpClient.get<any>(url, {params: params});              
	}

  getAllTenantsByUserId(url: string, userId: number) {
    let params = new HttpParams();
    params = params.append('userId', userId);
		return this.httpClient.get<any>(url, {params: params});              
	}

  getAllTenantsByRoomId(url: string, roomId: number) {
    let params = new HttpParams();
    params = params.append('roomId', roomId);
		return this.httpClient.get<any>(url, {params: params});              
	}

  getAllExpensesByUserId(url: string, userId: number) {
    let params = new HttpParams();
    params = params.append('userId', userId);
		return this.httpClient.get<any>(url, {params: params});              
	}

  getAllExpensesByHostelId(url: string, selectedHostelId: string) {
    let params = new HttpParams();
    params = params.append('hostelId', selectedHostelId);
		return this.httpClient.get<any>(url, {params: params}); 
  }

}
