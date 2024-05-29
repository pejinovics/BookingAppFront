import { Component } from '@angular/core';
import { KeycloakService } from 'src/app/infrastructure/keycloak/keycloak.service';

@Component({
	selector: 'app-admin-nav-bar',
	templateUrl: './admin-nav-bar.component.html',
	styleUrls: ['./admin-nav-bar.component.css'],
})
export class AdminNavBarComponent {
	constructor(private keycloakService: KeycloakService) {}
	accountDetails(): void {
		this.keycloakService.accountManagement();
	}
}
