import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Constants, AlertService } from './../utils/index';
import { UserService } from './../services/index';

@Component({
  selector: 'app-comfirmemail',
  templateUrl: './comfirmemail.component.html',
  styleUrls: ['./comfirmemail.component.css']
})
export class ComfirmemailComponent implements OnInit {
  loading=false;
  message = "";
  constructor(private activatedRoute: ActivatedRoute,private userService: UserService, private alertService: AlertService) { 
    
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let email = params['email'];
      let token = params['token'];
      this.userService.confirmEmail(email,token).subscribe(
        data => {
          this.loading = false;
          this.message = data.message;
        },
        error => {
          try{
            this.message = JSON.parse(error._body).message;
          }
          catch {  
            this.message = "Server Error: Please try after some time.";
          }
        }
      );
    });
  }

}
