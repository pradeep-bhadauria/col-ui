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
  url=document.location.href;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  category = null;
  cat_id = null;
  subcategory = null;
  sub_cat_id = null;
  article = null;
  article_id = null;

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
    console.log = function() {}
    this.route.params.subscribe(params => {
      if (params['category'] != undefined) {
        this.category = params['category'];
        this.pageService.getCategoryByName(this.category).subscribe(
          data => {
            if(data.data != undefined){
              var cat = JSON.parse(data.data)
              this.cat_id = cat.id
            } else {
              window.location.href = "/404"
            }
          },
          error => {
            this.alertService.error("Server Error: Please try after some time.");
          }
        );
      }
      if (params['subcategory'] != undefined) {
        this.subcategory = params['subcategory'];
        this.pageService.getSubCategoryByName(this.subcategory).subscribe(
          data => {
            if(data.data != undefined){
              var sub_cat = JSON.parse(data.data)
              this.sub_cat_id = sub_cat.id
            } else {
              window.location.href = "/404"
            }
          },
          error => {
            this.alertService.error("Server Error: Please try after some time.");
          }
        );
      }
      if (params['category'] != undefined) {
        var uid =  params['article'];
        this.pageService.getArticleByUid(uid).subscribe(
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
    });
  }
}
