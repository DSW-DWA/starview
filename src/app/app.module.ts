import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from "@angular/common/http";

import {MatTabsModule} from '@angular/material/tabs';
import { ConstellationsComponent } from './Components/constellations/constellations.component';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from '@angular/material/select';
import { ConstellationCreateDialogComponent } from './Components/constellation-create-dialog/constellation-create-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { GalaxiesComponent } from './Components/galaxies/galaxies.component';
import { PlanetsComponent } from './Components/planets/planets.component';
import { UniversesComponent } from './Components/universes/universes.component';
import { StarsComponent } from './Components/stars/stars.component';
import { UniverseCreateDialogComponent } from './Components/universe-create-dialog/universe-create-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { PlanetCreateDialogComponent } from './Components/planet-create-dialog/planet-create-dialog.component';
import { GalaxyCreateDialogComponent } from './Components/galaxy-create-dialog/galaxy-create-dialog.component';
import { StarCreateDialogComponent } from './Components/star-create-dialog/star-create-dialog.component';
import { AlertDialogComponent } from './Components/alert-dialog/alert-dialog.component';
import { OtherComponent } from './Components/other/other.component';
import { AuditsComponent } from './Components/audits/audits.component';
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    AppComponent,
    ConstellationsComponent,
    ConstellationCreateDialogComponent,
    GalaxiesComponent,
    PlanetsComponent,
    UniversesComponent,
    StarsComponent,
    UniverseCreateDialogComponent,
    PlanetCreateDialogComponent,
    GalaxyCreateDialogComponent,
    StarCreateDialogComponent,
    AlertDialogComponent,
    OtherComponent,
    AuditsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
