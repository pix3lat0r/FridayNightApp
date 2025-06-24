import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { GuestsComponent } from './features/guests/guests.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ItineraryComponent } from './features/itinerary/itinerary.component';
import { RsvpComponent } from './features/rsvp/rsvp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GuestsComponent,
    ProfileComponent,
    ItineraryComponent,
    RsvpComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
