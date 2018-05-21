import { Headers, RequestOptions } from '@angular/http';

export class Constants {
  public static API_ENDPOINT = 'http://ws.behindstories.com';
  //public static API_ENDPOINT='http://localhost:5000';

  public static LOADING = false;

  public static ROLES = {
    ADMIN: 2,
    VIEWERS: 28,
    AUTHORS: 29
  }
  public static DEFAULT = {
    PUBLISHED: 1,
    OFFSET: 0,
    TABLE_PAGINATION_LIMIT: 10,
    TABLE_PAGE_OPTIONS: [10, 25, 50, 100]
  }
  public static jwt() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }

  public static showLoader(){
    document.getElementById("preloader").style.removeProperty("display");
    document.getElementById("status").style.removeProperty("display");
  }

  public static hideLoader(){
    document.getElementById("preloader").style.setProperty("display","none");
    document.getElementById("status").style.setProperty("display","none");
  }

  public static CATEGORIES = {
    LIFESTYLE:"Lifestyle",
    ENTERTAINMENT:"Entertainment",
    TECHNOLOGY:"Technology",
    BUSINESS:"Business",
    NEWS:"News",
    SPORTS:"Sports",
    HUMOUR:"Humour"
  }
}