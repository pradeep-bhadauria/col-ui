import { Component, OnInit } from '@angular/core';
import { CMSService, CategoriesService, SubCategoriesService } from './../services/index';
import { Constants, AlertService } from './../utils/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {
  countriesList = null;
  statesList = null;
  citiesList = null;
  article_id = null;

  body = "";
  keyword = "";
  image: FormData = null;

  displayImage = null;
  imageUrl = {
    upload: "",
    original: "",
    banner: "",
    thumbnail: ""
  };

  selectedCategory = null;
  selectedSubCategory = null;
  subject = "";
  overview = "";
  country = "";
  state = "";
  city = "";

  regionalFlag = false;
  loading = false;
  categoryList = new Array();
  subCategoryList = new Array();

  stats = {
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0
  }

  constructor(
    private cmsService: CMSService,
    public alertService: AlertService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService) {
  }
  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser == null) {
      window.location.href = "/login"
    }
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.article_id = +params['id']; // (+) converts string 'id' to a number
      }
    });
    this.getCategoriesCount();
    this.getCountries();
    if (this.article_id != null) {
      this.cmsService.getArticleById(this.article_id).subscribe(
        data => {
          if (data.data != undefined) {
            let article = JSON.parse(data.data);
            if (currentUser.id != article.author.id && currentUser.tid != Constants.ROLES.ADMIN) {
              window.location.href = "/404"
            } else {
              this.subject = article.subject;
              try {
                JSON.parse(article.keywords.replace(/\'/g, "\"")).forEach(element => {
                  this.keyword = this.keyword + " " + element.keyword
                });
              } catch {
                article.keywords.forEach(element => {
                  this.keyword = this.keyword + " " + element.keyword
                });
              }
              this.keyword = this.keyword.trim();
              this.overview = article.overview;
              this.body = article.body;
              this.selectedCategory = article.category.id;
              this.selectedSubCategory = article.sub_category.id;
              this.imageUrl = article.images;
              this.displayImage = this.imageUrl.thumbnail;
              this.country = article.country;
              this.state = article.state;
              this.city = article.city;
              if (this.country.trim() != "") {
                this.regionalFlag = true;
              }
            }
          } else {
            this.alertService.error(data.message);
          }
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
  }

  getCountries() {
    this.cmsService.getCountries().subscribe(
      data => {
        if (data.data != undefined) {
          this.countriesList = JSON.parse(data.data);
          if (this.country.trim() != "" && this.regionalFlag) {
            this.countryChanged(0);
          }
        }
      }
    );
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
        if (this.selectedCategory == null) {
          this.selectedCategory = this.categoryList[0].id;
        }
        this.getSubCategories();
      }
    );
  }

  categoryChanged(cid) {
    this.selectedCategory = cid;
    this.getSubCategories();
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

  getSubCategories() {
    this.subCategoriesService.getByCategory(this.selectedCategory).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.subCategoryList = Array();
          ul.forEach(e => {
            this.subCategoryList.push(e);
          });
          if (this.selectedSubCategory == null) {
            this.selectedSubCategory = this.subCategoryList[0].id;
          }
        }
      }
    );
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name.toLowerCase());
      this.image = formData;
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.displayImage = e.target.result;
      }
      reader.readAsDataURL(file);

    }
  }

  saveBlog() {
    if (this.image != null) {
      if (this.article_id == null) {
        this.addArticle();
      } else {
        this.uploadImage(false);
      }
    } else if (this.article_id == null) {
      this.addArticle();
    } else {
      this.updateArticle(false);
    }
  }

  uploadImage(flag: boolean) {
    this.cmsService.uploadImages(this.image, this.article_id).subscribe(
      data => {
        this.imageUrl.upload = data.images;
        this.imageUrl.original = data.images.secure_url;
        this.imageUrl.banner = data.images.eager[0].secure_url;
        this.imageUrl.thumbnail = data.images.eager[1].secure_url;
        this.updateArticle(flag);
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

  addArticle() {
    this.cmsService.add(this.selectedCategory, this.selectedSubCategory, this.subject, this.overview, this.keyword, this.imageUrl, this.country, this.state, this.body, this.city).subscribe(
      data => {
        if (data.data != undefined) {
          this.article_id = data.data.id;
          if (this.image != null) {
            this.uploadImage(true);
          } else {
            this.alertService.success("Success: Article created successfully");
          }

        }
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

  updateArticle(flag: boolean) {
    this.cmsService.update(this.article_id, this.selectedCategory, this.selectedSubCategory, this.subject, this.overview, this.keyword, this.imageUrl, this.country, this.state, this.body, this.city).subscribe(
      data => {
        if (flag) {
          this.alertService.success("Success: Article created successfully");
        } else {
          this.alertService.success("Success: Article updated successfully");
        }
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

  regionalCheck() {
    if (!this.regionalFlag) {
      this.country = "";
      this.state = "";
      this.city = "";
    }
  }

  countryChanged(flag: number) {
    if (flag == 1) {
      this.state = "";
      this.city = "";
    }
    this.citiesList = null;
    this.statesList = null;
    document.getElementById("state").setAttribute("disabled", "disabled");
    document.getElementById("city").setAttribute("disabled", "disabled")
    this.countriesList.forEach(e => {
      if (e.full_name == this.country.trim()) {
        this.statesList = e.states;
        document.getElementById("state").removeAttribute("disabled")
        if (this.state.trim() != "" && this.regionalFlag) {
          this.stateChanged()
        }
      }
    });
  }
  stateChanged() {
    var state_id = this.state.split("-")[0];
    this.countriesList.forEach(e => {
      if (e.full_name == this.country) {
        e.cities.forEach(e1 => {
          if (e1.state_id == state_id) {
            this.citiesList = e1.cities;
            document.getElementById("city").removeAttribute("disabled")
          }
        });
      }
    });
  }
}
