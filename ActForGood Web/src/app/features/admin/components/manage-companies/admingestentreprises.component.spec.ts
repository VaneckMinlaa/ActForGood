import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingestentreprisesComponent } from './admingestentreprises.component';

describe('AdmingestentreprisesComponent', () => {
  let component: AdmingestentreprisesComponent;
  let fixture: ComponentFixture<AdmingestentreprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmingestentreprisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmingestentreprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
