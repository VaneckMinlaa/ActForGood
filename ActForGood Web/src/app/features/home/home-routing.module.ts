import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { MissionComponent } from './components/mission/mission.component';
import { GetInvolvedComponent } from './components/get-involved/get-involved.component';
import { StoriesComponent } from './components/stories/stories.component';

export const homeRoutes: Routes = [
  { path: '', redirectTo: 'mission', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'mission', component: MissionComponent },
  { path: 'get-involved', component: GetInvolvedComponent },
  { path: 'stories', component: StoriesComponent }
];
