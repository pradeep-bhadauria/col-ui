import { Component, OnInit } from '@angular/core';
import { UserlevelService } from './../services/index';
import {UserLevel} from './../models/index';
import { Constants, AlertService } from './../utils/index';



@Component({
  selector: 'app-userlevel',
  templateUrl: './userlevel.component.html',
  styleUrls: ['./userlevel.component.css']
})
export class UserlevelComponent implements OnInit {
  ngOnInit() {
  }

  loading = true;
  pageLimit = Constants.DEFAULT.TABLE_PAGINATION_LIMIT;
  offset = Constants.DEFAULT.OFFSET;
  pageOptions = Constants.DEFAULT.TABLE_PAGE_OPTIONS;
  addUserLevel=false;
  arrUserLevel = new Array(); 
  constructor(private userLevelService: UserlevelService, private alertService: AlertService) {
    this.loading = true;
    this.getAll(0);
  } 
  
  getAll(offset: number){
    if(offset==null){offset=0;}
    this.userLevelService.getAll(offset).subscribe(
      data => {
        if(data.data != undefined) {
          var ul = JSON.parse(data.data);
          ul.forEach(e => {
            var u = new UserLevel;
            u.id = e.id;
            u.name = e.name;
            u.desc = e.desc;
            u.updated = e.updated;
            u.created = e.created;
            this.arrUserLevel.push(u);
          });
        } else {
          this.alertService.error(data.message);
        }
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  getUserLevel(userLevelId: number){
    this.userLevelService.getUserLevel(userLevelId).subscribe(
      data => {
        if(data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.alertService.success(data.message);
        } else {
          this.alertService.error(data.message);
        }
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  delete(){
    //console.log(this);    
  }

  addUserLevelMain() {
    if (this.addUserLevel== true){
      this.addUserLevel=false;
    } else {
      this.addUserLevel=true;
    }
  }

  pageLimitChanged(value: number){
    this.pageLimit = value;
  }

  add(a:number,b:number){
    var r = a+b;
    return parseInt(r.toString());
  }

}
