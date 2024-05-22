import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
	constructor(private keycloakService: KeycloakService) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const accessToken: any = this.keycloakService.keycloak.token;
		if (req.headers.get('skip')) return next.handle(req);

		if (accessToken) {
			const cloned = req.clone({
				headers: req.headers.set(
					'Authorization',
					'Bearer ' + accessToken
				),
			});

			return next.handle(cloned);
		} else {
			return next.handle(req);
		}
	}
}
