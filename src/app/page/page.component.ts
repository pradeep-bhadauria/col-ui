import { Component, OnInit } from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import { PageService } from './../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  infiniteScrollCount=0;
  offset=0;
  limit=1;//Constants.DEFAULT.TABLE_PAGINATION_LIMIT;
  htmlVariable = "";
  displayFlag=0;
  url=null;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  category = null;
  cat_id = null;
  subcategory = null;
  sub_cat_id = null;
  article = null;
  articeByCategory = null;
  articeBySubCategory = null;
  article_id = null;
  uid=null;



  constructor(
    public alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['category'] != undefined) {
        this.category = params['category'];
        this.checkCategory(params);
      }
    });
  }

  checkCategory(params){
    this.pageService.getCategoryByName(this.category).subscribe(
      data => {
        if(data.data != undefined){
          var cat = JSON.parse(data.data);
          this.category = cat.name;
          this.cat_id = cat.id; 
          if (params['subcategory'] != undefined) {
            this.subcategory = params['subcategory'];
            this.checkSubCategory(params);
          } else {
            document.getElementById("comments").classList.add("hide");
            this.getArticlesByCategory();
          }
        } else {
          window.location.href = "/404";
        }
      },
      error => {
        this.alertService.error("Server Error: Please try after some time.");
      }
    );
  }

  checkSubCategory(params){
    this.pageService.getSubCategoryByName(this.subcategory).subscribe(
      data => {
        if(data.data != undefined){
          var sub_cat = JSON.parse(data.data);
          this.sub_cat_id = sub_cat.id;
          this.subcategory = sub_cat.name;  
          if (params['article'] != undefined) {
            this.uid =  params['article'];
            this.getArticleByUid();
          } else {
            document.getElementById("comments").classList.add("hide");
            this.getArticlesBySubCategory();
          }
        } else {
          window.location.href = "/404";
        }
      },
      error => {
        this.alertService.error("Server Error: Please try after some time.");
      }
    );
  }

  getArticlesByCategory(){
    this.pageService.getPublishedArticleByCategory(this.cat_id, this.offset, this.limit).subscribe(
      data => {
        try{
          this.articeByCategory = JSON.parse(data.data);
          this.getCategoryCount();
          //var html = this.makeContent(this.articeByCategory);
          //this.htmlVariable += html;
          //document.getElementById("articeByCategoryContainer");
        } catch {
          this.articeByCategory = null;
        }
        this.displayFlag=1;
      }
    );
  }

  getArticlesBySubCategory(){
    this.pageService.getPublishedArticleBySubCategory(this.cat_id, this.sub_cat_id, this.offset, this.limit).subscribe(
      data => {
        try{
          this.articeBySubCategory = JSON.parse(data.data);
          this.getSubCategoryCount();
        } catch {
          this.articeBySubCategory = null;
        }
        this.displayFlag=2;
      }
    );
  }

  getArticleByUid(){
    this.url = document.location.href;
    this.pageService.getArticleByUid(this.uid).subscribe(
      data => {
        if(data.data != undefined){
          var temp = JSON.parse(data.data);
          if(this.currentUser == null && temp.is_published != Constants.DEFAULT.PUBLISHED){
            window.location.href = "/404";
          } else if (this.currentUser != null && 
            this.currentUser.id != temp.author.id && 
            temp.is_published != Constants.DEFAULT.PUBLISHED && 
            this.currentUser.tid != Constants.ROLES.ADMIN){
            window.location.href = "/404";
          } else {
            this.article = temp;
            this.article.body = this.sanitizer.bypassSecurityTrustHtml(this.article.body)
            this.title.setTitle(this.article.subject);
            console.log(this.article);
            var keyword="";
            this.article.keywords.forEach(element => {
              keyword = keyword + " " + element.keyword;
            });
            this.meta.updateTag({name:"description",content:this.article.overview});
            this.meta.updateTag({name: "keywords", content:keyword.trim()});
            this.displayFlag=3;
          }
        } else {
          window.location.href = "/404"
        }
      },
      error => {
        this.alertService.error("Server Error: Please try after some time.");
      }
    );
  }

  getMore(){
    this.offset = this.offset + this.limit;
    if(this.offset < this.infiniteScrollCount ){
      if(this.displayFlag == 1){
        this.getArticlesByCategory();
      } else if (this.displayFlag == 2){
        this.getArticlesBySubCategory();
      }
    } else {
      document.getElementById("get-more").setAttribute("disabled","disabled");
      this.alertService.error("No more articles available..");
    }
  }

  getCategoryCount(){
    this.pageService.getPublishedArticleByCategoryCount(this.cat_id).subscribe(
      data=>{
        this.infiniteScrollCount = JSON.parse(data.data).count;
      }
    )
  }

  getSubCategoryCount(){
    this.pageService.getPublishedArticleBySubCategoryCount(this.cat_id, this.sub_cat_id).subscribe(
      data=>{
        this.infiniteScrollCount = JSON.parse(data.data).count;
      }
    )
  }

  makeContent(data){
    var htmlStr="";
    data.forEach(item => {
      htmlStr = htmlStr +`<div class="col-sm-12 contpost">
        <div class="row">
          <div class="col PostTitle">
            <h5><a href="/articles/`+ item.category.name.toLowerCase() +`/`+ item.sub_category.name.toLowerCase() +`/`+ item.uid+`">`+item.subject+`</a></h5>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3 col-xs-4">
            <img class="thumbnail center" src="`+item.images.thumbnail+`" alt="No Image"/>
          </div>
          <div class="col-sm-9 col-xs-8">      
            <p>`+item.overview+`</p>
            <p><span class="badge badge-info">`+item.category.name+`</span> <span class="glyphicon glyphicon-chevron-right"></span> <span class="badge badge-info">`+item.sub_category.name+`</span></p>
            <p>
              <span class="PostDate"><i class="fa fa-calendar"></i> `+item.created+`</span>
            </p>
          </div>
        </div>
        <div class="row hidden-sm hidden-xs">
          <div class="col small p-2">
            <p>
              <span><i class="fa fa-user"></i> `+item.author.user_fname+` `+item.author.user_lname+`</span> 
              | <span><i class="fa fa-comment"></i> `+item.stats.comments+` Comments</span>
              | <span><i class="fa fa-thumbs-up"></i> `+item.stats.shares+` Likes</span>
              | <span><i class="fa fa-eye"></i> `+item.stats.views+` Views</span>
              | <span><i class="fa fa-share"></i> `+item.stats.shares+` Shares</span>
            </p>
          </div>
        </div>
      </div>`  
    });
    return htmlStr;
  }
}
