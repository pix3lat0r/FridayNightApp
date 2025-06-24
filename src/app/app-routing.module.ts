import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { GuestsComponent } from './features/guests/guests.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ItineraryComponent } from './features/itinerary/itinerary.component';
import { RsvpComponent } from './features/rsvp/rsvp.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'guests', component: GuestsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'itinerary', component: ItineraryComponent },
  { path: 'rsvp', component: RsvpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
