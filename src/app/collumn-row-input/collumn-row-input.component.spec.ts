import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollumnRowInputComponent } from './collumn-row-input.component';

describe('CollumnInputComponent', () => {
  let component: CollumnRowInputComponent;
  let fixture: ComponentFixture<CollumnRowInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollumnRowInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollumnRowInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
