import { Component, OnInit } from '@angular/core';
import { CMSService, CategoriesService, SubCategoriesService } from './../services/index';
import { Constants, AlertService } from './../utils/index';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {
  body = "";
  keyword="";
  image:FormData = null;
  subject="";
  country=null;
  state=null;
  city=null;
  
  regionalFlag=false;
  loading = false;
  categoryList = new Array();
  subCategoryList = new Array();
  constructor(
    private cmsService: CMSService, 
    public alertService: AlertService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService) { 

    }
  ngOnInit() {
    this.getCategoriesCount();
  }
  
  getCategories(c: number) {
    this.categoriesService.getAll(0, c).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          ul.forEach(e => {
            this.categoryList.push(e);
          });
        }
        this.getSubCategories(this.categoryList[0].id);
      }
    );
  }

  categoryChanged(cid){
    this.getSubCategories(cid);
  }

  getCategoriesCount() {
    this.categoriesService.count().subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.getCategories(ul.count);
        }
      }
    );
  }

  getSubCategories(catId: number) {
    this.subCategoriesService.getByCategory(catId).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.subCategoryList = Array();
          ul.forEach(e => {
            this.subCategoryList.push(e);
          });
        }
      }
    );
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.image = formData;
      
    }
  }

  saveBlog(cid, scid){
    this.cmsService.uploadImages(this.image).subscribe(
      data => {
        var image = {
          upload: data.images,
          original: data.images.secure_url,
          banner: data.images.eager[0].secure_url,
          thumbnail: data.images.eager[1].secure_url
        }
        console.log(image);
        this.alertService.success(data.message);
        this.loading = false;
      },
      error => {
        try {
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {
          this.alertService.error("Server Error: Please try after some time.");
        }
      }
    );
  }

  regionalCheck(){
    if(this.regionalFlag){
      this.regionalFlag=false;
      this.country=null;
      this.state=null;
    } else {
      this.regionalFlag=true;
    }
  }
}
