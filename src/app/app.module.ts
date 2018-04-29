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
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { UserComponent } from './user/user.component';
import { CategoryComponent } from './category/category.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PageComponent } from './page/page.component';
import { NotfoundComponent } from './notfound/notfound.component';


const routes: Routes = [
  { path: '', component: NewsfeedComponent },
  { path: 'user-level', component: UserlevelComponent },
  { path: 'users', component: UserComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'subcategory', component: SubcategoryComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'page', component: PageComponent },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '404' }
];


@NgModule({
  declarations: [
    AppComponent,
    UserlevelComponent,
    AlertComponent,
    NewsfeedComponent,
    UserComponent,
    CategoryComponent,
    SubcategoryComponent,
    ContactusComponent,
    PageComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,HttpModule,
    RouterModule.forRoot(routes, {useHash: false}),
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
