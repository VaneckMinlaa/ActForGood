import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingestongComponent } from './admingestong.component';

describe('AdmingestongComponent', () => {
  let component: AdmingestongComponent;
  let fixture: ComponentFixture<AdmingestongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmingestongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmingestongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
