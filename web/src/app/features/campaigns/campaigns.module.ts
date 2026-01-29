import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';

const routes: Routes = [
  { path: '', component: CampaignListComponent },
  { path: ':id', component: CampaignDetailComponent }
];

@NgModule({
  declarations: [
    CampaignListComponent,
    CampaignDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CampaignsModule { }
