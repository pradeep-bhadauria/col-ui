import { Route } from '@angular/router';

export const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'user'},
  { loadChildren: 'app/user_level/user_level.module#UserLevelModule', path: 'user-level' }
];
