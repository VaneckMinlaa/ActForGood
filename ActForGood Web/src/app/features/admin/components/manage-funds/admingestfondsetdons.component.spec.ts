import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingestfondsetdonsComponent } from './admingestfondsetdons.component';

describe('AdmingestfondsetdonsComponent', () => {
  let component: AdmingestfondsetdonsComponent;
  let fixture: ComponentFixture<AdmingestfondsetdonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmingestfondsetdonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmingestfondsetdonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
