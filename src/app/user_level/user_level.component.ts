import { Component } from '@angular/core';

import { UserLevelService } from './user_level.service';
import {UserLevel} from './user_level.model';
import { Constants, AlertService } from './../utils/index';

@Component({
  selector: 'app-user-level',
  templateUrl: './user_level.component.html'
})

export class UserLevelComponent {
  loading = true;

  constructor(private userLevelService: UserLevelService, private alertService: AlertService) {
    var userLevel = new UserLevel()
    this.loading = false;
    userLevelService.getAll(2).subscribe(
      data => {
        console.log(data);
        this.alertService.success(data.message);
        this.loading = false;
      },
      error => console.log('error', error)
  );
  }  
}

