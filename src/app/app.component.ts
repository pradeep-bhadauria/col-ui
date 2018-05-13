import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {NewsfeedComponent} from './newsfeed/newsfeed.component'
import { Constants, AlertService } from './utils/index';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  showMenu=false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute){
      
    }
  ngOnInit() {
    if (this.currentUser == null){
        this.showMenu = false;
    } else {
        this.showMenu = true;
    }
    this.route.queryParams.subscribe(params => {
      var redirect = params['redirect'];
      if(redirect=="RestrictedAccess"){
        this.alertService.error("Restricted Access: You dont have sufficient permission to access request URL.");
      }

    });

  }

  logout(){
    localStorage.removeItem('currentUser');
    window.location.href="/"
  }

}
