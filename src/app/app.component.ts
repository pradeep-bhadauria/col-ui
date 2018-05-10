import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {NewsfeedComponent} from './newsfeed/newsfeed.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  showMenu=false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  ngOnInit() {
    if (this.currentUser == null){
        this.showMenu = false;
    } else {
        this.showMenu = true;
    }
  }

  logout(){
    localStorage.removeItem('currentUser');
    window.location.href="/"
  }

}
