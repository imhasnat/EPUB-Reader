import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toc-sidebar',
  imports: [CommonModule],
  templateUrl: './toc-sidebar.component.html',
  styleUrl: './toc-sidebar.component.css',
})
export class TocSidebarComponent {
  @Input() toc: any[] = [];
  @Output() chapterSelected = new EventEmitter<string>();
  @Input() isTocVisible: boolean = true;
  @Output() tocToggled = new EventEmitter<boolean>();

  toggleToc() {
    this.isTocVisible = !this.isTocVisible;
    this.tocToggled.emit(this.isTocVisible);
  }

  onChapterClick(event: Event, href: string) {
    event.preventDefault();
    this.chapterSelected.emit(href);
  }
}
