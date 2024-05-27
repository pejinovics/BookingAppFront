import { Component } from '@angular/core';
import { NotificationGuest } from 'src/app/notification/model/notification-guest';
import { NotificationForGuestService } from 'src/app/notification/services/notification-for-guest.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/env/env';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/infrastructure/auth/services/auth.service';
import { KeycloakService } from 'src/app/infrastructure/keycloak/keycloak.service';

@Component({
	selector: 'app-guest-nav-bar',
	templateUrl: './guest-nav-bar.component.html',
	styleUrls: ['./guest-nav-bar.component.css'],
})
export class GuestNavBarComponent {
	numberOfNotifications: number = 0;
	haveNotifications: boolean = false;

	private serverUrl = environment.socket + 'socket';
	private stompClient: any;

	isLoaded: boolean = false;
	isCustomSocketOpened = false;
	constructor(
		private service: NotificationForGuestService,
		private sharedService: SharedService,
		private authService: AuthService,
		private keycloakService: KeycloakService
	) {
		this.sharedService.numberOfNotifications$.subscribe((data) => {
			this.numberOfNotifications = data;
			if (this.numberOfNotifications == 0) {
				this.haveNotifications = false;
			}
		});
	}

	accountDetails(): void {
		this.keycloakService.accountManagement();
	}
	ngOnInit(): void {
		this.initializeWebSocketConnection();
		this.getData();
	}
	getData(): void {
		this.service.getNotificationsForGuest().subscribe({
			next: (notifications: NotificationGuest[]) => {
				console.log(notifications);
				this.numberOfNotifications = 0;
				notifications.forEach((notification: NotificationGuest) => {
					if (!notification.read) {
						this.numberOfNotifications += 1;
					}
				});
				if (this.numberOfNotifications != 0) {
					this.haveNotifications = true;
				}
			},
		});
	}

	initializeWebSocketConnection() {
		let ws = new SockJS(this.serverUrl);
		this.stompClient = Stomp.over(ws);
		let that = this;

		this.stompClient.connect({}, function () {
			that.isLoaded = true;
			that.openSocket();
		});
	}
	openSocket() {
		if (this.isLoaded) {
			this.isCustomSocketOpened = true;
			this.stompClient.subscribe(
				'/socket-publisher/' + this.authService.getId(),
				(message: { body: string }) => {
					this.handleResult(message);
				}
			);
		}
	}
	handleResult(message: { body: string }) {
		if (message.body) {
			if (this.numberOfNotifications == 0) {
				this.haveNotifications = true;
			}
			this.numberOfNotifications += 1;
		}
	}
}
