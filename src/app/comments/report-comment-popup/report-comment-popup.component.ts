import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ReportUserService} from "../../accommodation/services/report-user.service";
import {UserReport} from "../../accommodation/model/user-report";
import {CommentsService} from "../services/comments.service";
import {SanitizeService} from "../../../security/sanitize.service";

@Component({
  selector: 'app-report-comment-popup',
  templateUrl: './report-comment-popup.component.html',
  styleUrls: ['./report-comment-popup.component.css']
})
export class ReportCommentPopupComponent {
	commentAccId: number | undefined = 0;
	commentHostId: number | undefined = 0;
	isAcc: boolean = true;
	firstname: string = "";
	lastName: string = "";
	title: string = "";

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ReportCommentPopupComponent>,
				private commentsService: CommentsService, private sanitizeService: SanitizeService) {
		this.firstname = data.name;
		this.lastName = data.lastName;
		this.commentAccId = data.commentAccId;
		this.commentHostId = data.commentHostId;
		this.isAcc = data.isAcc;

	}
	reportReason: string = "";
	validator: boolean = false;
	idToSend: number | undefined = 0;

	reportCommentAboutAcc(commentId?: number ): void {
		this.commentsService.reportCommentAboutAcc(commentId as number, true).subscribe({
			next: () => {
				// this.getCommentsAboutAcc();
				console.log("Uspesno reportovanje komentara");
			},
			error: () => {
				console.log("Error reporting comment");
			}
		})
	}

	reportCommentAboutHost(commentId?: number ): void {
		this.commentsService.reportCommentAboutHost(commentId as number, true).subscribe({
			next: () => {
				// this.getCommentsAboutHost();
				console.log("Uspesno reportovanje komentara");
			},
			error: () => {
				console.log("Error reporting comment");
			}
		})
	}

	closeDialog(): void {
		this.dialogRef.close();
	}

	reportUser(): void{
		this.validator = false;
		if(this.reportReason.length < 10){
			this.validator = true;
			return;
		}
		this.idToSend = this.isAcc ? this.commentAccId : this.commentHostId;

		if (this.isAcc){
			this.commentsService.setReportMessageAcc(this.commentAccId as number, this.sanitizeService.sanitize(this.reportReason)).subscribe({
				next:(_) => {
					this.reportCommentAboutAcc(this.commentAccId);
					console.log("Uspesno sam reportovao sa popupom")
				}
			})
		}
		else {
			this.commentsService.setReportMessageHost(this.commentHostId as number, this.sanitizeService.sanitize(this.reportReason)).subscribe({
				next:(_) => {
					this.reportCommentAboutHost(this.commentHostId);
					console.log("Uspesno sam reportovao sa popupom")
				}
			})
		}

		this.dialogRef.close(true);
	}
}
