import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserlevelComponent } from './userlevel/userlevel.component';
import { UserlevelService } from './services/index';
import { AlertComponent, AlertService } from './utils/index';


const routes: Routes = [
  { path: 'user-level', component: UserlevelComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    UserlevelComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,HttpModule,
    RouterModule.forRoot(routes, {useHash: true}),
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    UserlevelService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
