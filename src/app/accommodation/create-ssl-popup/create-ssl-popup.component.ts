import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as forge from 'node-forge';
import { SslRequestService } from '../services/ssl-request.service';
import { CertificateType, SSLRequest } from '../model/ssl-request.model';
import { UserService } from 'src/app/user/services/user.service';
import { UserInfo } from 'src/app/user/model/user.model';

@Component({
	selector: 'app-create-ssl-popup',
	templateUrl: './create-ssl-popup.component.html',
	styleUrls: ['./create-ssl-popup.component.css'],
})
export class CreateSslPopupComponent {
	selectedGenerateType: string = '1';
	selectedFileName: string = '';
	keyLength = 2048;
	pki = forge.pki;
	file: Blob;
	fileContent = '';
	userInfo: UserInfo | undefined;

	onFileSelected(event: any) {
		this.selectedFileName = event.target.files[0].name;
		this.file = event.target.files[0];
	}
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<CreateSslPopupComponent>,
		private service: SslRequestService,
		private userService: UserService
	) {
		this.file = new Blob([], { type: 'text/plain' });
		this.userService.getUser().subscribe({
			next: (result: UserInfo) => {
				this.userInfo = result;
			},
			error: (err: any) => {
				console.log(err);
			},
		});
	}

	reportReason: string = '';
	validator: boolean = false;

	closeDialog(): void {
		this.dialogRef.close();
	}
	sendCertificateRequest(): void {
		if (this.selectedGenerateType === '1') {
			var publicKey = this.generateAndDownloadKey();
			console.log(publicKey);
			this.service
				.sendRequest(this.generateSslRequest(publicKey))
				.subscribe(
					(response) => {
						console.log('Uspešan odgovor:', response);
						alert('Request successfully sent');
						window.location.reload();
					},
					(error) => {
						console.error('Greška prilikom slanja zahteva:', error);
						alert('An error occurred while sending');
					}
				);
			this.closeDialog();
		} else {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.fileContent = e.target.result;
				// var publicKey = this.pki.publicKeyFromPem(this.fileContent);
				console.log(this.fileContent);
				this.service
					.sendRequest(this.generateSslRequest(this.fileContent))
					.subscribe(
						(response) => {
							console.log('Uspešan odgovor:', response);
							alert('Request successfully sent');
						},
						(error) => {
							console.error(
								'Greška prilikom slanja zahteva:',
								error
							);
							alert('An error occurred while sending');
						}
					);
			};
			reader.readAsText(this.file);
			this.closeDialog();
		}
	}

	generateAndDownloadKey(): string {
		const { publicKey, privateKey } = this.pki.rsa.generateKeyPair(2048);
		const privateKeyPem = this.pki.privateKeyToPem(privateKey);

		const blob = new Blob([privateKeyPem], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'private_key.pem';
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
		return this.pki.publicKeyToPem(publicKey);
	}
	generateSslRequest(publicKey: string): SSLRequest {
		var request: SSLRequest = {
			publicKey: publicKey,
			commonName: this.userInfo?.name + ' ' + this.userInfo?.lastname,
			organization: 'Booking',
			email: this.userInfo?.email,
			country: this.userInfo?.address.state,
			certificateType: CertificateType.END_ENTITY,
		};
		return request;
	}
}
