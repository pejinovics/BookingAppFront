import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/services/auth.service';
import { environment } from 'src/env/env';
import { SSLRequest } from '../model/ssl-request.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SslRequestService {
	private headers = new HttpHeaders({
		'Content-Type': 'application/json',
		skip: 'true',
	});
	constructor(
		private http: HttpClient,
		private datePipe: DatePipe,
		private authService: AuthService
	) {}

	sendRequest(request: SSLRequest): Observable<SSLRequest> {
		const url = environment.apiHostPki + 'certificatesRequests';
		return this.http.post<SSLRequest>(url, request, {
			headers: this.headers,
		});
	}
}
