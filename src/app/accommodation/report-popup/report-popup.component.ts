import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportUserService } from '../services/report-user.service';
import { UserReport } from '../model/user-report';
import { Reservation } from '../model/reservation.model';
import {SanitizeService} from "../../../security/sanitize.service";

@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.css']
})
export class ReportPopupComponent {
  firstname: string = "";
  lastName: string = "";
  userReportedId : number = 0;
  userReportingId: number = 0;
  reservationId: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReportPopupComponent>,
        private reportService: ReportUserService, private sanitizeService: SanitizeService) {
    this.firstname = data.name;
    this.lastName = data.lastName;
    this.userReportedId = data.userReportedId;
    this.userReportingId = data.userReportingId,
    this.reservationId = data.reservationId;

  }
  reportReason: string = "";
  validator: boolean = false;

  closeDialog(): void {
    this.dialogRef.close();
  }
  reportUser(): void{
    this.validator = false;
    if(this.reportReason.length < 10){
      this.validator = true;
      return;
    }
    const userReport: UserReport = {
      reason:this.sanitizeService.sanitize(this.reportReason),
      userReportedId:this.userReportedId,
      userReportingId: this.userReportingId,
      reservationId: this.reservationId
    }
    this.reportService.addReport(userReport).subscribe({
      next:(_) => {
      }
    })
    this.dialogRef.close(true);
  }
}
