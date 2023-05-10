import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowedRoutingModule } from './showed-routing.module';
import { ShowedComponent } from './showed.component';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShowLignesComponent } from '../show-lignes/show-lignes.component';
import { ShowHorairesModule } from '../show-horaires/show-horaires.module';
import { CardModule } from '../card/card.module';
import { NavbarModule } from '../navbar/navbar.module';
import { GraphBarModule } from '../graph-bar/graph-bar.module';


@NgModule({
  declarations: [
    ShowedComponent,
    ShowLignesComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ShowedRoutingModule,
    FontAwesomeModule,
    NgCircleProgressModule.forRoot({}),
    MatListModule,
    MatTooltipModule,
    ShowHorairesModule,
    NavbarModule,
    GraphBarModule,
    CardModule
  ]
})
export class ShowedModule {
  constructor(library: FaIconLibrary){
    library.addIcons(
      faSquare,
      faCheckSquare,
    );
  }
}
