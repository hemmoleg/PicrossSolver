import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollumnInputComponent } from './collumn-input.component';

describe('CollumnInputComponent', () => {
  let component: CollumnInputComponent;
  let fixture: ComponentFixture<CollumnInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollumnInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollumnInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
