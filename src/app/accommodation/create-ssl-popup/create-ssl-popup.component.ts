import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-create-ssl-popup',
	templateUrl: './create-ssl-popup.component.html',
	styleUrls: ['./create-ssl-popup.component.css'],
})
export class CreateSslPopupComponent {
	selectedGenerateType: string = '1';
	file: any;
	selectedFileName: string = '';

	onFileSelected(event: any) {
		this.selectedFileName = event.target.files[0].name;
	}
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<CreateSslPopupComponent>
	) {}
	reportReason: string = '';
	validator: boolean = false;

	closeDialog(): void {
		this.dialogRef.close();
	}
	sendCertificateRequest(): void {
		// this.validator = false;
		// if(this.reportReason.length < 10){
		//   this.validator = true;
		//   return;
		// }
		// const userReport: UserReport = {
		//   reason:this.reportReason,
		//   userReportedId:this.userReportedId,
		//   userReportingId: this.userReportingId,
		//   reservationId: this.reservationId
		// }
		// this.reportService.addReport(userReport).subscribe({
		//   next:(_) => {
		//   }
		// })
		// this.dialogRef.close(true);
	}
}
