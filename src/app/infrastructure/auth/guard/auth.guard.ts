import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { KeycloakService } from '../../keycloak/keycloak.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private authService: AuthService,
		private keycloakService: KeycloakService
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const userRole: string = this.authService.user$.getValue();

		if (this.keycloakService.keycloak.isTokenExpired()) {
			this.router.navigate(['login']);
			return false;
		}

		// if (userRole == null) {
		// 	this.router.navigate(['login']);
		// 	return false;
		// }
		if (!route.data['role'].includes(userRole)) {
			this.router.navigate(['home']);
			return false;
		}
		return true;
	}
}
