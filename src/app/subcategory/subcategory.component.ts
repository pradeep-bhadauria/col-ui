import { Component, OnInit } from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import { SubCategoriesService, CategoriesService } from './../services/index';
import { SubCategories, Categories } from './../models/index';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  ngOnInit() {
    this.meta.updateTag({"robots":"noindex, nofollow"});
    this.title.setTitle("Behind Stories - Sub Category");
  }
  accessAllowed=false;
  query="";
  loading = true;
  rowCount=0;
  pageLimit:number = Number(Constants.DEFAULT.TABLE_PAGINATION_LIMIT);
  offset:number = Number(Constants.DEFAULT.OFFSET);
  pageOptions = Constants.DEFAULT.TABLE_PAGE_OPTIONS;
  addSubCategoriesContainer = false;
  arrSubCategories = new Array();
  isEditing=false;
  pValName="";pValDesc="";
  categoryList = new Array(); 
  constructor(
    private subCategoriesService: SubCategoriesService, 
    private alertService: AlertService,
    private categoriesService: CategoriesService,private meta: Meta,
    private title: Title
  ) {
    this.loading = true;
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser == null){
      localStorage.removeItem("currentUser");
      document.location.href = "/login";
    } else if (currentUser.tid != Constants.ROLES.ADMIN){
      document.location.href = "/?redirect=RestrictedAccess"
    } else {
      this.accessAllowed=true;
      this.getCategoriesCount();
      this.getCount();
      this.getAll(this.offset, this.pageLimit);
    }
  }

  getCategories(c:number){
    this.categoriesService.getAll(0,c).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          ul.forEach(e => {
            this.categoryList.push(e);
          });
        }
      }
    );
  }

  getCategoriesCount(){
    this.categoriesService.count().subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.getCategories(ul.count);
        }
      }
    );
  }

  getAll(offset: number,limit: number) {
    if (offset == null) { offset = 0; }
    this.subCategoriesService.getAll(offset,limit).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          ul.forEach(e => {
            var u = new SubCategories;
            u.id = e.id;
            u.name = e.name;
            u.desc = e.desc;
            u.category = e.category;
            u.updated = e.updated;
            u.created = e.created;
            this.arrSubCategories.push(u);
          });
        } else {
          this.alertService.error(data.message);
        }
        this.loading = false;
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
        }
      }
    );
  }

  getSubCategories(userLevelId: number) {
    this.subCategoriesService.getSubCategories(userLevelId).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.alertService.success(data.message);
        } else {
          this.alertService.error(data.message);
        }
        this.loading = false;
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
        }
      }
    );
  }

  getCount() {
    this.subCategoriesService.count().subscribe(
      data => {
        if (data.data != undefined) {
          this.rowCount = JSON.parse(data.data).count;
          if(this.rowCount <=10){
            document.getElementById("page-len").setAttribute("disabled","disabled");
          } else {
            document.getElementById("page-len").removeAttribute("disabled");
          }
        } else {
          this.alertService.error(data.message);
        }
        this.loading = false;
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
        }
      }
    );
  }

  delete(id,name) {
    if(confirm("Are you sure to delete "+name)) {
      this.subCategoriesService.delete(id).subscribe(
        data => {
          this.alertService.success(data.message);
          this.loading = false;
          this.arrSubCategories = Array();
          this.getAll(this.offset, this.pageLimit);
          this.getCount();
        },
        error => {
          try{
            this.alertService.error(JSON.parse(error._body).message);
          }
          catch {  
            this.alertService.error("Server Error: Please try after some time.");
          }
        }
      );
    }
  }

  addSubCategoriesMain() {
    if (this.addSubCategoriesContainer == true) {
      this.addSubCategoriesContainer = false;
    } else {
      this.addSubCategoriesContainer = true;
    }
  }

  addSubCategories(name, desc, cid) {
    this.subCategoriesService.add(name.value.toString(), desc.value.toString(), cid.value.toString()).subscribe(
      data => {
        this.alertService.success(data.message);
        this.loading = false;
        this.arrSubCategories = Array();
        this.getAll(0, this.pageLimit);
        this.getCount();
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {  
          this.alertService.error("Error: Pls check the values. Note: Name must be unique in specified category.");
        }
      }
    );
  }

  pageLimitChanged(value: number) {
    this.pageLimit = parseInt(value.toString());
    this.arrSubCategories = Array();
    if(this.query != "") {
      this.searchResults(this.offset, this.pageLimit);
    } else {
      this.getAll(this.offset, this.pageLimit);
    }
  }

  add(a: number, b: number) {
    if((a+b)>= this.rowCount){
      document.getElementById("next").classList.add("disabled")
      return this.rowCount;
    } else { 
      document.getElementById("next").classList.remove("disabled")
      return a+b;
    }
  }

  save(id, cid, e){
    var target = e.currentTarget;
    var tr = target.parentElement.parentElement;
    var name = tr.children[0].innerHTML.toString().trim();
    var desc = tr.children[1].innerHTML.toString().trim();

    if(name != "" && desc != ""){
      this.subCategoriesService.update(id, name, desc, cid.toString()).subscribe(
        data => {
          this.alertService.success(data.message);
          this.loading = false;
          this.isEditing=false;
          var pElement = target.parentElement;
          var edit = pElement.children[0];
          var del = pElement.children[1];
          var save = pElement.children[2];
          var cancel = pElement.children[3];
          save.classList.remove("visible");
          save.classList.add("hidden");
          cancel.classList.remove("visible");
          cancel.classList.add("hidden");
          edit.classList.remove("hidden");
          edit.classList.add("visible");
          del.classList.remove("hidden");
          del.classList.add("visible");
          var tr = target.parentElement.parentElement;
          tr.classList.remove("editing")
          tr.children[0].classList.remove("editable")
          tr.children[1].classList.remove("editable")
          tr.children[0].contentEditable=false;
          tr.children[1].contentEditable=false;
        },
        error => {
          try{
            this.alertService.error(JSON.parse(error._body).message);
          }
          catch {  
            this.alertService.error("Error: Pls check the values. Name must be unique.");
          }
        }
      );
    } else {
      this.alertService.error('Value should be atleast 3 characters long.');
    }
  }

  edit(e) {
    if(this.isEditing==false){
      this.isEditing=true;
      var target = e.currentTarget;
      var pElement = target.parentElement;
      var edit = pElement.children[0];
      var del = pElement.children[1];
      var save = pElement.children[2];
      var cancel = pElement.children[3];
      save.classList.remove("hidden");
      save.classList.add("visible");
      cancel.classList.remove("hidden");
      cancel.classList.add("visible");
      edit.classList.remove("visible");
      edit.classList.add("hidden");
      del.classList.remove("visible");
      del.classList.add("hidden");

      var tr = target.parentElement.parentElement;
      tr.classList.add("editing");
      tr.children[0].classList.add("editable")
      tr.children[1].classList.add("editable")
      tr.children[0].contentEditable=true;
      tr.children[1].contentEditable=true;
      tr.children[0].focus();
      this.pValName=tr.children[0].innerHTML.toString().trim();
      this.pValDesc = tr.children[1].innerHTML.toString().trim();
    }
    else {
      this.alertService.error('Pls save/cancel changes before editing next.');
    }
    

  }

  cancelEdit(e) {
    this.isEditing=false;
    var target = e.currentTarget;
    var pElement = target.parentElement;
    var edit = pElement.children[0];
    var del = pElement.children[1];
    var save = pElement.children[2];
    var cancel = pElement.children[3];
    save.classList.remove("visible");
    save.classList.add("hidden");
    cancel.classList.remove("visible");
    cancel.classList.add("hidden");
    edit.classList.remove("hidden");
    edit.classList.add("visible");
    del.classList.remove("hidden");
    del.classList.add("visible");
    var tr = target.parentElement.parentElement;
    tr.classList.remove("editing")
    tr.children[0].classList.remove("editable")
    tr.children[1].classList.remove("editable")
    tr.children[0].contentEditable=false;
    tr.children[1].contentEditable=false;
    tr.children[0].innerHTML=this.pValName;this.pValName="";
    tr.children[1].innerHTML=this.pValDesc;this.pValDesc="";
  }
  
  offsetChanged(o: number){
    if(o==1){
      this.offset= this.offset + this.pageLimit;
    } else {
      this.offset= this.offset - this.pageLimit;
    }
    if (this.offset != 0){
      document.getElementById("prev").classList.remove("disabled")
    } else {
      document.getElementById("prev").classList.add("disabled")
    }
    this.arrSubCategories=Array();
    if(this.query != "") {
      this.searchResults(this.offset, this.pageLimit);
    } else {
      this.getAll(this.offset, this.pageLimit);
    }
  }

  searchResults(offset:number, limit:number){
    this.subCategoriesService.search(this.query,this.offset,this.pageLimit).subscribe(
      data => {
        if (data.data != undefined) {
          this.arrSubCategories=Array();
          var ul = JSON.parse(data.data);
          ul.forEach(e => {
            var u = new SubCategories;
            u.id = e.id;
            u.name = e.name;
            u.desc = e.desc;
            u.category = e.category;
            u.updated = e.updated;
            u.created = e.created;
            this.arrSubCategories.push(u);
          });
        } else {
          this.alertService.success(data.message);
        }
        this.loading = false;
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
        }
      }
    );
  }

  search(query:String){
    this.offset=0;
    document.getElementById("prev").classList.add("disabled")
    this.pageLimit=Constants.DEFAULT.TABLE_PAGINATION_LIMIT;
    this.query=query.toString().trim();
    this.searchCount();
    this.searchResults(this.offset, this.pageLimit);
  }

  searchCount(){
    this.offset=0;
    this.pageLimit=Constants.DEFAULT.TABLE_PAGINATION_LIMIT;
    this.subCategoriesService.searchCount(this.query).subscribe(
      data => {
        if (data.data != undefined) {
          this.rowCount = JSON.parse(data.data).count;
          if(this.rowCount <=10){
            document.getElementById("page-len").setAttribute("disabled","disabled");
          } else {
            document.getElementById("page-len").removeAttribute("disabled");
          }

        } else {
          this.alertService.error(data.message);
        }
        this.loading = false;
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
        }
      }
    );
  }
}
