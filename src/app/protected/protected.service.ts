import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Hostel } from '../public/interfaces';

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

  getAllExpensesByUserId(url: string, userId: number) {
    let params = new HttpParams();
    params = params.append('userId', userId);
		return this.httpClient.get<any>(url, {params: params});              
	}

  async createHostel(url: string, hostel: Hostel) {
		return await this.httpClient.post(environment.API_URL+ url, hostel).toPromise();
	}
}
