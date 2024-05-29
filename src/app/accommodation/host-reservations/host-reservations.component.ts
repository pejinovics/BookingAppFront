import { ChangeDetectorRef, Component, NgZone, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Reservation, ReservationFilter, ReservationStatus } from 'src/app/accommodation/model/reservation.model';
import { ReservationService } from '../services/reservation.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/services/auth.service';
import { CreateNotificationGuest } from 'src/app/notification/model/notification-guest';
import { NotificationForGuestService } from 'src/app/notification/services/notification-for-guest.service';
import { ReportPopupComponent } from '../report-popup/report-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { endOf } from 'ngx-bootstrap/chronos';
import {SanitizeService} from "../../../security/sanitize.service";

@Component({
  selector: 'app-host-reservations',
  templateUrl: './host-reservations.component.html',
  styleUrls: ['./host-reservations.component.css']
})
export class HostReservationsComponent {
  dialogRef!: MatDialogRef<ReportPopupComponent>;

  reservations: Reservation[] = [];
  dataSource!: MatTableDataSource<Reservation>;
  displayedColumns: string[] = ['select', 'guest', 'numberOfCancellation', 'accommodation', 'startDate', 'endDate', 'status', 'price'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isBtnDisabled: boolean = true;

  canReportUser(reservation: Reservation):boolean {
    let currentDate:Date = new Date();
    if(reservation.endDate == null){
      return false;
    }
    const reservationEndDate: Date = new Date(reservation.endDate);

    const formattedReservationEndDate: Date = new Date(reservationEndDate.getFullYear(), reservationEndDate.getMonth(), reservationEndDate.getDate());
    const formattedCurrentDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    return formattedReservationEndDate <= formattedCurrentDate && reservation.status == ReservationStatus.ACCEPTED && !reservation.guestReported ;
  }
  openDialog(reservation: Reservation): void {
    this.dialogRef = this.matDialog.open(ReportPopupComponent, {
      data:{
        name:reservation.guest?.name,
        lastName: reservation.guest?.lastName,
        userReportedId:reservation.guest?.user?.id,
        userReportingId:this.authService.getId(),
        reservationId:reservation.id,
      }
    });
    this.dialogRef.afterClosed().subscribe((result:boolean) => {
      if(result){
        reservation.guestReported = true;
      }
    });
  }

  selection = new SelectionModel<Reservation>(true, []);

  selectionToggle(row: any) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.updateButtonState();
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.updateButtonState();
    }
  }

  updateButtonState() {
    let startDate:Date = new Date(this.selection.selected[0].startDate!);
    this.isBtnDisabled = !(this.selection.selected.length === 1 && this.selection.selected[0].status === ReservationStatus.PENDING && startDate > new Date());
  }

  refreshTable():void {
    this.getHostReservations({hostId : this.authService.getId()});
    this.searchForm.reset();
  }

  constructor(private reservationService: ReservationService,
    private fb: FormBuilder, private authService: AuthService,
    private cdr:ChangeDetectorRef, private zone: NgZone,
    private notificationService:NotificationForGuestService,
    private matDialog: MatDialog, private sanitizeService: SanitizeService) {}

  searchForm: FormGroup = this.fb.group({
    search: [''],
    startDate: [''],
    endDate: [''],
    status: ['']
  });

  ngOnInit(): void {
    this.getHostReservations({hostId : this.authService.getId()});
  }

  getHostReservations(filter: ReservationFilter):void {
    this.reservationService.getHostReservations(filter).subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data;
        this.dataSource = new MatTableDataSource<Reservation>(this.reservations);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {console.log("Error!")}
    })
  }

  getStatusStyles(status: ReservationStatus): any {
    let backgroundColor: string = '';

    if (status === ReservationStatus.ACCEPTED) {
      backgroundColor = '#D4F8D3';
    } else if (status === ReservationStatus.CANCELLED) {
      backgroundColor = '#FF4158';
    } else if(status === ReservationStatus.PENDING) {
      backgroundColor = '#F8F4D3';
    }else if(status === ReservationStatus.EXPIRED) {
      backgroundColor = '#D0CFC6';
    }else if(ReservationStatus.DECLINED) {
      backgroundColor = '#CA0A0A';
    }

    return {
      'background-color': backgroundColor,
      'color': '#575C61',
      'padding': '2px 8px 2px 8px',
      'border-radius': '8px',
      'opacity': '80%',
      'width': 'max-content'
    };
  }


  dateWrong:boolean = false;

  search(): void{
    this.dateWrong = false;

    const filter: ReservationFilter = {
      hostId: this.authService.getId()
    };

    const startDateValue = this.searchForm.get('startDate')?.value;
    const endDateValue = this.searchForm.get('endDate')?.value;
    const search = this.sanitizeService.sanitize(this.searchForm.get('search')?.value);
    const status = this.searchForm.get('status')?.value;

    if (startDateValue !== null && startDateValue !== '') {
      if(endDateValue !== null && endDateValue !== ''){
        if (!(startDateValue > endDateValue)){
          filter.startDate = startDateValue;
          filter.endDate = endDateValue;
        }else{
          this.dateWrong = true;
          return;
        }
      }
    }
    if(status !== '' && status !== 'ALL'){
      filter.status = status;
    }
    if(search !== ''){
      filter.title = search;
    }

    this.getHostReservations(filter);
  }

  onAccept(): void {
    this.reservationService.updateReservationStatus(this.selection.selected[0].id!, ReservationStatus.ACCEPTED).subscribe({
      next: () => {
        this.refreshTable();
      },
      error: () => {console.log("Error!")}
    });
  }

  onDecline(): void {
    this.reservationService.updateReservationStatus(this.selection.selected[0].id!, ReservationStatus.DECLINED).subscribe({
      next: () => {
        this.refreshTable();
      },
      error: () => {console.log("Error!")}
    });
  }
}
