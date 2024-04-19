import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { AccommodationDetailsComponent } from './accommodation-details/accommodation-details.component';
import {MaterialModule} from "../infrastructure/material/material.module";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {GoogleMapsModule} from "@angular/google-maps"
import { RouterModule } from '@angular/router';
import { AccommodationDetailsImagesComponent } from './accommodation-details-images/accommodation-details-images.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AccommodationCreateComponent } from './accommodation-create/accommodation-create.component';
import { AccommodationPictureUploadComponent } from './accommodation-picture-upload/accommodation-picture-upload.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { AccommodationApprovingComponent } from './accommodation-approving/accommodation-approving.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccommodationsFilterComponent } from './accommodations-filter/accommodations-filter.component';
import { AccommodationsForHostComponent } from './accommodations-for-host/accommodations-for-host.component';
import { AccommodationUpdateComponent } from './accommodation-update/accommodation-update.component';
import { AccommodationUpdatePicturesComponent } from './accommodation-update-pictures/accommodation-update-pictures.component';
import { PriceListUpdateComponent } from './price-list-update/price-list-update.component';
import { GuestNavBarComponent } from '../layout/nav-bar/guest-nav-bar/guest-nav-bar.component';
import { GuestReservationsComponent } from './guest-reservations/guest-reservations.component';
import { HostReservationsComponent } from './host-reservations/host-reservations.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { AnalyticsModule } from '../analytics/analytics.module';
import { ReportPopupComponent } from './report-popup/report-popup.component';
import {CommentsModule} from "../comments/comments.module";
import { AccommodationReservateComponent } from './accommodation-reservate/accommodation-reservate.component';
import { CreateSslPopupComponent } from './create-ssl-popup/create-ssl-popup.component';


@NgModule({
  declarations: [
	AccommodationApprovingComponent,
    AccommodationDetailsComponent,
	AccommodationDetailsImagesComponent,
 AccommodationCreateComponent,
 AccommodationPictureUploadComponent,
 PricelistComponent,
	AccommodationCreateComponent,
 	AccommodationPictureUploadComponent,
  AccommodationsFilterComponent,
  AccommodationsForHostComponent,
  AccommodationUpdateComponent,
  AccommodationUpdatePicturesComponent,
  PriceListUpdateComponent,
  GuestReservationsComponent,
  HostReservationsComponent,
  FavouritesComponent,
  ReportPopupComponent,
  AccommodationReservateComponent,
  CreateSslPopupComponent
  ],
	imports: [
		CommonModule,
		NgOptimizedImage,
		GoogleMapsModule,
		RouterModule,
		MaterialModule,
		NgxDropzoneModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		MatSliderModule,
		AnalyticsModule,
		CommentsModule
	],
	exports: [
		AccommodationDetailsComponent,
		AccommodationDetailsImagesComponent,
		AccommodationCreateComponent,
		AccommodationApprovingComponent,
		AccommodationsFilterComponent,
		AccommodationsForHostComponent,
		GuestReservationsComponent,
		HostReservationsComponent,
		FavouritesComponent,
		CommentsModule
	]
})
export class AccommodationModule { }
