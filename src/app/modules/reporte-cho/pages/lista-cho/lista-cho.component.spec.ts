import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaChoComponent } from './lista-cho.component';

describe('ListaChoComponent', () => {
  let component: ListaChoComponent;
  let fixture: ComponentFixture<ListaChoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaChoComponent]
    });
    fixture = TestBed.createComponent(ListaChoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
