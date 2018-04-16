import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserLevelComponent } from './user_level.component';
import { UserLevelService } from './user_level.service';
import { routes } from './user_level.router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserLevelComponent
  ],
  providers: [
    UserLevelService
  ],
  bootstrap: [
    UserLevelComponent
  ]
})

export class UserLevelModule { }
