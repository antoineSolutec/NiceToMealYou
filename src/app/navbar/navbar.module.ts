import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonsModule } from '../shared/design/buttons/buttons.module';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    ButtonsModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
