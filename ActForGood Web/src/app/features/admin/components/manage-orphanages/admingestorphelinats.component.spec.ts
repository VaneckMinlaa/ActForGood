import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingestorphelinatsComponent } from './admingestorphelinats.component';

describe('AdmingestorphelinatsComponent', () => {
  let component: AdmingestorphelinatsComponent;
  let fixture: ComponentFixture<AdmingestorphelinatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmingestorphelinatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmingestorphelinatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
