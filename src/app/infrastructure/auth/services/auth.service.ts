import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../env/env';
import { Address, Registration } from '../model/registration.model';
import { User } from '../model/user.model';
import { KeycloakService } from '../../keycloak/keycloak.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private headers = new HttpHeaders({
		'Content-Type': 'application/json',
		skip: 'true',
	});

	user$ = new BehaviorSubject('');
	userState = this.user$.asObservable();

	constructor(private keycloakService: KeycloakService) {
		this.user$.next(this.getRole());
	}

	http = inject(HttpClient);
	login(auth: any): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(
			environment.apiHost + 'auth/login',
			auth,
			{
				headers: this.headers,
			}
		);
	}

	logout(): Observable<string> {
		return this.http.get(environment.apiHost + 'auth/logout', {
			responseType: 'text',
		});
	}

	getRole(): any {
		// if (this.isLoggedIn()) {
		// }
		const accessToken: any = this.keycloakService.profile?.token;
		const helper = new JwtHelperService();
		var name = helper.decodeToken(accessToken).given_name;
		var lastname = helper.decodeToken(accessToken).family_name;
		var email = helper.decodeToken(accessToken).email;
		this.userExists(this.getEmail()).subscribe(
			(response) => {
				if (!response) {
					const address: Address = {
						street: 'Patrisa Lumumbe',
						city: 'Vranje',
						postalCode: 17500,
						state: 'Srbija',
					};
					const user: Registration = {
						name: name,
						lastname: lastname,
						address: address,
						userType: 'GUEST',
						email: email,
						password: 'ivica',
						phoneNumber: '0638019625',
					};
					this.register(user).subscribe(
						(exists) => {
							if (exists) {
								console.log('User exists!');
							} else {
								console.log('User does not exist.');
							}
						},
						(error) => {
							console.error('Error occurred:', error);
						}
					);
				}
			},
			(error) => {
				console.error('Error checking user availability:', error);
			}
		);

		var roles = helper.decodeToken(accessToken).realm_access.roles;
		if (roles.includes('GUEST')) {
			return 'GUEST';
		}
		if (roles.includes('HOST')) {
			return 'HOST';
		}
		if (roles.includes('ADMIN')) {
			return 'ADMIN';
		}
		return null;
	}
	getId(): number {
		if (this.isLoggedIn()) {
			const accessToken: any = localStorage.getItem('user');
			const helper = new JwtHelperService();
			return helper.decodeToken(accessToken).id;
		}
		return 0;
	}

	getHostId(userId: number): Observable<number> {
		return this.http.get<number>(
			environment.apiHost + 'users/host/' + userId
		);
	}

	getEmail(): string {
		const accessToken: any = this.keycloakService.profile?.token;
		const helper = new JwtHelperService();
		var email = helper.decodeToken(accessToken).email;
		return email;
	}

	isLoggedIn(): boolean {
		return localStorage.getItem('user') != null;
	}

	setUser(): void {
		this.user$.next(this.getRole());
	}

	userExists(email: String) {
		return this.http.get<boolean>(
			environment.apiHost + 'register/userExists/' + email,
			{
				headers: this.headers,
			}
		);
	}
	register(user: Registration): Observable<User> {
		return this.http.post<User>(environment.apiHost + 'register', user, {
			headers: this.headers,
		});
	}
}
