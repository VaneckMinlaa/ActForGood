import { Routes } from '@angular/router';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';

export const campaignsRoutes: Routes = [
  {
    path: '',
    component: CampaignListComponent
  },
  {
    path: ':id',
    component: CampaignDetailComponent
  }
];
