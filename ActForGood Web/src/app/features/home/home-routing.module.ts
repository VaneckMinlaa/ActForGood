import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { GetInvolvedComponent } from './components/get-involved/get-involved.component';
import { StoriesComponent } from './components/stories/stories.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { StoryDetailComponent } from './components/stories/story-detail/story-detail.component';

export const homeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'get-involved', component: GetInvolvedComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'stories/:id', component: StoryDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'services', component: ServicesComponent }
];
