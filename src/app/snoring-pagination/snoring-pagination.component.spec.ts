import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoringPaginationComponent } from './snoring-pagination.component';

describe('SnoringPaginationComponent', () => {
  let component: SnoringPaginationComponent;
  let fixture: ComponentFixture<SnoringPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnoringPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnoringPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
