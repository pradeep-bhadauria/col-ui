import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {NewsfeedComponent} from './newsfeed/newsfeed.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  showMenu=false;
  ngOnInit() {
    var currentUser = localStorage.getItem('currentUser');
    if (currentUser == null){
        this.showMenu = false;
    } else {
        this.showMenu = true;
    }
    /*
    var is_root = location.pathname == "/";
    this.target.clear();
    if(is_root){
      this.showFeeds()
    }
    */
  }
  /*
  @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {}

  showFeeds() {
    let compFactory = this.cfr.resolveComponentFactory(NewsfeedComponent);
    this.target.createComponent(compFactory);
  }
  */
}
