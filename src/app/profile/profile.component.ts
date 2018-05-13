import { Component, OnInit } from '@angular/core';
import { ProfileService } from './../services/index';
import { Constants, AlertService } from './../utils/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('currentUser'));
  active = "myarticles";

  articleCount = 0;
  myArticles = null;
  offset = 0;
  limit = Constants.DEFAULT.TABLE_PAGINATION_LIMIT;

  constructor(
    private profileService: ProfileService,
    public alertService: AlertService,
    private route: ActivatedRoute) {
  }
  ngOnInit(){
    this.route.params.subscribe(params => {
      if (params['module'] != undefined) {
        this.active = params['module'].trim();
      }
    });
    this.getMyArticlesCount();
    this.getMyArticles();
  }

  getMyArticles(){
    this.profileService.getMyArticles(this.offset, this.limit).subscribe(
      data => {
        if (data.data != undefined) {
          this.myArticles = JSON.parse(data.data); 
          console.log(this.myArticles);
        }
      }
    );
  }

  getMyArticlesCount() {
    this.profileService.getMyArticlesCount().subscribe(
      data => {
        if (data.data != undefined) {
          this.articleCount = JSON.parse(data.data).count;
        }
      }
    );
  }

}
