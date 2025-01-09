import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocSidebarComponent } from './toc-sidebar.component';

describe('TocSidebarComponent', () => {
  let component: TocSidebarComponent;
  let fixture: ComponentFixture<TocSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TocSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TocSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
