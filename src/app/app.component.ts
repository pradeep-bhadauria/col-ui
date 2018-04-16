import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css', 
    './../assets/font-awesome-4.7.0/css/font-awesome.min.css',
    './../assets/css/bootstrap-notifications.css'
  ]
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  showMenu=false;
  ngOnInit() {
    var currentUser = localStorage.getItem('currentUser');
        if (currentUser == null){
            this.showMenu = false;
        } else {
            this.showMenu = true;
        }
  }
}
