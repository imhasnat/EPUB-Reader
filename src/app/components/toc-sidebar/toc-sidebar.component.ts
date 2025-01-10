import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-toc-sidebar',
  imports: [CommonModule],
  templateUrl: './toc-sidebar.component.html',
  styleUrl: './toc-sidebar.component.css',
})
export class TocSidebarComponent {
  isDarkMode$: any;
  @Input() toc: any[] = [];
  @Output() chapterSelected = new EventEmitter<string>();
  @Input() isTocVisible: boolean = false;
  @Output() tocToggled = new EventEmitter<boolean>();

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleToc() {
    this.isTocVisible = !this.isTocVisible;
    this.tocToggled.emit(this.isTocVisible);
  }

  onChapterClick(event: Event, href: string) {
    event.preventDefault();
    this.chapterSelected.emit(href);
  }
}
