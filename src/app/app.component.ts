import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'Col Media';
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
