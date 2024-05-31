import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgitroComidasComponent } from './resgitro-comidas.component';

describe('ResgitroComidasComponent', () => {
  let component: ResgitroComidasComponent;
  let fixture: ComponentFixture<ResgitroComidasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResgitroComidasComponent]
    });
    fixture = TestBed.createComponent(ResgitroComidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
