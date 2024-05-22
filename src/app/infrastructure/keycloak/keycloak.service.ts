import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from 'src/env/env';
import { UserProfile } from './user-profile';

@Injectable({
	providedIn: 'root',
})
export class KeycloakService {
	private _keycloak: Keycloak | undefined;

	get keycloak() {
		if (!this._keycloak) {
			this._keycloak = new Keycloak({
				url: environment.apiKeycloak,
				realm: environment.realmKeycloak,
				clientId: environment.clientIdKeycloak,
			});
		}
		return this._keycloak;
	}

	private _profile: UserProfile | undefined;

	get profile(): UserProfile | undefined {
		return this._profile;
	}

	async init() {
		const authenticated = await this.keycloak.init({
			enableLogging: true,
			checkLoginIframe: false,
			flow: 'standard',
			onLoad: 'login-required',
		});

		if (authenticated) {
			this._profile =
				(await this.keycloak.loadUserProfile()) as UserProfile;
			this._profile.token = this.keycloak.token || '';
		}
	}

	login() {
		return this.keycloak.login();
	}

	logout() {
		// this.keycloak.accountManagement();
		return this.keycloak.logout();
	}
}
