import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatchingComponent } from './components/matching/matching.component';
import { matchingRoutes } from './matching-routing.module';

@NgModule({
  declarations: [
    MatchingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(matchingRoutes),
    SharedModule
  ]
})
export class MatchingModule { }
