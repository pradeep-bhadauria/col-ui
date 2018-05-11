import { Component, OnInit } from '@angular/core';
import { CMSService, CategoriesService, SubCategoriesService } from './../services/index';
import { Constants, AlertService } from './../utils/index';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {
  countriesList = null;
  statesList = null;
  citiesList = null;

  body = "";
  keyword = "";
  image: FormData = null;
  subject = "";
  country = null;
  state = null;
  city = null;

  regionalFlag = false;
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
    this.getCountries();
  }

  getCountries() {
    this.cmsService.getCountries().subscribe(
      data => {
        if (data.data != undefined) {
          this.countriesList = JSON.parse(data.data);
        }
        console.log(this.countriesList);
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
        this.getSubCategories(this.categoryList[0].id);
      }
    );
  }

  categoryChanged(cid) {
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

  saveBlog(cid, scid) {
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

  regionalCheck() {
    if (this.regionalFlag) {
      this.regionalFlag = false;
      this.country = null;
      this.state = null;
    } else {
      this.regionalFlag = true;
    }
  }

  countryChanged(country) {
    this.country = country;
    this.citiesList = null;
    this.statesList = null;
    document.getElementById("state").setAttribute("disabled","disabled");
    document.getElementById("city").setAttribute("disabled","disabled")
    this.countriesList.forEach(e => {
      if (e.full_name == country) {
        this.statesList = e.states;
        document.getElementById("state").removeAttribute("disabled")
      }
    });
  }
  stateChanged(state: string) {
    this.state = state.split("-")[1];
    var state_id = state.split("-")[0];
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
