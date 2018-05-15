import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {NewsfeedComponent} from './newsfeed/newsfeed.component'
import { SubCategoriesService, PageService } from './services';
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
  menuMap = new Map<string, string[]>();
  catMap = new Map<string, number>();
  latestNews=null;
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private subCategoryService: SubCategoriesService,
    private pageService: PageService
  ){
      
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
    this.getSubCategories();
  }

  getSubCategories(){
    this.subCategoryService.count().subscribe(
      data=>{
        this.subCategoryService.getAll(0,JSON.parse(data.data).count).subscribe(
          data=>{
            var sub = JSON.parse(data.data);
            sub.forEach(element => {
              var cat=element.category.name;
              if(!this.catMap.has(cat)){
                this.catMap.set(cat,element.category.id);
              }
              if(this.menuMap.has(cat)) {
                this.menuMap.get(cat).push(element.name);
              } else {
                this.menuMap.set(cat,[element.name]);
              }
            });
            this.getLatestNews();
          }
        );
      }
    );
  }

  getLatestNews(){
    var cat_id = this.catMap.get(Constants.CATEGORIES.NEWS);
    this.pageService.getPublishedArticleByCategory(cat_id, 0, 10).subscribe(
      data=>{
        this.latestNews = JSON.parse(data.data);
        //this.latestNews = '<li><a href="#"><img src="/assets/images/news_thumbnail3.jpg" alt="">My Fourth News Item</a></li><li><a href="#"><img src="/assets/images/news_thumbnail3.jpg" alt="">My Sixth News Item</a></li><li><a href="#"><img src="/assets/images/news_thumbnail3.jpg" alt="">My Seventh News Item</a></li><li><a href="#"><img src="/assets/images/news_thumbnail3.jpg" alt="">My Eighth News Item</a></li><li><a href="#"><img src="/assets/images/news_thumbnail2.jpg" alt="">My Ninth News Item</a></li>';
        
      }
    );

  }

  logout(){
    localStorage.removeItem('currentUser');
    window.location.href="/"
  }

}
