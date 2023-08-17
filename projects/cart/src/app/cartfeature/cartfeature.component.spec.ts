import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartfeatureComponent } from './cartfeature.component';

describe('CartfeatureComponent', () => {
  let component: CartfeatureComponent;
  let fixture: ComponentFixture<CartfeatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartfeatureComponent]
    });
    fixture = TestBed.createComponent(CartfeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
